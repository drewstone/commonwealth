'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        'Subscriptions',
        'chain_event_type_id',
        {
          transaction: t,
        }
      );
      await queryInterface.removeColumn('Subscriptions', 'chain_entity_id', {
        transaction: t,
      });
      await queryInterface.dropTable('ChainEventTypes', { transaction: t });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'ChainEventTypes',
        {
          id: { type: Sequelize.STRING, primaryKey: true },
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'Subscriptions',
        'chain_event_type_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
          references: { model: 'ChainEventTypes', key: 'id' },
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        'Subscriptions',
        'chain_entity_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'ChainEntityMeta', key: 'id' },
        },
        { transaction: t }
      );
    });
  },
};
