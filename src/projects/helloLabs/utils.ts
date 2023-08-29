import { PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { Bridge__factory } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const bridgeInterface = Bridge__factory.createInterface();

// contract events
export const DEPOSIT = bridgeInterface.getEventTopic(bridgeInterface.getEvent("Deposit"));
export const CLAIM = bridgeInterface.getEventTopic(bridgeInterface.getEvent("Claim"));

// types
export enum Label {
  DEPOSIT = "Deposit",
  CLAIM = "Claim",
}

// constants
export const HELLO_TOKEN: PartialChainRecord<PartialTokenDecimals> = {
  [constants.Chain.BSC]: { address: "0x0f1cbed8efa0e012adbccb1638d0ab0147d5ac00", decimals: 18 },
  [constants.Chain.ETHEREUM]: { address: "0x411099c0b413f4feddb10edf6a8be63bd321311c", decimals: 18 },
};
