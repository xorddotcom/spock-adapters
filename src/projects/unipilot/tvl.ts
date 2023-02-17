import { topicToAddress } from "../../utils/formatters";
import { sumSingleBalance, sumMultipleBalance, SummedBalances } from "../../utils/sumBalances";
import { Vault } from "./types";
import { vault, FACTORY_INFO, Factory, VAULT_CREATION_TOPIC } from "./utils";
import { abi, constants } from "@spockanalytics/base";

type Vaults = Record<string, { token0Address: string; token1Address: string }>;

async function getVaults(chain: constants.Chain, toBlock: number, factory: Factory) {
  const fromBlock = FACTORY_INFO[chain]?.[factory].startBlock ?? 0;

  const logs = await abi.getBatchLogs({
    address: FACTORY_INFO[chain]?.[factory].address ?? "",
    chain,
    topics: VAULT_CREATION_TOPIC[chain] ?? "",
    // toBlock: fromBlock + 10000,
    toBlock,
    fromBlock,
    batchSpread: 10,
  });

  return logs.reduce<Vaults>((accum, { topics }) => {
    accum[topicToAddress(topics[3])] = {
      token0Address: topicToAddress(topics[1]),
      token1Address: topicToAddress(topics[2]),
    };
    return accum;
  }, {});
}

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const activeVaults = await getVaults(chain, block, Factory.ACTIVE);
  const passiveVaults = await getVaults(chain, block, Factory.PASSIVE);

  const valuts = { ...activeVaults, ...passiveVaults };
  const vaultAddresses = Object.keys(valuts);

  //vault reserves extraction
  const reserves = await abi.Multicall.multipleContractSingleData<Vault>({
    address: vaultAddresses,
    chain,
    contractInterface: vault,
    fragment: "getPositionDetails",
  });

  vaultAddresses.forEach((address, index) => {
    const reserve = reserves[index];

    if (reserve) {
      sumSingleBalance(balances, valuts[address].token0Address, reserve.amount0);
      sumSingleBalance(balances, valuts[address].token0Address, reserve.fees0);
      sumSingleBalance(balances, valuts[address].token1Address, reserve.amount1);
      sumSingleBalance(balances, valuts[address].token1Address, reserve.fees1);
    }
  });

  //vault balances extraction
  const balanceOfInput = vaultAddresses.flatMap((vaultAddress) => {
    const vault = valuts[vaultAddress];
    return [
      { token: vault.token0Address, owner: vaultAddress },
      { token: vault.token1Address, owner: vaultAddress },
    ];
  });

  const vaultBalances = await abi.erc20MultiBalanceOf(balanceOfInput, chain);

  sumMultipleBalance(balances, vaultBalances);

  return balances;
}
