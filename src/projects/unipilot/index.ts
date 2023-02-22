import { stakingTvl } from "../../utils/staking";
import { sumBalancesUSD, tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { StakeOrUnstakeOrClaimEventObject } from "./types/Staking";
import { DepositEventObject, WithdrawEventObject } from "./types/Vault";
import {
  vault,
  staking,
  DEPOSIT,
  WITHDRAW,
  STAKE_OR_UNSTAKE_OR_CLAIN,
  PILOT,
  StakingTxnType,
  Label,
  unipilotVault,
  PILOT_STAKING,
} from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const vaultAddress = event.address;
  const vault = await unipilotVault.getPool(vaultAddress, event.chain);

  if (vault) {
    const block = await Promise.resolve(event.block);
    const totalSum = await sumBalancesUSD(
      [
        { token: vault.token0, balance: event.params.amount0 },
        { token: vault.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.ADD_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: event.params.depositor,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const vaultAddress = event.address;
  const vault = await unipilotVault.getPool(vaultAddress, event.chain);
  if (vault) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const totalSum = await sumBalancesUSD(
      [
        { token: vault.token0, balance: event.params.amount0 },
        { token: vault.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.REMOVE_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: transaction.from,
    });
  }
}

export async function stakeOrUnsatkeEvent(event: types.Event<StakeOrUnstakeOrClaimEventObject>) {
  const { txType, amount } = event.params;
  const block = await Promise.resolve(event.block);
  const pilotAmount = await tokenBalanceUSD({ token: PILOT, balance: amount }, event.chain, block.timestamp);
  if (txType === StakingTxnType.STAKE) {
    return utils.ProtocolValue.contribution({
      label: Label.STAKE,
      value: parseFloat(pilotAmount.toString()),
      user: event.params.user,
    });
  } else if (txType === StakingTxnType.UNSTAKE) {
    return utils.ProtocolValue.extraction({
      label: Label.UNSTAKE,
      value: parseFloat(pilotAmount.toString()),
      user: event.params.user,
    });
  }
}

const unipilotAdapter: types.Adapter = {
  appKey: "079f119db037cbe7de4cee7b62b47ade7ad01f8da462b6f421a4681e6e605be7",
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
    [constants.Chain.POLYGON]: [
      {
        contract: vault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 34288237,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 14495907,
      },
      {
        category: types.TVL_Category.STAKING,
        extractor: stakingTvl(PILOT_STAKING, PILOT.address),
        startBlock: 15025220,
      },
    ],
    [constants.Chain.POLYGON]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 34371363,
      },
    ],
  },
};

export default unipilotAdapter;
