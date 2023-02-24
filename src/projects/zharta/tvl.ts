import { SummedBalances } from "../../utils/sumBalances";
import { Pool } from "./types";
import { poolInterface } from "./utils";
import { BigNumber } from "@ethersproject/bignumber";
import { abi, constants } from "@spockanalytics/base";

const WETH_POOL = "0x6474ab1b56b47bc26ba8cb471d566b8cc528f308";

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const calls = [
    new abi.Call<Pool>({ address: WETH_POOL, contractInterface: poolInterface, fragment: "lendingPoolCoreContract" }),
    new abi.Call<Pool>({ address: WETH_POOL, contractInterface: poolInterface, fragment: "erc20TokenContract" }),
  ];

  const result = await abi.Multicall.execute({ chain, calls, blockNumber: block });

  const owner: string = result[0].output;
  const token: string = result[1].output;

  const balance: BigNumber = await new abi.Token(token, chain).balanceOf(owner, block);

  balances[token.toLowerCase()] = balance.toString();

  return balances;
}
