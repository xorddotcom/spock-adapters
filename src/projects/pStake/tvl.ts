import { sumSingleBalance, SummedBalances } from "../../utils/sumBalances";
import { StakePool } from "./types";
import { STAKE_POOL, UNDERLYING_ASSET, stakePoolInterface } from "./utils";
import { abi, constants } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const stakedBalance = await abi.Multicall.singleCall<StakePool>({
    address: STAKE_POOL[chain] ?? "",
    blockNumber: block,
    chain,
    contractInterface: stakePoolInterface,
    fragment: "exchangeRate",
  });

  sumSingleBalance(balances, UNDERLYING_ASSET[chain]?.address ?? "", stakedBalance.output.totalWei);

  return balances;
}
