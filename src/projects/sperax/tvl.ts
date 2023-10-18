import { SummedBalances, sumSingleBalance } from "../../utils/sumBalances";
import { USDsAddress, USDsInterface } from "./utils";
import { constants, abi } from "@spockanalytics/base";

export async function computeCollateralTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const supply = (
    await abi.Multicall.singleCall({
      address: USDsAddress,
      chain,
      contractInterface: USDsInterface,
      fragment: "totalSupply",
      blockNumber: block,
    })
  )?.output;

  sumSingleBalance(balances, USDsAddress, supply);

  return balances;
}
