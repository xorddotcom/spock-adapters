import { factoryAddressMapping } from "../../utils/addressMapping";
import { sumSingleBalance, SummedBalances } from "../../utils/sumBalances";
import { SmartVault, Strategy, ControllerV2, ContractReaderV2, ContractReader, VestedTetu } from "./types";
import {
  vaultAddresses,
  smartVault,
  strategy,
  controllerV2,
  CONTROLLER_V2,
  contractReader,
  contractReaderV2,
  CONTRACT_READER,
  EXCLUDED_PLATFORMS,
  EXCLUDED_VAULTS,
  V_TETU_CONTRACT,
  veTetu,
} from "./utils";
import { formatEther } from "@ethersproject/units";
import { abi, constants } from "@spockanalytics/base";

async function v2VaultsTvl(balances: SummedBalances, chain: constants.Chain, block: number) {
  const controllerV2Address = CONTROLLER_V2[chain];

  if (controllerV2Address && block > 36865497) {
    const v2Vaults = await abi.Multicall.singleCall<ControllerV2>({
      address: controllerV2Address,
      blockNumber: block,
      chain,
      contractInterface: controllerV2,
      fragment: "vaultsList",
    });

    const v2VaultsUsdc = await abi.Multicall.singleContractMultipleData<ContractReaderV2>({
      address: CONTRACT_READER[chain] ?? "",
      blockNumber: block,
      chain,
      contractInterface: contractReaderV2,
      fragment: "vaultERC2626TvlUsdc",
      callInput: v2Vaults.output,
    });

    v2VaultsUsdc.forEach((v2VaultUsdc) => v2VaultUsdc.success && sumSingleBalance(balances, "usd", v2VaultUsdc.output));
  }
}

async function vestedTETU(chain: constants.Chain, block: number) {
  const vTetuContract = V_TETU_CONTRACT[chain];
  if (vTetuContract && block > 36865815) {
    const tokens =
      (await factoryAddressMapping<VestedTetu>({
        address: vTetuContract,
        blockNumber: block,
        chain,
        contractInterface: veTetu,
        lengthFragment: "tokensLength",
        addressFragment: "tokens",
      })) ?? [];

    const tokenBalanceCalls = tokens.map((token) => ({ token, owner: vTetuContract }));
    const tokenBalances = await abi.erc20MultiBalanceOf(tokenBalanceCalls, chain, block);

    const prices = await abi.Multicall.singleContractMultipleData<ContractReader>({
      address: CONTRACT_READER[chain] ?? "",
      blockNumber: block,
      chain,
      contractInterface: contractReader,
      fragment: "getPrice",
      callInput: tokens,
    });

    const veTetuUsd = tokenBalances.reduce((accum, balance, index) => {
      const price = prices[index].output;
      accum += (parseFloat(balance.balance.toString()) * price) / 1e36;
      return accum;
    }, 0);

    return veTetuUsd;
  }
}

export async function computeTVL(chain: constants.Chain, block: number, timestamp: number) {
  const balances: SummedBalances = {};

  const vaults = await vaultAddresses(chain, block);

  if (vaults) {
    const strategies = await abi.Multicall.multipleContractSingleData<SmartVault>({
      address: vaults,
      blockNumber: block,
      chain,
      contractInterface: smartVault,
      fragment: "strategy",
    });

    const strategyAddresses: string[] = strategies.map((strategy) => strategy.output);

    const platforms = await abi.Multicall.multipleContractSingleData<Strategy>({
      address: strategyAddresses,
      blockNumber: block,
      chain,
      contractInterface: strategy,
      fragment: "platform",
    });

    const vaultCalls = vaults.filter(
      (vault, index) =>
        !(
          EXCLUDED_PLATFORMS.includes(platforms[index].output) || EXCLUDED_VAULTS[chain]?.includes(vault.toLowerCase())
        ),
    );

    const vaultUsdcs = await abi.Multicall.singleContractMultipleData<ContractReader>({
      address: CONTRACT_READER[chain] ?? "",
      blockNumber: block,
      chain,
      contractInterface: contractReader,
      fragment: "vaultTvlUsdc",
      callInput: vaultCalls,
    });

    vaultUsdcs.forEach((vaultUsdc) => vaultUsdc.success && sumSingleBalance(balances, "usd", vaultUsdc.output));
  }

  await v2VaultsTvl(balances, chain, block);

  balances["usd"] = formatEther(balances["usd"] ?? 0);

  const vTetuUsd = await vestedTETU(chain, block);
  if (vTetuUsd) {
    balances["usd"] = (parseFloat(balances["usd"]) + vTetuUsd).toString();
  }

  return balances;
}
