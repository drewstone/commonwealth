import { ThreadSubscription } from '@hicommonwealth/schemas';
import Sequelize from 'sequelize'; // must use "* as" to avoid scope errors
import { z } from 'zod';
import type { ModelInstance, ModelStatic } from './types';

export type ThreadSubscriptionAttributes = z.infer<typeof ThreadSubscription>;

export type ThreadSubscriptionInstance =
  ModelInstance<ThreadSubscriptionAttributes>;

export type ThreadSubscriptionModelStatic =
  ModelStatic<ThreadSubscriptionInstance>;

export default (sequelize: Sequelize.Sequelize) =>
  <ThreadSubscriptionModelStatic>sequelize.define<ThreadSubscriptionInstance>(
    'ThreadSubscriptions',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      thread_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'ThreadSubscriptions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: false,
      indexes: [
        {
          fields: ['user_id', 'thread_id'],
          unique: true,
        },
      ],
    },
  );
