import { AddressMap } from "../../types/chain";
import { GeneraicSwapFacet__factory } from "./types";
import { constants, utils } from "@spockanalytics/base";

// contract interfaces
export const generaicSwapFacetInterface = GeneraicSwapFacet__factory.createInterface();

// contract events
export const RUBIC_TRANSFER_STARTED = generaicSwapFacetInterface.getEventTopic(
  generaicSwapFacetInterface.getEvent("RubicTransferStarted"),
);
export const RUBIC_SWAPPED_GENERIC = generaicSwapFacetInterface.getEventTopic(
  generaicSwapFacetInterface.getEvent("RubicSwappedGeneric"),
);

// types
export enum Label {
  ON_CHAIN_SWAP = "On-chain Swap",
  CROSS_CHAIN_SWAP = "Cross-chain Swap",
}

//constants
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const WRAPPED_NATIVE: AddressMap = {
  [constants.Chain.ETHEREUM]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

// helper functions
export function assetAddress(sendingAsset: string, chain: constants.Chain) {
  return utils.isSameAddress(ZERO_ADDRESS, sendingAsset) ? WRAPPED_NATIVE[chain] : sendingAsset;
}
