import { AddressMap, PartialChainRecord } from "../../types/chain";
import { Pool } from "../../utils/pool";
import {
  Registry__factory,
  TenderFarm__factory,
  Tenderizer__factory,
  TenderSwap__factory,
  Tenderizer,
  TenderFarm,
} from "./types";
import { TenderSwap } from "./types/TenderSwap";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const registryInterface = Registry__factory.createInterface();
export const tenderizerInterface = Tenderizer__factory.createInterface();
export const tenderSwapInterface = TenderSwap__factory.createInterface();
export const tenderFarmInterface = TenderFarm__factory.createInterface();

// contract events
export const DEPOSIT = tenderizerInterface.getEventTopic(tenderizerInterface.getEvent("Deposit"));
export const WITHDRAW = tenderizerInterface.getEventTopic(tenderizerInterface.getEvent("Withdraw"));
export const ADD_LIQUIDITY = tenderSwapInterface.getEventTopic(tenderSwapInterface.getEvent("AddLiquidity"));
export const REMOVE_LIQUIDITY = tenderSwapInterface.getEventTopic(tenderSwapInterface.getEvent("RemoveLiquidity"));
export const FARM = tenderFarmInterface.getEventTopic(tenderFarmInterface.getEvent("Farm"));
export const UNFARM = tenderFarmInterface.getEventTopic(tenderFarmInterface.getEvent("Unfarm"));

//types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  FARM = "Farm",
  UNFARM = "Unfarm",
}

type FarmIndo = { swapToken: string; steak: string; tenderizer: string; tenderSwap: string };

//constants
export const REGISTRY: AddressMap = {
  [constants.Chain.ETHEREUM]: "0xac7e1d17c1591de440f2ce3fd8e72d28c0c179f3",
};

export const REGISTRY_START_BLOCK: PartialChainRecord<number> = {
  [constants.Chain.ETHEREUM]: 14726922,
};

//helper functions
//TDOD: replace with hardcode address
export async function getSteak(address: string, chain: constants.Chain) {
  return (
    await abi.Multicall.singleCall<Tenderizer>({
      address,
      chain,
      contractInterface: tenderizerInterface,
      fragment: "steak",
    })
  ).output;
}

async function poolInfoExtractor(address: string, chain: constants.Chain) {
  const calls = [
    new abi.Call<TenderSwap>({ address, contractInterface: tenderSwapInterface, fragment: "getToken0" }),
    new abi.Call<TenderSwap>({ address, contractInterface: tenderSwapInterface, fragment: "getToken1" }),
  ];

  const result = await abi.Multicall.execute({ chain, calls });

  return { token0: result[0].output, token1: result[1].output };
}

export const tenderSwapPool = new Pool(poolInfoExtractor);

//TDOD: replace with hardcode address
export async function farmInfo(address: string, chain: constants.Chain): Promise<FarmIndo> {
  // get lp token address that staked in farming and tenderizer
  const farmResult = await abi.Multicall.execute({
    chain,
    calls: [
      new abi.Call<TenderFarm>({ address, contractInterface: tenderFarmInterface, fragment: "token" }),
      new abi.Call<TenderFarm>({ address, contractInterface: tenderFarmInterface, fragment: "tenderizer" }),
    ],
  });

  const tenderizer = farmResult[1].output;

  //get steak = underlying token and tender pool address
  const tenderizerResult = await abi.Multicall.execute({
    chain,
    calls: [
      new abi.Call<Tenderizer>({ address: tenderizer, contractInterface: tenderizerInterface, fragment: "steak" }),
      new abi.Call<Tenderizer>({ address: tenderizer, contractInterface: tenderizerInterface, fragment: "tenderSwap" }),
    ],
  });

  return {
    swapToken: farmResult[0].output,
    steak: tenderizerResult[0].output,
    tenderizer,
    tenderSwap: tenderizerResult[1].output,
  };
}
