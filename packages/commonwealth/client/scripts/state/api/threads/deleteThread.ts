import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ThreadStage } from 'models/types';
import app from 'state';
import { EXCEPTION_CASE_threadCountersStore } from '../../ui/thread';
import { removeThreadFromAllCaches } from './helpers/cache';

interface DeleteThreadProps {
  chainId: string;
  threadId: number;
  address: string;
}

const deleteThread = async ({
  chainId,
  threadId,
  address,
}: DeleteThreadProps) => {
  const {
    session = null,
    action = null,
    hash = null,
  } = await app.sessions.signDeleteThread(address, {
    thread_id: threadId,
  });

  return await axios.delete(`${app.serverUrl()}/threads/${threadId}`, {
    data: {
      author_chain: chainId,
      chain: chainId,
      address: address,
      jwt: app.user.jwt,
      canvas_action: action,
      canvas_session: session,
      canvas_hash: hash,
    },
  });
};

interface UseDeleteThreadMutationProps {
  chainId: string;
  threadId: number;
  currentStage: ThreadStage;
}

const useDeleteThreadMutation = ({
  chainId,
  threadId,
  currentStage,
}: UseDeleteThreadMutationProps) => {
  return useMutation({
    mutationFn: deleteThread,
    onSuccess: async (response) => {
      // Update community level thread counters variables
      EXCEPTION_CASE_threadCountersStore.setState(
        ({ totalThreadsInCommunity, totalThreadsInCommunityForVoting }) => ({
          totalThreadsInCommunity: totalThreadsInCommunity - 1,
          totalThreadsInCommunityForVoting:
            currentStage === ThreadStage.Voting
              ? totalThreadsInCommunityForVoting - 1
              : totalThreadsInCommunityForVoting,
        })
      );
      removeThreadFromAllCaches(chainId, threadId);
      return response.data;
    },
  });
};

export default useDeleteThreadMutation;
