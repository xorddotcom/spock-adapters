import { SummedBalances } from "../../utils/sumBalances";
import { constants, types } from "@spockanalytics/base";
import axios from "axios";

export function computeTVL(category: types.TVL_Category) {
  return async (chain: constants.Chain, block: number, timestamp: number) => {
    const balances: SummedBalances = {};

    const { data } = await axios<Record<string, Record<string, number>>>("https://api.beefy.finance/tvl");

    const valueUSD = Object.entries(data[chain]).reduce((accum, [vault, value]) => {
      if (!vault.includes("bifi") && category === types.TVL_Category.TVL) {
        accum += value;
      } else if (vault.includes("bifi") && category === types.TVL_Category.STAKING) {
        accum += value;
      }
      return accum;
    }, 0);

    balances["usd"] = valueUSD.toString();

    return balances;
  };
}
