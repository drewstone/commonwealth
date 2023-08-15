import React from 'react';
import 'modals/archive_thread_modal.scss';
import type Thread from '../../models/Thread';
import app from 'state';
import { CWButton } from '../components/component_kit/cw_button';
import { CWText } from '../components/component_kit/cw_text';
import {
  useToggleThreadArchiveMutation,
} from 'state/api/threads';

import {
  notifyError,
  notifySuccess,
} from '../../controllers/app/notifications';

type ArchiveThreadModalProps = {
  onModalClose: () => void;
  thread: Thread;
};

export const ArchiveThreadModal = ({
  onModalClose,
  thread,
}: ArchiveThreadModalProps) => {
  const { mutateAsync: toggleArchive } = useToggleThreadArchiveMutation({
    chainId: app.activeChainId(),
    threadId: thread.id,
  });

  const handleArchiveThread = async () => {
    toggleArchive({
      threadId: thread.id,
      chainId: app.activeChainId(),
      isArchived: !!thread.archivedAt,
    })
    .then(() => {
      notifySuccess(`Thread has been ${thread?.archivedAt ? 'unarchived' : 'archived'}!`);
      onModalClose();
    })
    .catch(() => {
      notifyError(`Could not ${thread?.archivedAt ? 'unarchive' : 'archive'} thread.`);
    });
  };

  return (
    <div className="ArchiveThreadModal">
      <div className="title">
        <CWText type="h4" fontWeight="semiBold">
          Confirm archive
        </CWText>
      </div>
      <div className="body">
        <div className="warning-text">
          <CWText className='top'>
            Are you sure you want to archive this thread post?
          </CWText>

          <CWText className='middle'>
            Archived posts are hidden from the main feed and can no longer be interacted with. Archiving will move the post to a new topic section titled "Archived," which is still viewable by all community members.
          </CWText>

          <CWText>
            Note that you can always unarchive a post.
          </CWText>
        </div>

        <div className="actions">
          <CWButton
            label="Cancel"
            buttonType="secondary-black"
            onClick={onModalClose}
          />
          <CWButton
            label="Confirm"
            buttonType="primary-black"
            onClick={handleArchiveThread}
          />
        </div>
      </div>
    </div>
  );
};
