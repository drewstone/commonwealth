import {
  GetRelatedCommunitiesOptions,
  GetRelatedCommunitiesResult
} from '../../controllers/server_chains_methods/get_related_communities';
import { ServerControllers } from '../../routing/router';
import { success, TypedRequestQuery, TypedResponse } from '../../types';

type GetRelatedCommunitiesParams = GetRelatedCommunitiesOptions;
type GetRelatedCommunitiesResponse = GetRelatedCommunitiesResult;

export const getRelatedCommunitiesHandler = async (
  controllers: ServerControllers,
  req: TypedRequestQuery<GetRelatedCommunitiesParams>,
  res: TypedResponse<GetRelatedCommunitiesResponse>
) => {
  const { base, searchName } = req.query;
  const results = await controllers.chains.getRelatedCommunities({ base, searchName });
  return success(res, results);
};