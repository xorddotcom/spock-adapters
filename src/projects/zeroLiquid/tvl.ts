import { sumMultipleBalance, SummedBalances } from "../../utils/sumBalances";
import { ZeroLiquid } from "./types";
import { zeroLiquidInterface, PROXY_ZERO_LIQUID } from "./utils";
import { abi, constants } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const yeildTokens: string[] = (
    await abi.Multicall.singleCall<ZeroLiquid>({
      address: PROXY_ZERO_LIQUID,
      chain,
      contractInterface: zeroLiquidInterface,
      fragment: "getSupportedYieldTokens",
    })
  ).output;

  console.log({ yeildTokens });

  const balanceOfInput = yeildTokens.map((token) => ({ token, owner: PROXY_ZERO_LIQUID }));

  const proxyBalances = await abi.erc20MultiBalanceOf(balanceOfInput, chain, block);

  console.log({ proxyBalances });

  sumMultipleBalance(balances, proxyBalances);

  return balances;
}
