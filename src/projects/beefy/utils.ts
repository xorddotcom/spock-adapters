import { PartialChainRecord } from "../../types/chain";
import { BeefyVaultV7__factory } from "./types";
import { constants } from "@spockanalytics/base";
import axios, { AxiosResponse } from "axios";

// contract interfaces
export const beefyVaultInterface = BeefyVaultV7__factory.createInterface();

// contract event
export const TRANSFER = beefyVaultInterface.getEventTopic(beefyVaultInterface.getEvent("Transfer"));

// types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

interface BeefyVault {
  id: string;
  name: string;
  token: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenProviderId: string;
  earnedToken: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  oracle: string;
  oracleId: string;
  status: string;
  platformId: string;
  assets: string[];
  strategyTypeId: string;
  risks: string[];
  addLiquidityUrl: string;
  network: string;
  createdAt: number;
  chain: string;
  strategy: string;
  lastHarvest: number;
  pricePerFullShare: string;
}

// constnats
const VAULT_NETWORK: PartialChainRecord<string> = {
  [constants.Chain.POLYGON]: "polygon",
};

// helper functions
async function getVaults(chain: constants.Chain): Promise<Record<string, BeefyVault>> {
  const vaults = await axios.get<BeefyVault[]>("https://api.beefy.finance/vaults");
  return vaults.data.reduce<Record<string, BeefyVault>>((accum, vault) => {
    if (VAULT_NETWORK[chain] === vault.network) {
      accum[vault.earnContractAddress.toLowerCase()] = vault;
    }
    return accum;
  }, {});
}

export async function getVaultsAddresses(chain: constants.Chain): Promise<string[]> {
  const vaults = await getVaults(chain);
  return Object.keys(vaults);
}

export async function getVault(vaultAddress: string, chain: constants.Chain): Promise<BeefyVault> {
  const vaults = await getVaults(chain);
  return vaults[vaultAddress.toLowerCase()];
}

export async function underlyingLpPrice(oracleId: string): Promise<number> {
  const lpPrices = await axios.get<Record<string, number>>("https://api.beefy.finance/lps");
  return lpPrices.data[oracleId];
}
