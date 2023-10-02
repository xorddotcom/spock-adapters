import { USDs__factory, VeSPA__factory } from "./types";

// contract addresses
export const USDsAddress = "0xd74f5255d557944cf7dd0e45ff521520002d5748";
export const VeSPAAddress = "0x2e2071180682ce6c247b1ef93d382d509f5f6a17";
export const SPAAddress = "0x5575552988a3a80504bbaeb1311674fcfd40ad4b";

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
