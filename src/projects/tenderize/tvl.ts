import { typeCast } from "../../utils/helper";
import { getLogs } from "../../utils/logs";
import { sumSingleBalance, SummedBalances } from "../../utils/sumBalances";
import { TenderizerCreatedEventObject } from "./types/Registry";
import { TenderSwap } from "./types/TenderSwap";
import { Tenderizer } from "./types/Tenderizer";
import { REGISTRY, REGISTRY_START_BLOCK, registryInterface, tenderizerInterface, tenderSwapInterface } from "./utils";
import { abi, constants, types } from "@spockanalytics/base";

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number, cache?: types.LogsCache) {
  const balances: SummedBalances = {};

  const fromBlock = REGISTRY_START_BLOCK[chain] ?? 0;

  //TODO: replace these logs with hardcoded addresses
  const logs = await getLogs(
    {
      address: REGISTRY[chain] ?? "",
      chain,
      topics: "TenderizerCreated((string,address,address,address,address,address))",
      fromBlock,
      toBlock: block,
      timestamp,
    },
    cache,
  );

  const configs = logs.reduce<{ [key: string]: { steak: string; tenderizer: string; tenderSwap: string } }>(
    (accum, log) => {
      const decodedData = typeCast<TenderizerCreatedEventObject>(registryInterface.parseLog(log).args).config;
      const { steak, tenderizer, tenderSwap } = decodedData;
      const uniqueKey = `${steak}-${tenderizer}-${tenderSwap}`;
      accum[uniqueKey] = { steak, tenderizer, tenderSwap };
      return accum;
    },
    {},
  );

  for (const config of Object.values(configs)) {
    const currentPrincipal = await abi.Multicall.singleCall<Tenderizer>({
      address: config.tenderizer,
      blockNumber: block,
      chain,
      contractInterface: tenderizerInterface,
      fragment: "currentPrincipal",
    });

    sumSingleBalance(balances, config.steak, currentPrincipal.output);

    const token1Balance = await abi.Multicall.singleCall<TenderSwap>({
      address: config.tenderSwap,
      blockNumber: block,
      chain,
      contractInterface: tenderSwapInterface,
      fragment: "getToken1Balance",
    });

    sumSingleBalance(balances, config.steak, token1Balance.output);
  }

  return balances;
}
