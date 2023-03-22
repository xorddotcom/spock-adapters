import { AddressMap, PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { StakePool__factory } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const stakePoolInterface = StakePool__factory.createInterface();

// contract events
export const DEPOSIT = stakePoolInterface.getEventTopic(stakePoolInterface.getEvent("Deposit"));
export const WITHDRAW = stakePoolInterface.getEventTopic(stakePoolInterface.getEvent("Withdraw"));

//types
export enum Label {
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}

// constants
export const STAKE_POOL: AddressMap = {
  [constants.Chain.BSC]: "0xC228CefDF841dEfDbD5B3a18dFD414cC0dbfa0D8",
};

export const UNDERLYING_ASSET: PartialChainRecord<PartialTokenDecimals> = {
  [constants.Chain.BSC]: { address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 }, //WBNB
};
