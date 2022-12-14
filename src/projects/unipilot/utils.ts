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

// helper functions
async function vaultInfo(address: string, chain: constants.Chain): ReturnType<PoolInfoExtracter> {
  const result = await abi.Multicall.singleCall<Vault>({
    address,
    chain,
    contractInterface: vault,
    fragment: "getVaultInfo",
  });

  return { token0: result[0], token1: result[1] };
}

export const unipilotVault = new Pool(vaultInfo);

export const PILOT: PartialTokenDecimals = {
  address: "0x37c997b35c619c21323f3518b9357914e8b99525",
  decimals: 18,
};

export enum StakingTxnType {
  STAKE = 0,
  UNSTAKE = 1,
}

export enum Label {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  STAKE = "Stake",
  UNSTAKE = "Unstake",
}
