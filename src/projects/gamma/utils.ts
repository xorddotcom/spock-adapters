import { PartialChainRecord } from "../../types/chain";
import { getParamCalls } from "../../utils/helper";
import { Pool, uniswapV2_Pair } from "../../utils/pool";
import { HypeRegistry__factory, Hypervisor__factory, Hypervisor } from "./types";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const hypeRegistryInterface = HypeRegistry__factory.createInterface();
export const hypervisorInterface = Hypervisor__factory.createInterface();

// contract events
export const DEPOSIT = hypervisorInterface.getEventTopic(hypervisorInterface.getEvent("Deposit"));
export const WITHDRAW = hypervisorInterface.getEventTopic(hypervisorInterface.getEvent("Withdraw"));

// types
export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
}

export enum Dex {
  UNISWAP_V3 = "Uniswap V3",
  THENA = "Thena",
}

export enum EventType {
  DEPOSIT,
  WITHDRAW,
}

export type VisorsInfo = {
  [visorAddress: string]: {
    token0: { address: string; amount: number };
    token1: { address: string; amount: number };
  };
};

// constants
export const HYPE_REGISTRY_INFO: PartialChainRecord<{ [dex: string]: { address: string; startBlock: number } }> = {
  [constants.Chain.ETHEREUM]: {
    [Dex.UNISWAP_V3]: {
      address: "0x31CcDb5bd6322483bebD0787e1DABd1Bf1f14946",
      startBlock: 13659998,
    },
  },
  [constants.Chain.BSC]: {
    [Dex.UNISWAP_V3]: {
      address: "0x0b4645179c1b668464df01362fc6219a7ab3234c",
      startBlock: 26520492,
    },
    [Dex.THENA]: {
      address: "0xd4bcFC023736Db5617E5638748E127581d5929bd",
      startBlock: 26097149,
    },
  },
};

// helper functions
export const gamma_Hypervisor = new Pool(uniswapV2_Pair<Hypervisor>(hypervisorInterface));

export async function getHypervisors(chain: constants.Chain, dex: Dex) {
  const hypeRegistryAddress = HYPE_REGISTRY_INFO[chain]?.[dex]?.address || "";

  const hypervisorsCount = (
    await abi.Multicall.singleCall({
      address: hypeRegistryAddress,
      chain,
      contractInterface: hypeRegistryInterface,
      fragment: "counter",
    })
  ).output;

  return (
    await abi.Multicall.singleContractMultipleData({
      address: hypeRegistryAddress,
      chain,
      contractInterface: hypeRegistryInterface,
      fragment: "hypeByIndex",
      callInput: getParamCalls(Number(hypervisorsCount)),
    })
  ).map((e) => e.output[0]?.toLowerCase());
}

export async function getHypervisorsInfo(addresses: string[], chain: constants.Chain) {
  const visorsInfoCalls: abi.Call<Hypervisor>[] = [];

  const visorsInfo: VisorsInfo = {};

  addresses.forEach((e) => {
    visorsInfoCalls.push(
      new abi.Call({
        contractInterface: hypervisorInterface,
        address: e,
        fragment: "token0",
      }),
      new abi.Call({
        contractInterface: hypervisorInterface,
        address: e,
        fragment: "token1",
      }),
    );
  });

  const visorsRes = (await abi.Multicall.execute({ chain, calls: visorsInfoCalls })).map((e) => e?.output);

  for (let i = 0; i < visorsRes.length; i += 2) {
    const address0 = visorsRes[i]?.toLowerCase();
    const address1 = visorsRes[i + 1]?.toLowerCase();

    if (!address0 || !address1) continue;

    visorsInfo[addresses[i / 2]] = {
      token0: { address: address0, amount: 0 },
      token1: { address: address1, amount: 0 },
    };
  }

  return visorsInfo;
}

export async function getHypervisorsAmounts(visorsInfo: VisorsInfo, chain: constants.Chain, block: number) {
  const hypervisors = Object.keys(visorsInfo);

  const amounts = (
    await abi.Multicall.multipleContractSingleData({
      contractInterface: hypervisorInterface,
      address: hypervisors,
      fragment: "getTotalAmounts",
      blockNumber: block,
      chain,
    })
  ).map((e) => e.output);

  hypervisors.forEach((e, i) => {
    const token0 = visorsInfo[e].token0;
    const token1 = visorsInfo[e].token1;

    visorsInfo[e] = {
      token0: {
        ...token0,
        amount: amounts?.[i]?.[0] || 0,
      },
      token1: {
        ...token1,
        amount: amounts?.[i]?.[1] || 0,
      },
    };
  });

  return visorsInfo;
}
