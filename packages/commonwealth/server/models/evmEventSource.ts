import Sequelize, { DataTypes } from 'sequelize';
import { ChainNodeAttributes } from './chain_node';
import { ContractAttributes } from './contract';
import { ModelInstance, ModelStatic } from './types';

export type EvmEventSourceAttributes = {
  id: number;
  chain_node_id: number;
  contract_address: string;
  event_signature: string;
  kind: string;

  Contract?: ContractAttributes;
  ChainNode?: ChainNodeAttributes;
};

export type EvmEventSourceInstance = ModelInstance<EvmEventSourceAttributes>;

export type EvmEventSourceModelStatic = ModelStatic<EvmEventSourceInstance>;

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: typeof DataTypes,
): EvmEventSourceModelStatic => {
  const EvmEventSource: EvmEventSourceModelStatic = <EvmEventSourceModelStatic>(
    sequelize.define(
      'EvmEventSource',
      {
        id: {
          type: dataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        chain_node_id: {
          type: dataTypes.INTEGER,
          allowNull: false,
        },
        contract_address: { type: dataTypes.STRING, allowNull: false },
        event_signature: { type: dataTypes.STRING, allowNull: false },
        kind: { type: dataTypes.STRING, allowNull: false },
      },
      {
        tableName: 'EvmEventSources',
        timestamps: false,
        indexes: [
          {
            fields: ['chain_node_id', 'contract_address', 'event_signature'],
            unique: true,
          },
        ],
      },
    )
  );

  EvmEventSource.associate = (models: any) => {
    models.EvmEventSource.belongsTo(models.ChainNode, {
      foreignKey: 'chain_node_id',
      targetKey: 'id',
    });
  };

  return EvmEventSource;
};
