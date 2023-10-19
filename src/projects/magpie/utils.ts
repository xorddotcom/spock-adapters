import { PartialChainRecord } from "../../types/chain";
import { AggregatorFacet__factory } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const aggregatorFacetInterface = AggregatorFacet__factory.createInterface();

// contract events
export const SWAP = aggregatorFacetInterface.getEventTopic(aggregatorFacetInterface.getEvent("Swap"));
export const SWAP_IN = aggregatorFacetInterface.getEventTopic(aggregatorFacetInterface.getEvent("SwapIn"));
export const SWAP_OUT = aggregatorFacetInterface.getEventTopic(aggregatorFacetInterface.getEvent("SwapOut"));

// types
export enum Label {
  SWAP = "SWAP",
  SWAP_IN = "SWAP_IN",
  SWAP_OUT = "SWAP_OUT",
}

//constants

export const NATIVE_TOKEN: PartialChainRecord<string> = {
  [constants.Chain.ETHEREUM]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [constants.Chain.POLYGON]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  [constants.Chain.BSC]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  [constants.Chain.AVALANCHE]: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  [constants.Chain.ARBITRUM_ONE]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  [constants.Chain.OPTIMISM]: "0x4200000000000000000000000000000000000006",
};
