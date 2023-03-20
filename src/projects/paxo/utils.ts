import { AddressMap } from "../../types/chain";
import { Comptroller__factory, Comptroller, Market__factory, Market } from "./types";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const comptrollerInterface = Comptroller__factory.createInterface();
export const marketInterface = Market__factory.createInterface();

// contract events
export const MINT = marketInterface.getEventTopic(marketInterface.getEvent("Mint"));
export const REDEEM = marketInterface.getEventTopic(marketInterface.getEvent("Redeem"));
export const BORROW = marketInterface.getEventTopic(marketInterface.getEvent("Borrow"));
export const REPAY = marketInterface.getEventTopic(marketInterface.getEvent("RepayBorrow"));

//types
export enum Label {
  LEND = "Lend",
  REDEEM = "Redeem",
  BORROW = "Borrow",
  REPAY = "Repay",
}

// constants
export const COMPTROLLER: AddressMap = {
  [constants.Chain.POLYGON]: "0x1eDf64B621F17dc45c82a65E1312E8df988A94D3",
};

// helper functions
export async function getMarkets(chain: constants.Chain, blockNumber?: number): Promise<Array<string>> {
  return (
    await abi.Multicall.singleCall<Comptroller>({
      address: COMPTROLLER[chain] ?? "",
      blockNumber,
      chain,
      contractInterface: comptrollerInterface,
      fragment: "getAllMarkets",
    })
  ).output;
}

export async function getUnderlyingAsset(address: string, chain: constants.Chain) {
  try {
    return (
      await abi.Multicall.singleCall<Market>({
        address,
        chain,
        contractInterface: marketInterface,
        fragment: "underlying",
      })
    ).output;
  } catch (e) {
    return undefined;
  }
}
