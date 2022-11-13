import { BigNumber } from "@ethersproject/bignumber";

import { Chain } from "../constant/chains";

interface Block {
  number: number;
  hash: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
}

export interface Event {
  signature: string;
  block: Block;
  transaction: Transaction;
  transactionLogIndex: number;
  logIndex: number;
  chain: Chain;
}
