import { AddressMap } from "../../types/chain";
import { InterestBearingToken__factory } from "./types";
import { abi, constants } from "@spockanalytics/base";
import axios from "axios";

// contract interfaces
export const InterestBearingTokenInterface = InterestBearingToken__factory.createInterface();

// contract events
export const DEPOSIT = InterestBearingTokenInterface.getEventTopic(InterestBearingTokenInterface.getEvent("Deposit"));
export const WITHDRAW = InterestBearingTokenInterface.getEventTopic(InterestBearingTokenInterface.getEvent("Withdraw"));

//types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

// constants
export const COMPTROLLER: AddressMap = {
  [constants.Chain.POLYGON]: "0x1eDf64B621F17dc45c82a65E1312E8df988A94D3",
};

// helper functions
export async function getIBTokens(): Promise<Array<string>> {
  const moneyMarketRes = await axios.get(
    "https://raw.githubusercontent.com/alpaca-finance/alpaca-v2-money-market/main/.mainnet.json",
  );
  return moneyMarketRes.data?.moneyMarket?.markets?.map((e: { ibToken: string }) => e.ibToken);
}

export async function getUnderlyingAsset(address: string, chain: constants.Chain) {
  try {
    return (
      await abi.Multicall.singleCall({
        address: address,
        chain: chain,
        contractInterface: InterestBearingTokenInterface,
        fragment: "asset",
      })
    )?.output;
  } catch (e) {
    return undefined;
  }
}
