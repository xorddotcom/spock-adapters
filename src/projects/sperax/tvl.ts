import { SummedBalances, sumSingleBalance } from "../../utils/sumBalances";
import { SPAAddress, USDsAddress, USDsInterface, VeSPAAddress, VeSPAInterface } from "./utils";
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

export async function computeStakingTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const supply = (
    await abi.Multicall.singleCall({
      address: VeSPAAddress,
      chain,
      contractInterface: VeSPAInterface,
      fragment: "totalSPALocked",
      blockNumber: block,
    })
  )?.output;

  sumSingleBalance(balances, SPAAddress, supply);

  return balances;
}
