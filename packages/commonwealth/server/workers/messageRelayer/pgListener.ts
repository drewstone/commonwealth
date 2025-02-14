import { stats } from '@hicommonwealth/core';
import { logger } from '@hicommonwealth/logging';
import { delay } from '@hicommonwealth/shared';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { NODE_ENV } from '../../config';
import { incrementNumUnrelayedEvents } from './relayForever';

const __filename = fileURLToPath(import.meta.url);
const log = logger(__filename);
const OUTBOX_CHANNEL = 'outbox_channel';
let retryCount = 0;
const maxRetries = 5;
let connected = false;

async function connectListener(client: pg.Client) {
  try {
    await client.query(`LISTEN "${OUTBOX_CHANNEL}";`);
  } catch (err) {
    log.fatal('Failed to setup Postgres listener. Exiting...', err);
    process.exit(1);
  }
}

async function reconnect(client: pg.Client) {
  if (retryCount < maxRetries) {
    // Exponential backoff strategy for reconnection attempts
    const timeout = Math.pow(2, retryCount) * 1000;
    log.warn(`Attempting to reconnect in ${timeout / 1000} seconds...`);
    retryCount++;

    try {
      if (!connected) {
        await client.connect();
        connected = true;
      }
    } catch (err) {
      log.error('Subscriber failed to reconnect', err);
      await delay(timeout);
      return reconnect(client);
    }
  } else {
    log.fatal('Max retry attempts reached. Exiting...');
    try {
      await client.end();
    } catch (e) {
      log.error('Failed to close pg client', e);
    }
    process.exit(1);
  }
}

export async function setupListener(): Promise<pg.Client> {
  log.info('Setting up listener...');
  const { DATABASE_URI } = await import('@hicommonwealth/model');
  const client = new pg.Client({
    connectionString: DATABASE_URI,
    ssl: ['test', 'development'].includes(NODE_ENV)
      ? false
      : { rejectUnauthorized: false },
  });

  client.on('notification', (payload) => {
    log.info('Notification received', { payload });
    incrementNumUnrelayedEvents(1);
    stats().increment('messageRelayerNotificationReceived');
  });

  client.on('error', (err: Error) => {
    log.error(
      'PG subscriber encountered an error. Attempting to reconnect...',
      err,
    );
    connected = false;
    reconnect(client)
      .then(() => connectListener(client))
      .catch((e) => {
        log.fatal('Failed to reconnect after pg error', e);
        process.exit(1);
      });
  });

  client.on('end', () => {
    connected = false;
  });

  // client will either connect/reconnect or the process will exit
  try {
    if (!connected) {
      await client.connect();
    }
  } catch (err) {
    log.error('Subscriber failed to connect to Postgres', err);
    await reconnect(client);
  }

  connected = true;
  await connectListener(client);

  log.info('Listener ready');
  return client;
}
