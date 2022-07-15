"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IERC777Recipient__factory = void 0;
const ethers_1 = require("ethers");
class IERC777Recipient__factory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.IERC777Recipient__factory = IERC777Recipient__factory;
const _abi = [
    {
        constant: false,
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "userData",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "operatorData",
                type: "bytes",
            },
        ],
        name: "tokensReceived",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
];
//# sourceMappingURL=IERC777Recipient__factory.js.map