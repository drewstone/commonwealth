import { BigNumber } from "ethers";
import * as _ from "lodash";

export enum SolidityType {
  address = "address",
  uint256 = "uint256",
  uint8 = "uint8",
  uint = "uint",
  bytes32 = "bytes32",
  boolean = "bool",
  string = "string",
}

export type Address = string;
export type UInt = BigNumber;
export type Bytes32 = string;
export type TxHash = string;

export class AbiFunctionInput {
  public readonly internalType: SolidityType;
  public readonly name: string;
  public readonly type: string;
  constructor(internalType: SolidityType, name: string, type: string) {
      this.name = name;
      this.type = type;
      this.internalType = internalType;
  }
  static fromJSON(json) {
      return new AbiFunctionInput(json.internalType, json.name, json.type);
  }
}

export class AbiFunctionOutput {
    public readonly internalType: SolidityType;
    public readonly name: string;
    public readonly type: string;
    constructor(internalType: SolidityType, name: string, type: string) {
        this.name = name;
        this.type = type;
        this.internalType = internalType;
    }
    static fromJSON(json) {
        return new AbiFunctionOutput(json.internalType, json.name, json.type);
    }
}

export class AbiFunction {
    public readonly inputs: AbiFunctionInput[];
    public readonly name: string;
    public readonly outputs: AbiFunctionOutput[];
    public readonly stateMutability: string;
    public readonly type: string;
    constructor(inputs: AbiFunctionInput[], name: string, outputs: AbiFunctionOutput[],
      stateMutability: string, type: string) {
        this.name = name;
        this.type = type;
        this.inputs = inputs;
        this.outputs = outputs;
        this.stateMutability = stateMutability;
    }
    static fromJSON(json) {
        return new AbiFunction(json.name, json.type, json.inputs, json.outputs,
          json.stateMutability);
    }
}

export class AbiEventInput {
  public readonly indexed: boolean;
  public readonly internalType: SolidityType;
  public readonly name: string;
  public readonly type: string;
  constructor(indexed: boolean, internalType: SolidityType, name: string, type: string) {
      this.indexed = indexed;
      this.name = name;
      this.type = type;
      this.internalType = internalType;
  }
  static fromJSON(json) {
      return new AbiFunctionInput(json.internalType, json.name, json.type);
  }
}

export class AbiEvent {
  public anonymous: boolean;
  public inputs: AbiEventInput[];
  public name: string;
  public type: string;
  public constructor(anonymous: boolean, inputs: AbiEventInput[], name: string, type: string) {
    this.anonymous = anonymous;
    this.inputs = inputs;
    this.name = name;
    this.type = type;
  }
}

export enum Network {
    Mainnet = "Mainnet",
    Rinkeby = "Rinkeby",
    Ropsten = "Ropsten",
    Kovan = "Kovan",
    Goerli = "Goerli",
  }

export const networkIdToName = {
    1: Network.Mainnet,
    3: Network.Ropsten,
    4: Network.Rinkeby,
    5: Network.Goerli,
    42: Network.Kovan,
};

export const networkNameToId = {
    [Network.Mainnet]: 1,
    [Network.Ropsten]: 3,
    [Network.Rinkeby]: 4,
    [Network.Goerli]: 5,
    [Network.Kovan]: 42,
};


export interface TxData {
    from?: string;
    gas?: BigNumber;
    gasPrice?: BigNumber;
    nonce?: BigNumber;
}

export interface TxDataPayable extends TxData {
    value?: BigNumber;
}

export interface ReceiptLog {
    name: string;
    events: any[];
    address: string;
}

export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: string[];
}

export declare type TransactionReceiptStatus = null | string | 0 | 1;

export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: TransactionReceiptStatus;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: LogEntry[];
}

export interface Log {
  event: string;
  address: Address;
  args: any;
}