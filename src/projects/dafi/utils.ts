import { PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { Staking__factory } from "./types";
import { constants } from "@spockanalytics/base";

// contract interfaces
export const staking = Staking__factory.createInterface();

// contract events
export const STAKE = staking.getEventTopic(staking.getEvent("STAKED"));
export const UNSTAKE = staking.getEventTopic(staking.getEvent("UNSTAKED"));

//types
export enum Label {
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}

// constants
export const DAFI: PartialChainRecord<PartialTokenDecimals> = {
  [constants.Chain.ETHEREUM]: {
    address: "0xfc979087305a826c2b2a0056cfaba50aad3e6439",
    decimals: 18,
  },
  [constants.Chain.POLYGON]: {
    address: "0x638df98ad8069a15569da5a6b01181804c47e34c",
    decimals: 18,
  },
  [constants.Chain.BSC]: {
    address: "0x4e0fe270b856eebb91fb4b4364312be59f499a3f",
    decimals: 18,
  },
};
