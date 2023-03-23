import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { MintEventObject, RedeemEventObject, BorrowEventObject, RepayBorrowEventObject } from "./types/Market";
import { getUnderlyingAsset, getMarkets, marketInterface, Label, MINT, REDEEM, BORROW, REPAY } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function mintEvent(event: types.Event<MintEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);
  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.mintAmount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.LEND,
      value: parseFloat(assetValue.toString()),
      user: event.params.minter,
    });
  }
}

export async function redeemEvent(event: types.Event<RedeemEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);
  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.redeemAmount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.REDEEM,
      value: parseFloat(assetValue.toString()),
      user: event.params.redeemer,
    });
  }
}

export async function borrowEvent(event: types.Event<BorrowEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);
  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.borrowAmount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.BORROW,
      value: parseFloat(assetValue.toString()),
      user: event.params.borrower,
    });
  }
}

export async function repayEvent(event: types.Event<RepayBorrowEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);
  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.repayAmount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.REPAY,
      value: parseFloat(assetValue.toString()),
      user: event.params.payer,
    });
  }
}

const paxoAdapter: types.Adapter = {
  appKey: "fdcfc764a3b13348d49bee86a17057920aefdce5496a1ee79629305a05e42571",
  transformers: {
    [constants.Chain.POLYGON]: [
      {
        contract: marketInterface,
        getAddresses: getMarkets,
        eventHandlers: {
          [MINT]: mintEvent,
          [REDEEM]: redeemEvent,
          [BORROW]: borrowEvent,
          [REPAY]: repayEvent,
        },
        startBlock: 33707726,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.POLYGON]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL(types.TVL_Category.TVL),
        startBlock: 33707726,
      },
      {
        category: types.TVL_Category.BORROWED,
        extractor: computeTVL(types.TVL_Category.BORROWED),
        startBlock: 33707726,
      },
    ],
  },
};

export default paxoAdapter;
