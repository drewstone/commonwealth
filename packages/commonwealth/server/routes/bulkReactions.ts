import { Request, Response, NextFunction } from 'express';
import { uniqBy } from 'lodash';
import { ServerError } from 'common-common/src/errors';
import { Action } from 'common-common/src/permissions';
import { checkReadPermitted } from '../util/roles';
import { DB } from '../models';

const bulkReactions = async (models: DB, req: Request, res: Response, next: NextFunction) => {
  const { thread_id, proposal_id, comment_id, chain_id } = req.query;

  try {
    await checkReadPermitted(
      models,
      chain_id,
      Action.VIEW_REACTIONS,
      req.user?.id,
    );
  } catch(err) {
    return next(new ServerError(err));
  }

  let reactions = [];
  try {
    if (thread_id || proposal_id || comment_id) {
      reactions = await models.Reaction.findAll({
        where: {
          thread_id: thread_id || null,
          proposal_id: proposal_id || null,
          comment_id: comment_id || null
        },
        include: [ models.Address ],
        order: [['created_at', 'DESC']],
      });
    }
  } catch (err) {
    return next(new ServerError(err));
  }

  return res.json({ status: 'Success', result: uniqBy(reactions.map((c) => c.toJSON()), 'id') });
};

export default bulkReactions;


