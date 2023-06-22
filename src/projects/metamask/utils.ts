import { AddressMap } from "../../types/chain";
import { MetaSwap__factory, LidoEthStaking__factory, RockedEthStaking__factory } from "./types";
import { constants, utils } from "@spockanalytics/base";

// contract interfaces
export const MetaSwapInterface = MetaSwap__factory.createInterface();
export const LidoEthStakingInterface = LidoEthStaking__factory.createInterface();
export const RockedEthStakingInterface = RockedEthStaking__factory.createInterface();

// contract events
export const SWAP = MetaSwapInterface.getEventTopic(MetaSwapInterface.getEvent("Swap"));
export const STAKE_LIDO = LidoEthStakingInterface.getEventTopic(LidoEthStakingInterface.getEvent("Submitted"));
export const STAKE_ROCKET = RockedEthStakingInterface.getEventTopic(
  RockedEthStakingInterface.getEvent("DepositReceived"),
);

//types
export enum Label {
  SWAP = "Swap",
  STAKE_LIDO = "Stake on Lido",
  STAKE_ROCKET = "Stake on Rocket",
}

//constants
export const NativeToken: AddressMap = {
  [constants.Chain.ETHEREUM]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [constants.Chain.POLYGON]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  [constants.Chain.BSC]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};

export const MetamaskStakingAggregator: AddressMap = {
  [constants.Chain.ETHEREUM]: "0x67054183db455d74839d1ea11f7e497350f64c71",
};

// helper functions
export function isStakingAggregator(address: string, chain: constants.Chain) {
  return utils.isSameAddress(address, MetamaskStakingAggregator[chain]);
}
