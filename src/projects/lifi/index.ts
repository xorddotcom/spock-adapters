import { tokenBalanceUSD } from "../../utils/sumBalances";
import { LiFiSwappedGenericEventObject, LiFiTransferStartedEventObject } from "./types/AcrossFacet";
import { Label, LIFI_SWAPPED_GENERIC, LIFI_TRANSFER_STARTED, acrossFacetInterface, assetAddress } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function lifiTransferStartedEvent(event: types.Event<LiFiTransferStartedEventObject>) {
  const token = assetAddress(event.params.bridgeData.sendingAssetId, event.chain);

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

export async function lifiSwappedGenericEvent(event: types.Event<LiFiSwappedGenericEventObject>) {
  const token = assetAddress(event.params.fromAssetId, event.chain);

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

const lifiAdapter: types.Adapter = {
  appKey: "8d102f9ff8a986e4a1d272cec1d9477a2efb8a474d532761506d77e210b68603",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae", //LifiDiamond
        contract: acrossFacetInterface,
        eventHandlers: {
          [LIFI_TRANSFER_STARTED]: lifiTransferStartedEvent,
          [LIFI_SWAPPED_GENERIC]: lifiSwappedGenericEvent,
        },
        startBlock: 15788692,
      },
    ],
  },
};

export default lifiAdapter;
