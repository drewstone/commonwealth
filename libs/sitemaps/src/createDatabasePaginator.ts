import {
  models,
  ProfileAttributes,
  ThreadInstance,
} from '@hicommonwealth/model';
import { getThreadUrl } from '@hicommonwealth/shared';
import { Op } from 'sequelize';

export interface Link {
  readonly id: number;
  readonly url: string;
  readonly updated_at: string;
}

/**
 * A single page which holds a batch of links that can be converted to a sitemap.
 */
export interface Page {
  readonly links: ReadonlyArray<Link>;
}

/**
 * Interface representing a Paginator.
 *
 * A Paginator is used to navigate through a collection of pages.  This way
 * we can avoid fetching all records into memory.
 */
export interface Paginator {
  readonly hasNext: () => Promise<boolean>;
  readonly next: () => Promise<Page>;
}

interface TableAdapter {
  /**
   * Covert the object to a record or undefined if we can't use it with the sitemaps.
   */
  toRecord: (obj: object) => Link | undefined;
  executeQuery: (ptr: number, limit: number) => Promise<ReadonlyArray<object>>;
}

export function createDatabasePaginatorDefault(limit: number = 50000) {
  const threads = createDatabasePaginatorWithAdapter(
    createThreadsTableAdapter(),
    limit,
  );
  const profiles = createDatabasePaginatorWithAdapter(
    createProfilesTableAdapter(),
    limit,
  );

  return { threads, profiles };
}

function createThreadsTableAdapter(): TableAdapter {
  type ThreadInstancePartial = Pick<
    ThreadInstance,
    'id' | 'updated_at' | 'title' | 'community_id'
  >;

  function toRecord(obj: object): Link | undefined {
    const thread = obj as ThreadInstancePartial;

    if (!thread.updated_at || !thread.id) {
      return undefined;
    }

    const url = getThreadUrl({
      chain: thread.community_id,
      id: thread.id,
      title: thread.title,
    });
    return {
      id: thread.id,
      url,
      updated_at: thread.updated_at.toISOString(),
    };
  }

  async function executeQuery(
    ptr: number,
    limit: number,
  ): Promise<ReadonlyArray<object>> {
    return await models.Thread.findAll({
      attributes: ['id', 'updated_at', 'title', 'community_id'],
      where: {
        id: { [Op.gt]: ptr },
      },
      order: [['id', 'ASC']],
      limit,
    });
  }
  return { toRecord, executeQuery };
}

function createProfilesTableAdapter(): TableAdapter {
  type ProfileInstancePartial = Required<Pick<ProfileAttributes, 'id'>> &
    Pick<ProfileAttributes, 'updated_at'>;

  function toRecord(obj: object) {
    const profile = obj as ProfileInstancePartial;

    if (!profile.updated_at) {
      return undefined;
    }

    const url = `https://commonwealth.im/profile/id/${profile.id}`;
    return {
      id: profile.id,
      url,
      updated_at: profile.updated_at.toISOString(),
    };
  }

  async function executeQuery(
    ptr: number,
    limit: number,
  ): Promise<ReadonlyArray<object>> {
    return await models.Profile.findAll({
      attributes: ['id', 'updated_at'],
      where: {
        id: { [Op.gt]: ptr },
      },
      order: [['id', 'ASC']],
      limit,
    });
  }
  return { toRecord, executeQuery };
}

export function createDatabasePaginatorWithAdapter(
  adapter: TableAdapter,
  limit: number,
): Paginator {
  // the page we're on...
  let idx = 0;

  let ptr = -1;

  let records: ReadonlyArray<Link> = [];

  async function hasNext() {
    return idx === 0 || records.length !== 0;
  }

  async function next(): Promise<Page> {
    ++idx;

    const raw = await adapter.executeQuery(ptr, limit);
    records = raw
      .map(adapter.toRecord)
      .filter((current) => !!current)
      .map((current) => current!);

    if (records.length > 0) {
      ptr = records[records.length - 1].id;
    }

    return {
      links: records,
    };
  }

  return { hasNext, next };
}

export function createDatabasePaginatorMock(
  nrRecords: number,
  pageSize: number,
) {
  const threads = createDatabasePaginatorMockForTable(
    'threads',
    nrRecords,
    pageSize,
  );
  const profiles = createDatabasePaginatorMockForTable(
    'profiles',
    nrRecords,
    pageSize,
  );

  return { threads, profiles };
}

export function createDatabasePaginatorMockForTable(
  table: string,
  nrRecords: number,
  pageSize: number,
): Paginator {
  let pageIdx = 0;
  const maxPages = Math.floor(nrRecords / pageSize);

  let idx = 0;

  async function hasNext() {
    return pageIdx <= maxPages;
  }

  async function next(): Promise<Page> {
    ++pageIdx;
    const links = [
      {
        id: 0,
        url: `http://www.example.com/${table}/` + idx++,
        updated_at: new Date().toISOString(),
      },
    ];

    return { links };
  }

  return { hasNext, next };
}
