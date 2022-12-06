import { depositEvent } from "./projects/unipilot";
import { DepositEventObject } from "./projects/unipilot/types/Vault";
import { BigNumber } from "@ethersproject/bignumber";
import { constants, types } from "@spockanalytics/base";

const ZERO_BN = BigNumber.from(0);

const data: types.Event<DepositEventObject> = {
  signature: "",
  block: {
    number: 16075148,
    hash: "",
    difficulty: 0,
    miner: "",
    parentHash: "",
    gasLimit: ZERO_BN,
    gasUsed: ZERO_BN,
    baseFeePerGas: ZERO_BN,
    timestamp: 1669718867,
  },
  transactionLogIndex: 143,
  logIndex: 10,
  chain: constants.Chain.ETHEREUM,
  transaction: {
    hash: "0x384a0a4f3718ba92ffa9d93f6659f50a0f10f7877e964b41465231466fbd396c",
    from: "0x8edd5f3cad0c1b6b2a5a36f8893c83d3df352692",
    to: "0xab170c6bda86b521c16f83e836f6b4fecb867508",
    value: "0",
    gasPrice: ZERO_BN,
    maxFeePerGas: ZERO_BN,
    maxPriorityFeePerGas: ZERO_BN,
  },
  params: {
    depositor: "0x8EdD5F3cAD0c1B6B2a5a36f8893C83D3dF352692",
    recipient: "0x8EdD5F3cAD0c1B6B2a5a36f8893C83D3dF352692",
    amount0: BigNumber.from("120000000000000000000"),
    amount1: BigNumber.from("557048039757459558"),
    lpShares: BigNumber.from("471056676463346675855"),
  },
};

const main = async () => {
  const res = await depositEvent(data);
  console.log({ res });
};

/* eslint-disable-next-line */
main();
