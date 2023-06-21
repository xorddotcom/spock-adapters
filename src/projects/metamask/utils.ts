import { MetaSwap__factory } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const MetaSwapInterface = MetaSwap__factory.createInterface();

// contract events
export const SWAP = MetaSwapInterface.getEventTopic(MetaSwapInterface.getEvent("Swap"));

//types
export enum Label {
  SWAP = "Swap",
}

export const NativeToken = {
  [constants.Chain.ETHEREUM]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [constants.Chain.POLYGON]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  [constants.Chain.BSC]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};
