import { AppError } from 'common-common/src/errors';
import { BalanceType } from 'common-common/src/types';
import { UserInstance } from 'server/models/user';
import { ServerCommunitiesController } from '../server_communities_controller';

export const Errors = {
  ChainNodeExists: 'Chain Node already exists',
  NotAdmin: 'Not an admin',
  ChainIdNaN: 'eth_chain_id is required on ethereum Chain Nodes',
};

export type CreateChainNodeOptions = {
  user: UserInstance;
  url: string;
  name?: string;
  bech32?: string;
  balanceType?: string;
  eth_chain_id?: number;
};
export type CreateChainNodeResult = { node_id: number };

export async function __createChainNode(
  this: ServerCommunitiesController,
  {
    user,
    url,
    name,
    bech32,
    balanceType,
    eth_chain_id,
  }: CreateChainNodeOptions,
): Promise<CreateChainNodeResult> {
  if (!user.isAdmin) {
    throw new AppError(Errors.NotAdmin);
  }

  if (balanceType === 'ethereum' && typeof eth_chain_id !== 'number') {
    throw new AppError(Errors.ChainIdNaN);
  }

  const chainNode = await this.models.ChainNode.findOne({
    where: { url },
  });

  if (chainNode) {
    throw new AppError(Errors.ChainNodeExists);
  }

  const newChainNode = await this.models.ChainNode.create({
    url,
    name,
    balance_type: balanceType as BalanceType,
    bech32,
    eth_chain_id,
  });

  return { node_id: newChainNode.id };
}
