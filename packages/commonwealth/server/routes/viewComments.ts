import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from 'common-common/src/logging';
import { Action } from 'common-common/src/permissions';
import validateChain from '../util/validateChain';
import { DB } from '../models';
import { getLastEdited } from '../util/getLastEdited';
import { AppError, ServerError } from '../util/errors';
import { checkReadPermitted } from '../util/roles';

const log = factory.getLogger(formatFilename(__filename));

export const Errors = {
  NoRootId: 'Must provide root_id',
};

const viewComments = async (
  models: DB,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [chain, error] = await validateChain(models, req.query);
  if (error) return next(new AppError(error));

  await checkReadPermitted(
    models,
    chain.id,
    Action.VIEW_COMMENTS,
    req.user?.id,
  );

  if (!req.query.root_id) {
    return next(new AppError(Errors.NoRootId));
  }

  const comments = await models.Comment.findAll({
    where: { chain: chain.id, root_id: req.query.root_id },
    include: [
      models.Address,
      models.Attachment,
      {
        model: models.Reaction,
        as: 'reactions',
        include: [
          {
            model: models.Address,
            as: 'Address',
            required: true,
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
    paranoid: false,
  });
  return res.json({
    status: 'Success',
    result: comments.map((c) => {
      const row = c.toJSON();
      const last_edited = getLastEdited(row);
      row['last_edited'] = last_edited;
      return row;
    }),
  });
};

export default viewComments;
