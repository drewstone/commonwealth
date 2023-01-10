import type { GetTokenBalanceReq } from 'common-common/src/api/extApiTypes';
import type { TokenBalanceCache, TokenBalanceResp } from 'token-balance-cache/src';
import type { DB } from 'commonwealth/server/models';
import type {
  TypedRequestQuery,
  TypedResponse} from 'commonwealth/server/types';
import {
  failure,
  success
} from 'commonwealth/server/types';
import { query, validationResult } from 'express-validator';

export const getTokenBalanceValidation = [
  query('chain_node_id').exists().toInt(),
  query('addresses').exists().toArray(),
  query('balance_provider').exists(),
];

export const getTokenBalance = async (
  models: DB,
  tbc: TokenBalanceCache,
  req: TypedRequestQuery<GetTokenBalanceReq>,
  res: TypedResponse<TokenBalanceResp>
) => {
  const errors = validationResult(req).array();
  if (errors.length !== 0) {
    return failure(res.status(400), errors);
  }

  const { chain_node_id, addresses, balance_provider, opts } = req.query;

  const results = await tbc.getBalancesForAddresses(
    chain_node_id,
    addresses,
    balance_provider,
    opts
  );

  return success(res, results);
};
