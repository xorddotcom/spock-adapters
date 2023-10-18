import { USDs__factory, VeSPA__factory } from "./types";
import { constants } from "@spockanalytics/base";
import { PartialChainRecord } from "../../types/chain";

// contract interfaces
export const USDsInterface = USDs__factory.createInterface();
export const VeSPAInterface = VeSPA__factory.createInterface();

// USDs contract events
export const TRANSFER = USDsInterface.getEventTopic(USDsInterface.getEvent("Transfer(address,address,uint256)"));

// VeSPA contract events
export const DEPOSIT = VeSPAInterface.getEventTopic(VeSPAInterface.getEvent("UserCheckpoint"));
export const WITHDRAW = VeSPAInterface.getEventTopic(VeSPAInterface.getEvent("Withdraw"));

// types
export enum Label {
  ADD_COLLATERAL = "Add Collateral",
  REMOVE_COLLATERAL = "Remove Collateral",
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}

// contract addresses
export const USDsAddress = "0xd74f5255d557944cf7dd0e45ff521520002d5748";
export const VeSPAAddress: PartialChainRecord<string> = {
  [constants.Chain.ARBITRUM_ONE]: "0x2e2071180682ce6c247b1ef93d382d509f5f6a17",
  [constants.Chain.ETHEREUM]: "0xbf82a3212e13b2d407d10f5107b5c8404de7f403",
};
export const SPAAddress: PartialChainRecord<string> = {
  [constants.Chain.ARBITRUM_ONE]: "0x5575552988a3a80504bbaeb1311674fcfd40ad4b",
  [constants.Chain.ETHEREUM]: "0xb4a3b0faf0ab53df58001804dda5bfc6a3d59008",
};
