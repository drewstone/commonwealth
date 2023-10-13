import BN from 'bn.js';

import clsx from 'clsx';

import 'components/Comments/CreateComment.scss';
import { notifyError } from 'controllers/app/notifications';
import { SessionKeyError } from 'controllers/server/sessions';
import { getDecimals, weiToTokens } from 'helpers';
import { getTokenBalance } from 'helpers/token_balance_helper';
import { useDraft } from 'hooks/useDraft';
import type { DeltaStatic } from 'quill';
import React, { useEffect, useMemo, useState } from 'react';
import app from 'state';
import { useCreateCommentMutation } from 'state/api/comments';
import { ContentType } from 'types';
import { User } from 'views/components/user/user';
import { useSessionRevalidationModal } from 'views/modals/SessionRevalidationModal';
import { updateActiveAddresses } from '../../../controllers/app/login';
import { selectChain } from '../../../helpers/chain';
import Thread from '../../../models/Thread';
import Permissions from '../../../utils/Permissions';
import { jumpHighlightComment } from '../../pages/discussions/CommentTree/helpers';
import { CWText } from '../component_kit/cw_text';
import { CWValidationText } from '../component_kit/cw_validation_text';
import { CWButton } from '../component_kit/new_designs/cw_button';
import {
  createDeltaFromText,
  getTextFromDelta,
  ReactQuillEditor,
} from '../react_quill_editor';
import { serializeDelta } from '../react_quill_editor/utils';

type CreateCommentProps = {
  handleIsReplying?: (isReplying: boolean, id?: number) => void;
  parentCommentId?: number;
  rootThread: Thread;
  canComment: boolean;
  shouldFocusEditor?: boolean;
  chainId?: string;
};

export const CreateComment = ({
  handleIsReplying,
  parentCommentId,
  rootThread,
  canComment,
  shouldFocusEditor = false,
  chainId,
}: CreateCommentProps) => {
  const { saveDraft, restoreDraft, clearDraft } = useDraft<DeltaStatic>(
    !parentCommentId
      ? `new-thread-comment-${rootThread.id}`
      : `new-comment-reply-${parentCommentId}`
  );

  // get restored draft on init
  const restoredDraft = useMemo(() => {
    return restoreDraft() || createDeltaFromText('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [contentDelta, setContentDelta] = useState<DeltaStatic>(restoredDraft);

  const [sendingComment, setSendingComment] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tokenPostingThreshold, setTokenPostingThreshold] = useState(
    new BN('0')
  );
  const [userBalance, setUserBalance] = useState(new BN('0'));
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [chain, setChain] = useState(app.chain);
  const editorValue = getTextFromDelta(contentDelta);

  const author = app.user.activeAccount;

  const parentType = parentCommentId ? ContentType.Comment : ContentType.Thread;
  const activeTopic = rootThread instanceof Thread ? rootThread?.topic : null;

  // on content updated, save draft
  useEffect(() => {
    saveDraft(contentDelta);
  }, [handleIsReplying, saveDraft, contentDelta]);

  useEffect(() => {
    let activeAddress = app.user.activeAccount?.address;

    if (!activeAddress) {
      selectChain(app.config.chains.getById(chainId)).then(() => {
        updateActiveAddresses({ chainId, shouldRedraw: false }).then(() => {
          setChain(app.chain);
        });
      });
    }
  });

  useEffect(() => {
    chain &&
      activeTopic?.id &&
      setTokenPostingThreshold(app.chain.getTopicThreshold(activeTopic?.id));
  }, [activeTopic, chain]);

  useEffect(() => {
    if (!tokenPostingThreshold.isZero() && !balanceLoading) {
      setBalanceLoading(true);
      if (!app.user.activeAccount?.tokenBalance) {
        getTokenBalance().then(() => {
          setUserBalance(app.user.activeAccount?.tokenBalance);
        });
      } else {
        setUserBalance(app.user.activeAccount?.tokenBalance);
      }
    }
  }, [tokenPostingThreshold]);

  const {
    mutateAsync: createComment,
    error: createCommentError,
    reset: resetCreateCommentMutation,
  } = useCreateCommentMutation({
    threadId: rootThread.id,
    chainId: app.activeChainId(),
    existingNumberOfComments: rootThread.numberOfComments || 0,
  });

  const { RevalidationModal } = useSessionRevalidationModal({
    handleClose: resetCreateCommentMutation,
    error: createCommentError,
  });

  if (chainId && !chain) {
    return <></>; // we need to init chain, so just wait
  }

  const handleSubmitComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setErrorMsg(null);
    setSendingComment(true);

    const chainId = app.activeChainId();

    try {
      const newComment: any = await createComment({
        threadId: rootThread.id,
        chainId: chainId,
        address: app.user.activeAccount.address,
        parentCommentId: parentCommentId,
        unescapedText: serializeDelta(contentDelta),
        existingNumberOfComments: rootThread.numberOfComments || 0,
      });

      setErrorMsg(null);
      setContentDelta(createDeltaFromText(''));
      clearDraft();

      setTimeout(() => {
        // Wait for dom to be updated before scrolling to comment
        jumpHighlightComment(newComment.id);
      }, 100);

      // TODO: Instead of completely refreshing notifications, just add the comment to subscriptions
      // once we are receiving notifications from the websocket
      await app.user.notifications.refresh();
    } catch (err) {
      if (err instanceof SessionKeyError) {
        return;
      }
      const errMsg = err?.responseJSON?.error || err?.message;
      console.error(errMsg);

      notifyError('Failed to create comment');
      setErrorMsg(errMsg);
    } finally {
      setSendingComment(false);

      if (handleIsReplying) {
        handleIsReplying(false);
      }
    }
  };

  const userFailsThreshold = app.chain.isGatedTopic(activeTopic?.id);
  const isAdmin = Permissions.isCommunityAdmin();
  const disabled =
    editorValue.length === 0 ||
    sendingComment ||
    userFailsThreshold ||
    !canComment;

  const decimals = getDecimals(app.chain);

  const cancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setContentDelta(createDeltaFromText(''));
    if (handleIsReplying) {
      handleIsReplying(false);
    }
    clearDraft();
  };

  return (
    <>
      <div
        className="CreateComment"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="attribution-row">
          <div className="attribution-left-content">
            <CWText type="caption">
              {parentType === ContentType.Comment ? 'Reply as' : 'Comment as'}
            </CWText>
            <CWText
              type="caption"
              fontWeight="medium"
              className={clsx('user-link-text', { disabled: !canComment })}
            >
              <User
                userAddress={author?.address}
                userChainId={author?.chain.id}
                shouldHideAvatar
                shouldLinkProfile
              />
            </CWText>
          </div>
          {errorMsg && <CWValidationText message={errorMsg} status="failure" />}
        </div>
        <div>
          <ReactQuillEditor
            className="editor"
            contentDelta={contentDelta}
            setContentDelta={setContentDelta}
            isDisabled={!canComment}
            tooltipLabel="Join community to comment"
            shouldFocus={shouldFocusEditor}
          />
        </div>
        {tokenPostingThreshold && tokenPostingThreshold.gt(new BN(0)) && (
          <CWText className="token-req-text">
            Commenting in {activeTopic?.name} requires{' '}
            {weiToTokens(tokenPostingThreshold.toString(), decimals)}{' '}
            {app.chain.meta.default_symbol}.{' '}
            {userBalance && (
              <>
                You have {weiToTokens(userBalance.toString(), decimals)}{' '}
                {app.chain.meta.default_symbol}.
              </>
            )}
          </CWText>
        )}
        <div className="form-bottom">
          <div className="form-buttons">
            {editorValue.length > 0 && (
              <CWButton buttonType="tertiary" onClick={cancel} label="Cancel" />
            )}
            <CWButton
              buttonWidth="wide"
              disabled={disabled && !isAdmin}
              onClick={handleSubmitComment}
              label="Submit"
            />
          </div>
        </div>
      </div>
      {RevalidationModal}
    </>
  );
};
