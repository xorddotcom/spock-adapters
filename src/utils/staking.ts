import { abi, constants } from "@spockanalytics/base";

export function stakingTvl(stakingContract: string, token: string) {
  return async (chain: constants.Chain, block: number, timestamp: number) => {
    const balance = await new abi.Token(token, chain).balanceOf(stakingContract, block);
    return { [token.toLowerCase()]: balance.toString() };
  };
}
