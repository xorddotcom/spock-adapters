import { sumBalancesUSD, tokenBalanceUSD } from "../../utils/sumBalances";
import { StakeOrUnstakeOrClaimEventObject } from "./types/Staking";
import { DepositEventObject, WithdrawEventObject } from "./types/Vault";
import {
  vault,
  staking,
  DEPOSIT,
  WITHDRAW,
  STAKE_OR_UNSTAKE_OR_CLAIN,
  PILOT,
  STAKING_TXN_TYPE,
  unipilotVault,
} from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  console.log("unipilot depositEvent => ", event);
  const vaultAddress = event.transaction.to;
  const vault = await unipilotVault.getPool(vaultAddress, event.chain);
  if (vault) {
    const totalSum = await sumBalancesUSD(
      [
        { token: vault.token0, balance: event.params.amount0 },
        { token: vault.token1, balance: event.params.amount1 },
      ],
      event.chain,
      event.block.number,
    );
    return utils.ProtocolValue.contribution("Add Liquidity", parseFloat(totalSum.toString()));
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  console.log("unipilot withdrawEvent => ", event);
  const vaultAddress = event.transaction.to;
  const vault = await unipilotVault.getPool(vaultAddress, event.chain);
  if (vault) {
    const totalSum = await sumBalancesUSD(
      [
        { token: vault.token0, balance: event.params.amount0 },
        { token: vault.token1, balance: event.params.amount1 },
      ],
      event.chain,
      event.block.number,
    );
    return utils.ProtocolValue.extraction("Remove Liquidity", parseFloat(totalSum.toString()));
  }
}

export async function stakeOrUnsatkeEvent(event: types.Event<StakeOrUnstakeOrClaimEventObject>) {
  console.log("unipilot stakeOrUnsatkeEvent => ", event);
  const { txType, amount } = event.params;
  const pilotAmount = await tokenBalanceUSD({ token: PILOT, balance: amount }, event.chain, event.block.number);
  if (txType === STAKING_TXN_TYPE.STAKE) {
    return utils.ProtocolValue.contribution("Stake", parseFloat(pilotAmount.toString()));
  } else if (txType === STAKING_TXN_TYPE.UNSTAKE) {
    return utils.ProtocolValue.extraction("UnStake", parseFloat(pilotAmount.toString()));
  }
}

const unipilotAdapter: types.Adapter = {
  appKey: "08019e5ae0b9b6964c2317c26a4b8666d4ac357b0060c3b6e9fb680b4465f693",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: vault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 14495907,
      },
      {
        address: "0xc9256e6e85ad7ac18cd9bd665327fc2062703628",
        contract: staking,
        eventHandlers: {
          [STAKE_OR_UNSTAKE_OR_CLAIN]: stakeOrUnsatkeEvent,
        },
        startBlock: 15025220,
      },
    ],
  },
};

export default unipilotAdapter;
