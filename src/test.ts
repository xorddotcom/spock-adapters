import { depositEvent } from "./projects/unipilot";
import { DepositEventObject } from "./projects/unipilot/types/Vault";
import { mintEvent } from "./projects/uniswap";
import { MintEventObject } from "./projects/uniswap/types/Pool";
import { BigNumber } from "@ethersproject/bignumber";
import { constants, types } from "@spockanalytics/base";

const ZERO_BN = BigNumber.from(0);

const data: types.Event<DepositEventObject> = {
  address: "0xab170c6bda86b521c16f83e836f6b4fecb867508",
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
    receipt: {
      type: 2,
      status: 1,
      gasUsed: ZERO_BN,
    },
  },
  params: {
    depositor: "0x8EdD5F3cAD0c1B6B2a5a36f8893C83D3dF352692",
    recipient: "0x8EdD5F3cAD0c1B6B2a5a36f8893C83D3dF352692",
    amount0: BigNumber.from("120000000000000000000"),
    amount1: BigNumber.from("557048039757459558"),
    lpShares: BigNumber.from("471056676463346675855"),
  },
};

const data1: types.Event<MintEventObject> = {
  address: "0x6c6bc977e13df9b0de53b251522280bb72383700",
  signature: "",
  block: {
    number: 16138427,
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
    hash: "0x9691ba60996b221725b52dd5b858d55673595f78c8fdc49d3af2c0fb4bb36f51",
    from: "0x3cbd83d4a4ee504bf8b78d9c2927a9f22f27cce5",
    to: "0x3caca7b48d0573d793d3b0279b5f0029180e83b6",
    value: "0",
    gasPrice: ZERO_BN,
    maxFeePerGas: ZERO_BN,
    maxPriorityFeePerGas: ZERO_BN,
    receipt: {
      type: 2,
      status: 1,
      gasUsed: ZERO_BN,
    },
  },
  params: {
    sender: "0xAbDDAfB225e10B90D798bB8A886238Fb835e2053",
    owner: "0xAbDDAfB225e10B90D798bB8A886238Fb835e2053",
    tickLower: -276330,
    tickUpper: -276310,
    amount: BigNumber.from("241259598003960901087128"),
    amount0: BigNumber.from("178568825748262973121468278"),
    amount1: BigNumber.from("62609007780269"),
  },
};

const data2: types.Event<DepositEventObject> = {
  address: "0x1c42bcbc0345ef8d7e9c2fc709f60bba3794d5e3",
  signature: "",
  block: {
    number: 36587313,
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
  chain: constants.Chain.POLYGON,
  transaction: {
    hash: "0xc1cd7a08188da623886c584182f9139aae5153611841fc8c57f749f5c35a6955",
    from: "0x612ae819d1e53f3199f06d77b1254a395bfad80d",
    to: "0x1c42bcbc0345ef8d7e9c2fc709f60bba3794d5e3",
    value: "0",
    gasPrice: ZERO_BN,
    maxFeePerGas: ZERO_BN,
    maxPriorityFeePerGas: ZERO_BN,
    receipt: {
      type: 2,
      status: 1,
      gasUsed: ZERO_BN,
    },
  },
  params: {
    depositor: "0x612ae819d1e53f3199f06d77b1254a395bfad80d",
    recipient: "0x612ae819d1e53f3199f06d77b1254a395bfad80d",
    amount0: BigNumber.from("18737776"),
    amount1: BigNumber.from("11697639483696890"),
    lpShares: BigNumber.from("11350556935643570"),
  },
};

const main = async () => {
  // const res = await depositEvent(data);
  // console.log({ res });

  const res = await depositEvent(data);
  console.log({ res });
};

/* eslint-disable-next-line */
main();
