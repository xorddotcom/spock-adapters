import { tokenBalanceUSD } from "../../utils/sumBalances";
import { RubicSwappedGenericEventObject, RubicTransferStartedEventObject } from "./types/GeneraicSwapFacet";
import {
  Label,
  RUBIC_SWAPPED_GENERIC,
  RUBIC_TRANSFER_STARTED,
  generaicSwapFacetInterface,
  assetAddress,
} from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function rubicTransferStartedEvent(event: types.Event<RubicTransferStartedEventObject>) {
  const token = assetAddress(event.params.bridgeData.sendingAssetId);

  if (token) {
    const block = await Promise.resolve(event.block);

    const amount = await tokenBalanceUSD(
      { token, balance: event.params.bridgeData.minAmount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.CROSS_CHAIN_SWAP,
      value: parseFloat(amount.toString()),
      user: event.params.bridgeData.receiver,
    });
  }
}

export async function rubicSwappedGenericEvent(event: types.Event<RubicSwappedGenericEventObject>) {
  const token = assetAddress(event.params.fromAssetId);

  if (token) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const amount = await tokenBalanceUSD({ token, balance: event.params.fromAmount }, event.chain, block.timestamp);
    return utils.ProtocolValue.contribution({
      label: Label.ON_CHAIN_SWAP,
      value: parseFloat(amount.toString()),
      user: transaction.from,
    });
  }
}

const rubicAdapter: types.Adapter = {
  appKey: "9f189b0cb0d35fec1007bd9084c3b4671a0384fe728235c4b7cdfb549f6ff9cf",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x6aa981bff95edfea36bdae98c26b274ffcafe8d3", //RubicMultiProxy
        contract: generaicSwapFacetInterface,
        eventHandlers: {
          [RUBIC_TRANSFER_STARTED]: rubicTransferStartedEvent,
          [RUBIC_SWAPPED_GENERIC]: rubicSwappedGenericEvent,
        },
        // startBlock: 16422125,
        startBlock: 16895784,
      },
    ],
  },
};

export default rubicAdapter;
