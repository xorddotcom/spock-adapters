import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeLendingTVL, computeBorrowTVL } from "./tvl";
import { LogRepayEventObject } from "./types/BorrowFacet";
import { LogDepositEventObject, LogWithdrawEventObject } from "./types/LendFacet";
import { BorrowFacetInterface, LendFacetInterface, Label, REPAY, LEND, REDEEM } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function lendEvent(event: types.Event<LogDepositEventObject>) {
  const asset = event.params._token;

  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params._amountIn },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.LEND,
      value: parseFloat(assetValue.toString()),
      user: event.params._for,
    });
  }
}

export async function redeemEvent(event: types.Event<LogWithdrawEventObject>) {
  const asset = event.params._token;

  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params._amountIn },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.extraction({
      label: Label.REDEEM,
      value: parseFloat(assetValue.toString()),
      user: event.params._for,
    });
  }
}

export async function repayEvent(event: types.Event<LogRepayEventObject>) {
  const asset = event.params._token;

  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params._actualRepayAmount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.REPAY,
      value: parseFloat(assetValue.toString()),
      user: event.params._account,
    });
  }
}

const alpacaAdapter: types.Adapter = {
  appKey: "f6f171d44b0eda21a845383f949db87a7ed72f9397ae2043fb2244e926ea3258",
  transformers: {
    [constants.Chain.BSC]: [
      {
        contract: LendFacetInterface,
        address: "0x7389aaf2e32872cabd766d0ceb384220e8f2a590",
        eventHandlers: {
          [LEND]: lendEvent,
          [REDEEM]: redeemEvent,
        },
        startBlock: 27685587,
      },
      {
        contract: BorrowFacetInterface,
        address: "0x7389aaf2e32872cabd766d0ceb384220e8f2a590",
        eventHandlers: {
          [REPAY]: repayEvent,
        },
        startBlock: 27685587,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.BSC]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeLendingTVL,
        startBlock: 27686778,
      },
      {
        category: types.TVL_Category.BORROWED,
        extractor: computeBorrowTVL,
        startBlock: 27686778,
      },
    ],
  },
};

export default alpacaAdapter;
