import { AppError } from 'common-common/src/errors';
import type { AbiItem } from 'web3-utils';
import { parseAbiItemsFromABI } from '../../shared/abi_utils';
import { hasher } from 'node-object-hash';

export const Errors = {
  NoContractId: 'Must provide contract id',
  NoAbi: 'Must provide abi',
  ContractAddressExists: 'The address already exists',
  ChainIDExists:
    'The id for this chain already exists, please choose another id',
  ChainNameExists:
    'The name for this chain already exists, please choose another name',
  NotAdmin: 'Must be admin',
  InvalidABI: 'Invalid ABI',
};

/**
 * Parses and validates an ABI string and returns it as an array of Record<string, unknown>
 * and throws an error if it is invalid.
 * @param abiString The ABI string to validate.
 * @throws AppError if the ABI is invalid.
 * @returns Array<Record<string, unknown>>
 */

export default function validateAbi(
  abiString: string
): Array<Record<string, unknown>> {
  // Parse ABI to validate it as a properly formatted ABI
  const abiAsRecord: Array<Record<string, unknown>> = JSON.parse(abiString);
  if (!abiAsRecord) {
    throw new AppError(Errors.InvalidABI);
  }
  const abiItems: AbiItem[] = parseAbiItemsFromABI(abiAsRecord);
  if (!abiItems) {
    throw new AppError(Errors.InvalidABI);
  }
  return abiAsRecord;
}

export function hashAbi(abi: object) {
  const hashInstance = hasher({
    coerce: true,
    sort: true,
    trim: true,
    alg: 'sha256',
    enc: 'hex',
  });
  return hashInstance.hash(abi);
}
