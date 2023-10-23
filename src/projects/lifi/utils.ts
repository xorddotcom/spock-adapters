import { WRAPPED_NATIVE_TOKEN } from "../../constants/tokens";
import { AcrossFacet__factory } from "./types";
import { constants, utils } from "@spockanalytics/base";

// contract interfaces
export const acrossFacetInterface = AcrossFacet__factory.createInterface();

// contract events
export const LIFI_TRANSFER_STARTED = acrossFacetInterface.getEventTopic(
  acrossFacetInterface.getEvent("LiFiTransferStarted"),
);
export const LIFI_SWAPPED_GENERIC = acrossFacetInterface.getEventTopic(
  acrossFacetInterface.getEvent("LiFiSwappedGeneric"),
);

// types
export enum Label {
  ON_CHAIN_SWAP = "On-chain Swap",
  CROSS_CHAIN_SWAP = "Cross-chain Swap",
}

//constants
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// helper functions
export function assetAddress(sendingAsset: string, chain: constants.Chain) {
  return utils.isSameAddress(ZERO_ADDRESS, sendingAsset) ? WRAPPED_NATIVE_TOKEN[chain] : sendingAsset;
}
