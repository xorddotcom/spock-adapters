import { HypeRegistry__factory, Hypervisor__factory, Hypervisor } from "./types";
import { abi, constants } from "@spockanalytics/base";
import { Erc20 } from "contracts/types";
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

export async function getHypervisors(chain: constants.Chain, dex: Dex, block: number) {
  const hypeRegistryAddress = HYPE_REGISTRY_INFO[chain]?.[dex].address ?? "";

  const hypervisorsCount = (
    await abi.Multicall.singleCall({
      address: hypeRegistryAddress,
      blockNumber: block,
      chain,
      contractInterface: hypeRegistryInterface,
      fragment: "counter",
    })
  ).output;

  const calls = [];

  for (let i = 0; i <= hypervisorsCount; i++) {
    calls.push(
      new abi.Call({
        contractInterface: hypeRegistryInterface,
        address: hypeRegistryAddress,
        fragment: "hypeByIndex",
        callInput: [i],
      }),
    );
  }

  return (
    await abi.Multicall.execute({
      chain: chain,
      blockNumber: block,
      calls: calls,
    })
  )
    .map((e) => e.output)
    .filter((e) => e[1] > 0)
    .map((e) => e[0]);
}

export async function getHypervisorsInfo(addresses: string[], chain: constants.Chain, includeDecimals: boolean) {
  const visorsInfoCalls: abi.Call<Hypervisor>[] = [];
  const tokensDecimalsCalls: abi.Call<Erc20>[] = [];

  const visorsInfo: {
    [visorAddress: string]: {
      token0: { address: string; decimals: number; amount: number };
      token1: { address: string; decimals: number; amount: number };
    };
  } = {};

  let tokensDecimals: { [address: string]: number | string } = {};

  addresses.forEach((e) => {
    visorsInfoCalls.push(
      new abi.Call({
        contractInterface: hypervisorInterface,
        address: e,
        fragment: "token0",
      }),
    );
    visorsInfoCalls.push(
      new abi.Call({
        contractInterface: hypervisorInterface,
        address: e,
        fragment: "token1",
      }),
    );
  });

  const visorsRes = await abi.Multicall.execute({ chain, calls: visorsInfoCalls });

  for (let i = 0; i < visorsRes.length; i += 2) {
    const address0 = visorsRes[i].output;
    const address1 = visorsRes[i + 1].output;

    if (!address0 || !address1) continue;

    visorsInfo[addresses[i / 2]] = {
      token0: { address: address0, decimals: 1, amount: 0 },
      token1: { address: address1, decimals: 1, amount: 0 },
    };

    if (includeDecimals) {
      tokensDecimals = {
        ...tokensDecimals,
        [address0]: 1,
        [address1]: 1,
      };
    }
  }

  if (includeDecimals) {
    Object.keys(tokensDecimals).forEach((e) => {
      tokensDecimalsCalls.push(
        new abi.Call({
          contractInterface: abi.erc20Interface,
          address: e,
          fragment: "decimals",
        }),
      );
    });

    const decimalsRes = await abi.Multicall.execute({ chain, calls: tokensDecimalsCalls });

    decimalsRes.forEach((e, i) => (tokensDecimals[i] = e.output));

    addresses.forEach((e) => {
      const token0 = visorsInfo[e].token0;
      const token1 = visorsInfo[e].token1;

      visorsInfo[e] = {
        token0: { ...token0, decimals: Number(tokensDecimals[token0.address]) },
        token1: { ...token1, decimals: Number(tokensDecimals[token1.address]) },
      };
    });
  }

  return visorsInfo;
}

export async function getHypervisorsAmounts(
  visorsInfo: {
    [visorAddress: string]: {
      token0: { address: string; decimals: number; amount: number };
      token1: { address: string; decimals: number; amount: number };
    };
  },
  chain: constants.Chain,
) {
  const amountsCalls: abi.Call<Hypervisor>[] = [];

  Object.keys(visorsInfo).forEach((e) => {
    amountsCalls.push(
      new abi.Call({
        contractInterface: hypervisorInterface,
        address: e,
        fragment: "getTotalAmounts",
      }),
    );
  });

  const amounts = await abi.Multicall.execute({ chain, calls: amountsCalls });

  Object.keys(visorsInfo).forEach((e, i) => {
    const token0 = visorsInfo[e].token0;
    const token1 = visorsInfo[e].token1;

    visorsInfo[e] = {
      token0: {
        ...token0,
        amount: amounts[i].output?.[0] || 0,
      },
      token1: {
        ...token1,
        amount: amounts[i].output?.[1] || 0,
      },
    };
  });

  return visorsInfo;
}
