import { SummedBalances, sumSingleBalance } from "../../utils/sumBalances";
import { getHypervisorsInfo, getHypervisors, getHypervisorsAmounts, HYPE_REGISTRY_INFO, Dex } from "./utils";
import { constants } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const hypervisors: string[] = (
    await Promise.all(Object.keys(HYPE_REGISTRY_INFO[chain] as object).map((dex) => getHypervisors(chain, dex as Dex)))
  ).flat();

  let hypervisorsInfo = await getHypervisorsInfo(hypervisors, chain);

  hypervisorsInfo = await getHypervisorsAmounts(hypervisorsInfo, chain, block);

  hypervisors.forEach((address) => {
    if (hypervisorsInfo[address]) {
      sumSingleBalance(balances, hypervisorsInfo[address].token0.address, hypervisorsInfo[address].token0.amount);
      sumSingleBalance(balances, hypervisorsInfo[address].token1.address, hypervisorsInfo[address].token1.amount);
    }
  });

  return balances;
}
