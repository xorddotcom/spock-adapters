import { HypeRegistry__factory, Hypervisor__factory } from "./types";
import { abi, constants } from "@spockanalytics/base";
import { registryInterface } from "projects/tenderize/utils";
import { PartialChainRecord } from "types/chain";

// contract interfaces
export const hypeRegistryInterface = HypeRegistry__factory.createInterface();
export const hypervisorInterface = Hypervisor__factory.createInterface();

// contract events
export const DEPOSIT = hypervisorInterface.getEventTopic(hypervisorInterface.getEvent("Deposit"));
export const WITHDRAW = hypervisorInterface.getEventTopic(hypervisorInterface.getEvent("Withdraw"));

export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
}

export enum Dex {
  UNISWAP_V3 = "Uniswap V3",
}

export const HYPERVISOR_CREATION_TOPIC: PartialChainRecord<{ [dex: string]: string }> = {
  [constants.Chain.ETHEREUM]: {
    [Dex.UNISWAP_V3]: "0xfd73610dd51217377ee8fbb2a8afed164757d1aefb01f51caaf9d0b9be54613c",
  },
};

export const HYPE_REGISTRY_INFO: PartialChainRecord<{ [dex: string]: { address: string; startBlock: number } }> = {
  [constants.Chain.ETHEREUM]: {
    [Dex.UNISWAP_V3]: {
      address: "0x31CcDb5bd6322483bebD0787e1DABd1Bf1f14946",
      startBlock: 13659998,
    },
  },
};

// helper functions
export async function getHypervisorInfo(address: string, chain: constants.Chain) {
  const hypervisorTokens = await abi.Multicall.execute({
    chain: chain,
    calls: [
      new abi.Call({
        contractInterface: registryInterface,
        address: address,
        fragment: "token0",
      }),
      new abi.Call({
        contractInterface: registryInterface,
        address: address,
        fragment: "token1",
      }),
    ],
  });

  const tokensDecimals = await abi.Multicall.execute({
    chain: chain,
    calls: [
      new abi.Call({
        contractInterface: abi.erc20Interface,
        address: hypervisorTokens[0].output,
        fragment: "decimals",
      }),
      new abi.Call({
        contractInterface: abi.erc20Interface,
        address: hypervisorTokens[1].output,
        fragment: "decimals",
      }),
    ],
  });

  return {
    token0: { address: hypervisorTokens[0].output, decimals: tokensDecimals[0].output },
    token1: { address: hypervisorTokens[1].output, decimals: tokensDecimals[1].output },
  };
}
