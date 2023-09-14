import { PartialTokenDecimals } from "../../types/token";
import { ZeroLiquid__factory } from "./types";

// contract interfaces
export const zeroLiquidInterface = ZeroLiquid__factory.createInterface();

// contract events
export const DEPOSIT = zeroLiquidInterface.getEventTopic(zeroLiquidInterface.getEvent("Deposit"));
export const WITHDRAW = zeroLiquidInterface.getEventTopic(zeroLiquidInterface.getEvent("Withdraw"));
export const MINT = zeroLiquidInterface.getEventTopic(zeroLiquidInterface.getEvent("Mint"));
export const BURN = zeroLiquidInterface.getEventTopic(zeroLiquidInterface.getEvent("Burn"));

// types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  MINT = "Mint",
  BURN = "Burn",
}

export const zETH: PartialTokenDecimals = {
  address: "0x776280f68ad33c4d49e6846507b7dbaf7811c89f",
  decimals: 18,
};
