import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { DepositEventObject, WithdrawEventObject } from "./types/StakePool";
import { DEPOSIT, WITHDRAW, stakePoolInterface, UNDERLYING_ASSET, Label } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const underlyingAsset = UNDERLYING_ASSET[constants.Chain.BSC];
  if (underlyingAsset) {
    const block = await Promise.resolve(event.block);
    const stakedAsset = await tokenBalanceUSD(
      {
        token: underlyingAsset,
        balance: event.params.bnbAmount,
      },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.STAKE,
      value: parseFloat(stakedAsset.toString()),
      user: event.params.user,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const underlyingAsset = UNDERLYING_ASSET[constants.Chain.BSC];
  if (underlyingAsset) {
    const block = await Promise.resolve(event.block);
    const stakedAsset = await tokenBalanceUSD(
      {
        token: underlyingAsset,
        balance: event.params.bnbAmount,
      },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.UNSTAKE,
      value: parseFloat(stakedAsset.toString()),
      user: event.params.user,
    });
  }
}

const pStakeAdapter: types.Adapter = {
  appKey: "",
  transformers: {
    [constants.Chain.BSC]: [
      {
        address: "0xc228cefdf841defdbd5b3a18dfd414cc0dbfa0d8",
        contract: stakePoolInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 20155830,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.BSC]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 20155830,
      },
    ],
  },
};

export default pStakeAdapter;
