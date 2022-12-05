import Sequelize, {} from 'sequelize';
import { AppError } from '../../util/errors';
import { GetThreadsReq, GetThreadsResp } from 'common-common/src/api/extApiTypes';
import { TypedRequestQuery, TypedResponse, success } from '../../types';
import { DB } from '../../models';
import { formatPagination, requiredArgsMessage } from '../../util/queries';

const { Op } = Sequelize;

export const Errors = {
  NoArgs: "Must provide arguments",
  NoCommunityId: "Must provide a Community_id",
  AddressesOrAddressIds: "Cannot provide both addresses and address_ids",
};

const getThreads = async (
  models: DB,
  req: TypedRequestQuery<GetThreadsReq>,
  res: TypedResponse<GetThreadsResp>,
) => {
  if (!req.query) throw new AppError(Errors.NoArgs);

  const { community_id, topic_id, address_ids, no_body, include_comments, addresses, count_only } = req.query;
  if (addresses && address_ids) throw new AppError(Errors.AddressesOrAddressIds);

  const pagination = formatPagination(req.query);

  const where = { chain: community_id };
  if(requiredArgsMessage(where)) throw new AppError(requiredArgsMessage(where));

  const include = [];
  if (addresses) {
    include.push({
      model: models.Address,
      where: { address: { [Op.in]: addresses }},
      as: 'Address'
    });
  }

  let attributes;

  if (no_body) attributes = { exclude: ['body', 'plaintext', 'version_history'] };
  if (topic_id) where['topic_id'] = topic_id;
  if (address_ids) where['address_id'] = { [Op.in]: address_ids, };
  if (include_comments) include.push({ model: models.Comment, required: false, });

  let threads, count;
  if(!count_only) {
    ({ rows: threads, count } = await models.Thread.findAndCountAll({
      logging: console.log,
      where,
      include,
      attributes,
      ...pagination
    }));
  } else {
    count = <any>await models.Thread.count({
      logging: console.log,
      where,
      include,
      attributes,
      ...pagination
    });
  }

  return success(res, { threads: threads, count });
};

export default getThreads;
