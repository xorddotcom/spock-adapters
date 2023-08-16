import { sumSingleBalance, SummedBalances } from "../../utils/sumBalances";
import { ElkPair } from "./types";
import { pairAddresses, elkPair } from "./utils";
import { abi, constants, utils } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const pairs = await pairAddresses(chain, block);

  if (pairs) {
    const calls = pairs.flatMap((pair) => [
      new abi.Call<ElkPair>({ address: pair, contractInterface: elkPair, fragment: "token0" }),
      new abi.Call<ElkPair>({ address: pair, contractInterface: elkPair, fragment: "token1" }),
      new abi.Call<ElkPair>({ address: pair, contractInterface: elkPair, fragment: "getReserves" }),
    ]);

    const results = await abi.Multicall.execute({ chain, calls, blockNumber: block });

    utils.chunk(results, 3).forEach((result) => {
      sumSingleBalance(balances, result[0].output, result[2].output[0]);
      sumSingleBalance(balances, result[1].output, result[2].output[1]);
    });
  }

  return balances;
}
