import { AggregatorFacet__factory } from "./types";

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
