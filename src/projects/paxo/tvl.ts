import { sumSingleBalance, SummedBalances } from "../../utils/sumBalances";
import { Market } from "./types";
import { getMarkets, marketInterface } from "./utils";
import { abi, constants, types } from "@spockanalytics/base";

export function computeTVL(category: types.TVL_Category.TVL | types.TVL_Category.BORROWED) {
  return async (chain: constants.Chain, block: number, timestamp: number) => {
    const balances: SummedBalances = {};

    const markets = await getMarkets(chain, block);

    const underlyigAssets = await abi.Multicall.multipleContractSingleData<Market>({
      address: markets,
      blockNumber: block,
      chain,
      fragment: "underlying",
      contractInterface: marketInterface,
    });

    const assetValue = await abi.Multicall.multipleContractSingleData<Market>({
      address: markets,
      blockNumber: block,
      chain,
      fragment: category === types.TVL_Category.TVL ? "getCash" : "totalBorrows",
      contractInterface: marketInterface,
    });

    underlyigAssets.forEach((asset, index) => {
      sumSingleBalance(balances, asset.output, assetValue[index].output);
    });

    return balances;
  };
}
