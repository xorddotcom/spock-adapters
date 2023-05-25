import { BridgeFacet__factory } from "./types";

// contract interfaces
export const bridgeInterface = BridgeFacet__factory.createInterface();

// contract events
export const RUBIC_TRANSFER_STARTED = bridgeInterface.getEventTopic(bridgeInterface.getEvent("RubicTransferStarted"));

// types
export enum Label {
  RUBIC_TRANSFER_STARTED = "Rubic Transfer Started",
  SWAP = "Swap",
}
