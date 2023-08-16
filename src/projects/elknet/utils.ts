import { AddressMap, PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { factoryAddressMapping, AddressMappingResult } from "../../utils/addressMapping";
import { Pool, uniswapV2_Pair } from "../../utils/pool";
import {
  ElkFactory__factory,
  ElkPair__factory,
  ElkFactory,
  ElkPair,
  Staking__factory,
  Farming__factory,
} from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const elkFactory = ElkFactory__factory.createInterface();
export const elkPair = ElkPair__factory.createInterface();
export const staking = Staking__factory.createInterface();
export const farming = Farming__factory.createInterface();

// contract events
export const MINT = elkPair.getEventTopic(elkPair.getEvent("Mint"));
export const BURN = elkPair.getEventTopic(elkPair.getEvent("Burn"));
export const STAKE = staking.getEventTopic(staking.getEvent("Staked"));
export const UNSTAKE = staking.getEventTopic(staking.getEvent("Withdrawn"));

//types
export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}

// constants
const ELK_FACTORY: AddressMap = {
  [constants.Chain.POLYGON]: "0xe3bd06c7ac7e1ceb17bdd2e5ba83e40d1515af2a",
};

export const ELK_TOKEN: PartialChainRecord<PartialTokenDecimals> = {
  [constants.Chain.POLYGON]: { address: "0xeeeeeb57642040be42185f49c52f7e9b38f8eeee", decimals: 18 },
};

// helper functions
export const elk_Pair = new Pool(uniswapV2_Pair<ElkPair>(elkPair));

export async function pairAddresses(chain: constants.Chain, blockNumber?: number): AddressMappingResult {
  return await factoryAddressMapping<ElkFactory>({
    address: ELK_FACTORY[chain] ?? "",
    chain,
    contractInterface: elkFactory,
    lengthFragment: "allPairsLength",
    addressFragment: "allPairs",
    blockNumber,
  });
}
