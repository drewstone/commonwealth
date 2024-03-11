import {
  AppError,
  BalanceSourceType,
  commonProtocol,
} from '@hicommonwealth/core';
import {
  CommunityAttributes,
  GroupAttributes,
  UserInstance,
} from '@hicommonwealth/model';
import Web3 from 'web3';
import { getNamespace } from '../../../../../libs/model/src/services/commonProtocol/contractHelpers';
import { ServerGroupsController } from '../server_groups_controller';

const Errors = {
  StakeNotFound: 'Stake not found',
  StakeholderGroup: 'Stakeholder group not found',
  ChainNodeNotFound: 'Chain node not found',
  NamespaceNotFound: 'Namespace not found for this name',
};

export type GenerateStakeholderGroupOptions = {
  user: UserInstance;
  community: CommunityAttributes;
};

export type GenerateStakeholderGroupResult = [
  group: GroupAttributes,
  created: boolean,
];

export async function __generateStakeholderGroup(
  this: ServerGroupsController,
  { user, community }: GenerateStakeholderGroupOptions,
): Promise<GenerateStakeholderGroupResult> {
  // if stakeholder group already exists, skip
  const existingStakeholderGroup = await this.models.Group.findOne({
    where: {
      community_id: community.id,
      is_system_managed: true,
    },
  });
  if (existingStakeholderGroup) {
    return [existingStakeholderGroup, false];
  }

  // get contract address
  const stake = await this.models.CommunityStake.findOne({
    where: { community_id: community.id },
  });
  if (!stake) {
    throw new AppError(Errors.StakeNotFound);
  }
  const node = await this.models.ChainNode.findByPk(community.chain_node_id);
  if (!node) {
    throw new AppError(Errors.ChainNodeNotFound);
  }
  const factoryData = commonProtocol.factoryContracts[node.eth_chain_id];
  const contractAddress = await getNamespace(
    new Web3(node.url),
    community.namespace,
    factoryData.factory,
  );
  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new AppError(Errors.NamespaceNotFound);
  }

  const [group] = await this.createGroup({
    user,
    community,
    metadata: {
      name: `Stakeholder`,
      description:
        'Any member who acquires your community stake is a stakeholder of your community, and therefore a member of this group.',
      required_requirements: 1,
    },
    requirements: [
      {
        rule: 'threshold',
        data: {
          threshold: '0',
          source: {
            source_type: BalanceSourceType.ERC1155,
            evm_chain_id: node.eth_chain_id,
            contract_address: contractAddress,
            token_id: stake.stake_id.toString(),
          },
        },
      },
    ],
    systemManaged: true,
  });

  return [group, true];
}
