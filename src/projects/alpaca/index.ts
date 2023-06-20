import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { DepositEventObject, WithdrawEventObject } from "./types/InterestBearingToken";
import { DEPOSIT, InterestBearingTokenInterface, Label, WITHDRAW, getIBTokens, getUnderlyingAsset } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);

  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.assets },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(assetValue.toString()),
      user: event.params.owner,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const asset = await getUnderlyingAsset(event.address, event.chain);

  if (asset) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: asset, balance: event.params.assets },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: parseFloat(assetValue.toString()),
      user: event.params.owner,
    });
  }
}

const alpacaAdapter: types.Adapter = {
  appKey: "---",
  transformers: {
    [constants.Chain.BSC]: [
      {
        contract: InterestBearingTokenInterface,
        getAddresses: getIBTokens,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 27685587,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.BSC]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 27685587,
      },
    ],
  },
};

export default alpacaAdapter;
