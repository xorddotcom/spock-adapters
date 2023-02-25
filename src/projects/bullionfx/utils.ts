import { AddressMap } from "../../types/chain";
import { factoryAddressMapping, AddressMappingResult } from "../../utils/addressMapping";
import { Pool, uniswapV2_Pair } from "../../utils/pool";
import { BullFactory__factory, BullPair__factory, BullFactory, BullPair } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const bullFactory = BullFactory__factory.createInterface();
export const bullPair = BullPair__factory.createInterface();

// contract events
export const MINT = bullPair.getEventTopic(bullPair.getEvent("Mint"));
export const BURN = bullPair.getEventTopic(bullPair.getEvent("Burn"));

//types
export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
}

// constants
const BULL_FACTORY: AddressMap = {
  [constants.Chain.ETHEREUM]: "0x5e7cfe3db397d3df3f516d79a072f4c2ae5f39bb",
};

// helper functions
export const bull_Pair = new Pool(uniswapV2_Pair<BullPair>(bullPair));

export async function pairAddresses(chain: constants.Chain, blockNumber?: number): AddressMappingResult {
  return await factoryAddressMapping<BullFactory>({
    address: BULL_FACTORY[chain] ?? "",
    chain,
    contractInterface: bullFactory,
    lengthFragment: "allPairsLength",
    addressFragment: "allPairs",
    blockNumber,
  });
}
