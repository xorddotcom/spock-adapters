import { Erc20, Erc20__factory } from "../contracts/types";
import { BigNumber } from "@ethersproject/bignumber";
import { abi, constants } from "@spockanalytics/base";

export async function tokenDecimals(address: string, chain: constants.Chain): Promise<number> {
  return (
    await abi.Multicall.singleCall<Erc20>({
      address,
      chain,
      contractInterface: Erc20__factory.createInterface(),
      fragment: "decimals",
    })
  ).output;
}

export async function tokenTotalSupply(address: string, chain: constants.Chain): Promise<BigNumber> {
  return (
    await abi.Multicall.singleCall<Erc20>({
      address,
      chain,
      contractInterface: Erc20__factory.createInterface(),
      fragment: "totalSupply",
    })
  ).output;
}
