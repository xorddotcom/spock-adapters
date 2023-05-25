import { RubicTransferStartedEventObject } from "./types/BridgeFacet";
import { Label, RUBIC_TRANSFER_STARTED, bridgeInterface } from "./utils";
import { constants, types, utils, abi } from "@spockanalytics/base";
import { tokenBalanceUSD } from "utils/sumBalances";

export async function swapEvent(event: types.Event<RubicTransferStartedEventObject>) {
  //TODO change the wallet address
  const walletAddress = "some wallet";
  const fromToken = await new abi.Token(event.params.bridgeData.sendingAssetId, event.chain).metaData();

  (await event.transaction).from;
  if (fromToken) {
    const block = await Promise.resolve(event.block);

    const amount = await tokenBalanceUSD(
      { token: fromToken, balance: event.params.bridgeData.minAmount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.SWAP,
      value: parseFloat(amount.toString()),
      user: walletAddress,
    });
  }
}

const rubicAdapter: types.Adapter = {
  //TODO change the appKey
  appKey: "8b25dbb191f57942bd8c8cf470ae34b845b2c0a9c84daed81abd03f917e46c23",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: bridgeInterface,
        eventHandlers: {
          [RUBIC_TRANSFER_STARTED]: swapEvent,
        },
        startBlock: 16422125,
      },
    ],
  },
};

export default rubicAdapter;
