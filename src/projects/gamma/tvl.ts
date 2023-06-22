import { SummedBalances, sumSingleBalance } from "../../utils/sumBalances";
import { Dex, getHypervisorsInfo, getHypervisors, getHypervisorsAmounts } from "./utils";
import { constants } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const hypervisors = await getHypervisors(chain, Dex.UNISWAP_V3, block);

  let hypervisorsInfo = await getHypervisorsInfo(hypervisors, chain, false);

  hypervisorsInfo = await getHypervisorsAmounts(hypervisorsInfo, chain);

  hypervisors.forEach((address) => {
    if (hypervisorsInfo[address]) {
      sumSingleBalance(balances, hypervisorsInfo[address].token0.address, hypervisorsInfo[address].token0.amount);
      sumSingleBalance(balances, hypervisorsInfo[address].token1.address, hypervisorsInfo[address].token1.amount);
    }
  });

  return balances;
}
