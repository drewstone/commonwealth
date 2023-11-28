import { AddressAttributes } from 'server/models/address';
import { GroupAttributes } from 'server/models/group';
import {
  GetBalancesOptions,
  GetCosmosBalancesOptions,
  GetErcBalanceOptions,
  GetEthNativeBalanceOptions,
} from '../tokenBalanceCache/types';
import {
  BalanceSourceType,
  ContractSource,
  CosmosSource,
  NativeSource,
} from './requirementsTypes';

export function makeGetBalancesOptions(
  groups: GroupAttributes[],
  addresses: AddressAttributes[],
): GetBalancesOptions[] {
  const allOptions: GetBalancesOptions[] = [];

  for (const address of addresses) {
    for (const group of groups) {
      for (const requirement of group.requirements) {
        if (requirement.rule === 'threshold') {
          // for each requirement, upsert the appropriate option
          switch (requirement.data.source.source_type) {
            // ContractSource
            case BalanceSourceType.ERC20:
            case BalanceSourceType.ERC721: {
              const castedSource = requirement.data.source as ContractSource;
              const existingOptions = allOptions.find((opt) => {
                const castedOpt = opt as GetErcBalanceOptions;
                return (
                  castedOpt.balanceSourceType === castedSource.source_type &&
                  castedOpt.sourceOptions.evmChainId ===
                    castedSource.evm_chain_id &&
                  castedOpt.sourceOptions.contractAddress ===
                    castedSource.contract_address
                );
              });
              if (existingOptions) {
                if (!existingOptions.addresses.includes(address.address)) {
                  existingOptions.addresses.push(address.address);
                }
              } else {
                allOptions.push({
                  balanceSourceType: castedSource.source_type,
                  sourceOptions: {
                    contractAddress: castedSource.contract_address,
                    evmChainId: castedSource.evm_chain_id,
                  },
                  addresses: [address.address],
                });
              }
              break;
            }
            // NativeSource
            case BalanceSourceType.ETHNative: {
              const castedSource = requirement.data.source as NativeSource;
              const existingOptions = allOptions.find((opt) => {
                const castedOpt = opt as GetEthNativeBalanceOptions;
                return (
                  castedOpt.balanceSourceType === BalanceSourceType.ETHNative &&
                  castedOpt.sourceOptions.evmChainId ===
                    castedSource.evm_chain_id
                );
              });
              if (existingOptions) {
                if (!existingOptions.addresses.includes(address.address)) {
                  existingOptions.addresses.push(address.address);
                }
              } else {
                allOptions.push({
                  balanceSourceType: BalanceSourceType.ETHNative,
                  sourceOptions: {
                    evmChainId: castedSource.evm_chain_id,
                  },
                  addresses: [address.address],
                });
              }
              break;
            }
            // CosmosSource
            case BalanceSourceType.CosmosNative: {
              const castedSource = requirement.data.source as CosmosSource;
              const existingOptions = allOptions.find((opt) => {
                const castedOpt = opt as GetCosmosBalancesOptions;
                return (
                  castedOpt.balanceSourceType ===
                    BalanceSourceType.CosmosNative &&
                  castedOpt.sourceOptions.cosmosChainId ===
                    castedSource.cosmos_chain_id
                );
              });
              if (existingOptions) {
                if (!existingOptions.addresses.includes(address.address)) {
                  existingOptions.addresses.push(address.address);
                }
              } else {
                allOptions.push({
                  balanceSourceType: BalanceSourceType.CosmosNative,
                  sourceOptions: {
                    cosmosChainId: castedSource.cosmos_chain_id,
                  },
                  addresses: [address.address],
                });
              }
              break;
            }
          }
        }
      }
    }
  }

  return allOptions;
}
