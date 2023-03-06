import type { GetProfilesReq, GetProfilesResp, } from 'common-common/src/api/extApiTypes';
import { needParamErrMsg } from 'common-common/src/api/extApiTypes';
import { oneOf, query, validationResult } from 'express-validator';
import Sequelize from 'sequelize';
import type { DB } from '../../models';
import type { TypedRequestQuery, TypedResponse } from '../../types';
import { failure, success } from '../../types';
import { paginationValidation } from '../../util/helperValidations';
import { formatPagination } from '../../util/queries';

const { Op } = Sequelize;

export const getProfilesValidation = [
  oneOf(
    [
      query('addresses').exists().toArray(),
      query('profile_ids').exists().toArray(),
    ],
    `${needParamErrMsg} (addresses, profile_ids)`
  ),
  query('include_addresses').optional().isBoolean().toBoolean(),
  query('count_only').optional().isBoolean().toBoolean(),
  ...paginationValidation,
];

const getProfiles = async (
  models: DB,
  req: TypedRequestQuery<GetProfilesReq>,
  res: TypedResponse<GetProfilesResp>
) => {
  const errors = validationResult(req).array();
  if (errors.length !== 0) {
    return failure(res.status(400), errors);
  }
  // This route is for fetching all profiles + addresses by community
  const { addresses, include_addresses, profile_ids, count_only } = req.query;

  const pagination = formatPagination(req.query);

  const where = {};
  if (profile_ids) where['id'] = { [Op.in]: profile_ids };
  const include = [];
  if (addresses && !include_addresses) {
    include.push({
      model: models.Address,
      where: { address: { [Op.in]: addresses } },
      required: true,
    });
  } else if(include_addresses) {
    include.push({
      model: models.Address,
      required: true,
    });
  }

  let profiles, count;
  if (!count_only) {
    ({ rows: profiles, count } = await models.Profile.findAndCountAll({
      where,
      include,
      attributes: { exclude: ['user_id'] },
      ...pagination,
    }));
  } else {
    count = await models.Profile.count({
      where,
      attributes: { exclude: ['user_id'] },
      include,
      ...pagination,
    });
  }

  return success(res, { profiles, count });
};

export default getProfiles;
