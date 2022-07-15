"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildBank2__factory = void 0;
const ethers_1 = require("ethers");
class GuildBank2__factory extends ethers_1.ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.GuildBank2__factory = GuildBank2__factory;
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "tokenAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        constant: true,
        inputs: [],
        name: "isOwner",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "shares",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "totalShares",
                type: "uint256",
            },
            {
                internalType: "contract IERC20[]",
                name: "_approvedTokens",
                type: "address[]",
            },
        ],
        name: "withdraw",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                internalType: "contract IERC20",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawToken",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x608060405260006100176001600160e01b0361006616565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35061006a565b3390565b6108ae806100796000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806301e3366714610067578063715018a6146100b1578063732c8f57146100bb5780638da5cb5b1461017a5780638f32d59b1461019e578063f2fde38b146101a6575b600080fd5b61009d6004803603606081101561007d57600080fd5b506001600160a01b038135811691602081013590911690604001356101cc565b604080519115158252519081900360200190f35b6100b96102f4565b005b61009d600480360360808110156100d157600080fd5b6001600160a01b03823516916020810135916040820135919081019060808101606082013564010000000081111561010857600080fd5b82018360208201111561011a57600080fd5b8035906020019184602083028401116401000000008311171561013c57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610385945050505050565b6101826105a2565b604080516001600160a01b039092168252519081900360200190f35b61009d6105b1565b6100b9600480360360208110156101bc57600080fd5b50356001600160a01b03166105d5565b60006101d66105b1565b610215576040805162461bcd60e51b8152602060048201819052602482015260008051602061085a833981519152604482015290519081900360640190fd5b836001600160a01b0316836001600160a01b03167f2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398846040518082815260200191505060405180910390a3836001600160a01b031663a9059cbb84846040518363ffffffff1660e01b815260040180836001600160a01b03166001600160a01b0316815260200182815260200192505050602060405180830381600087803b1580156102c057600080fd5b505af11580156102d4573d6000803e3d6000fd5b505050506040513d60208110156102ea57600080fd5b5051949350505050565b6102fc6105b1565b61033b576040805162461bcd60e51b8152602060048201819052602482015260008051602061085a833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b600061038f6105b1565b6103ce576040805162461bcd60e51b8152602060048201819052602482015260008051602061085a833981519152604482015290519081900360640190fd5b81516000901561059857600061048f85610483888786815181106103ee57fe5b60200260200101516001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b03166001600160a01b0316815260200191505060206040518083038186803b15801561044b57600080fd5b505afa15801561045f573d6000803e3d6000fd5b505050506040513d602081101561047557600080fd5b50519063ffffffff61062816565b9063ffffffff61068a16565b905083828151811061049d57fe5b60200260200101516001600160a01b0316876001600160a01b03167f2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398836040518082815260200191505060405180910390a38382815181106104fb57fe5b60200260200101516001600160a01b031663a9059cbb88836040518363ffffffff1660e01b815260040180836001600160a01b03166001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561056257600080fd5b505af1158015610576573d6000803e3d6000fd5b505050506040513d602081101561058c57600080fd5b5051925061059a915050565b505b949350505050565b6000546001600160a01b031690565b600080546001600160a01b03166105c66106cc565b6001600160a01b031614905090565b6105dd6105b1565b61061c576040805162461bcd60e51b8152602060048201819052602482015260008051602061085a833981519152604482015290519081900360640190fd5b610625816106d0565b50565b60008261063757506000610684565b8282028284828161064457fe5b04146106815760405162461bcd60e51b81526004018080602001828103825260218152602001806108396021913960400191505060405180910390fd5b90505b92915050565b600061068183836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610770565b3390565b6001600160a01b0381166107155760405162461bcd60e51b81526004018080602001828103825260268152602001806108136026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b600081836107fc5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156107c15781810151838201526020016107a9565b50505050905090810190601f1680156107ee5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161080857fe5b049594505050505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a265627a7a723158200f13284600f59d49e267071d600bc79ef632f712fa3e225a29f8eabc8629245c64736f6c63430005100032";
//# sourceMappingURL=GuildBank2__factory.js.map