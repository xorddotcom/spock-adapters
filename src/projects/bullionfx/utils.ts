import { AddressMap } from "../../types/chain";
import { factoryAddressMapping, AddressMappingResult } from "../../utils/addressMapping";
import { Pool, uniswapV2_Pair } from "../../utils/pool";
import { BullFactory__factory, BullPair__factory, BullFactory, BullPair } from "./types";
import { constants, utils } from "@spockanalytics/base";

// contract interfaces
export const bullFactory = BullFactory__factory.createInterface();
export const bullPair = BullPair__factory.createInterface();

// contract events
export const MINT = bullPair.getEventTopic(bullPair.getEvent("Mint"));
export const BURN = bullPair.getEventTopic(bullPair.getEvent("Burn"));
export const SWAP = bullPair.getEventTopic(bullPair.getEvent("Swap"));

//types
export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  SWAP = "Swap",
  BUY = "Buy",
  SELL = "Sell",
}

// constants
const BULL_FACTORY: AddressMap = {
  [constants.Chain.ETHEREUM]: "0x5e7cfe3db397d3df3f516d79a072f4c2ae5f39bb",
};

export const GOLD_TOKEN = "0x57c88ed53d53fdc6b41d57463e6c405de162843e";
export const BULL_TOKEN = "0xb439b8731ee047799019ef0b745a51d256b116af";

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

export function isNativeToken(tokenAddress: string): boolean {
  return utils.isSameAddress(tokenAddress, GOLD_TOKEN) || utils.isSameAddress(tokenAddress, BULL_TOKEN);
}
