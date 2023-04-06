import type { SnapshotSpace } from 'helpers/snapshot_utils';
import { createProposal, getSpaceBlockNumber } from 'helpers/snapshot_utils';
import type { Account } from 'models';
import app from 'state';
import type { ThreadForm } from './types';
import { NewThreadErrors } from './types';
import { getTextFromDelta } from '../../components/react_quill_editor';

export const createNewProposal = async (
  form: ThreadForm,
  content: string,
  author: Account,
  space: SnapshotSpace
) => {
  if (!form.name) {
    throw new Error(NewThreadErrors.NoTitle);
  }

  if (!form.start) {
    throw new Error(NewThreadErrors.NoStartDate);
  }

  if (!form.end) {
    throw new Error(NewThreadErrors.NoEndDate);
  }

  if (!form.choices[0] || !form.choices[1]) {
    throw new Error(NewThreadErrors.NoChoices);
  }

  const bodyText = getTextFromDelta(JSON.parse(content));
  if (bodyText.length === 0) {
    throw new Error(NewThreadErrors.NoBody);
  }

  form.body = content; // use content, which is richtext
  form.snapshot = await getSpaceBlockNumber(space.network);
  form.metadata.network = space.network;
  form.metadata.strategies = space.strategies;

  // Format form for proper validation
  form.start = Math.floor(form.start / 1000);
  form.end = Math.floor(form.end / 1000);

  const proposalPayload = {
    space: space.id,
    type: 'single-choice',
    title: form.name,
    body: form.body,
    choices: form.choices,
    start: form.start,
    end: form.end,
    snapshot: form.snapshot,
    network: '1', // TODO: unclear if this is always 1
    timestamp: Math.floor(Date.now() / 1e3),
    strategies: JSON.stringify({}),
    plugins: JSON.stringify({}),
    metadata: JSON.stringify({}),
  };

  await createProposal(author.address, proposalPayload);
  await app.user.notifications.refresh();
  await app.snapshot.refreshProposals();
};
