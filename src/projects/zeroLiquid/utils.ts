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

// constants
export const zETH: PartialTokenDecimals = {
  address: "0x776280f68ad33c4d49e6846507b7dbaf7811c89f",
  decimals: 18,
};

export const wrappedETH: PartialTokenDecimals = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  decimals: 18,
};

export const PROXY_ZERO_LIQUID = "0x0246e28c6b161764492e54cbf852e28a4da2d672";
