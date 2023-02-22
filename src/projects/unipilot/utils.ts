import { PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { Pool, PoolInfoExtracter } from "../../utils/pool";
import { Staking__factory, Vault__factory, Vault } from "./types";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const vault = Vault__factory.createInterface();
export const staking = Staking__factory.createInterface();

// contract events
export const DEPOSIT = vault.getEventTopic(vault.getEvent("Deposit"));
export const WITHDRAW = vault.getEventTopic(vault.getEvent("Withdraw"));
export const STAKE_OR_UNSTAKE_OR_CLAIN = staking.getEventTopic(staking.getEvent("StakeOrUnstakeOrClaim"));

//types
export enum StakingTxnType {
  STAKE = 0,
  UNSTAKE = 1,
}

export enum Factory {
  ACTIVE = "active",
  PASSIVE = "passive",
}

export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}

//constants
export const PILOT: PartialTokenDecimals = {
  address: "0x37c997b35c619c21323f3518b9357914e8b99525",
  decimals: 18,
};

export const PILOT_STAKING = "0xc9256e6e85ad7ac18cd9bd665327fc2062703628";

export const VAULT_CREATION_TOPIC: PartialChainRecord<string> = {
  [constants.Chain.ETHEREUM]: "VaultCreated(address,address,uint24,address)",
  [constants.Chain.POLYGON]: "VaultCreated(address,address,uint16,uint24,address)",
};

export const FACTORY_INFO: PartialChainRecord<Record<Factory, { address: string; startBlock: number }>> = {
  [constants.Chain.ETHEREUM]: {
    [Factory.ACTIVE]: {
      address: "0x4b8e58d252ba251e044ec63125e83172eca5118f",
      startBlock: 14495907,
    },
    [Factory.PASSIVE]: {
      address: "0x06c2ae330c57a6320b2de720971ebd09003c7a01",
      startBlock: 14495929,
    },
  },
  [constants.Chain.POLYGON]: {
    [Factory.ACTIVE]: {
      address: "0x95b77505b38f8a261ada04f54b8d0cda08904708",
      startBlock: 34288237,
    },
    [Factory.PASSIVE]: {
      address: "0x2536527121fc1048ae5d45327a34241a355a6a95",
      startBlock: 34371363,
    },
  },
};

// helper functions
async function vaultInfo(address: string, chain: constants.Chain): ReturnType<PoolInfoExtracter> {
  const result = (
    await abi.Multicall.singleCall<Vault>({
      address,
      chain,
      contractInterface: vault,
      fragment: "getVaultInfo",
    })
  ).output;

  return { token0: result[0], token1: result[1] };
}
export const unipilotVault = new Pool(vaultInfo);
