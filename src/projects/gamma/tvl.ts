import { SummedBalances, sumSingleBalance } from "../../utils/sumBalances";
import { getHypervisorsInfo, getHypervisors, getHypervisorsAmounts } from "./utils";
import { constants } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const hypervisors = await getHypervisors(chain);

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
