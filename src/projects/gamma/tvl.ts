import { SummedBalances } from "../../utils/sumBalances";
import { HYPE_REGISTRY_INFO, Dex, hypervisorInterface, hypeRegistryInterface } from "./utils";
import { abi, constants } from "@spockanalytics/base";

async function getHypervisors(chain: constants.Chain, dex: Dex, block: number) {
  const hypeRegistryAddress = HYPE_REGISTRY_INFO[chain]?.[dex].address ?? "";

  const hypervisorsCount = (
    await abi.Multicall.singleCall({
      address: hypeRegistryAddress,
      blockNumber: block,
      chain,
      contractInterface: hypervisorInterface,
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

export async function computeTVL(chain: constants.Chain, block: number, dex: Dex) {
  const balances: SummedBalances = {};

  const hypervisors = await getHypervisors(chain, dex, block);

  //TODO: complete implementation

  return balances;
}
