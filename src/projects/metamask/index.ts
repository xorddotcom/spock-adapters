import { tokenBalanceUSD } from "../../utils/sumBalances";
import { SwapEventObject } from "./types/MetaSwap";
import { Label, MetaSwapInterface, NativeToken, SWAP } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function swapEvent(event: types.Event<SwapEventObject>) {
  const tx = await Promise.resolve(event.transaction);

  const { amount } = MetaSwapInterface.decodeFunctionData("swap", tx.data);
  let { tokenFrom } = MetaSwapInterface.decodeFunctionData("swap", tx.data);

  if (tokenFrom && amount) {
    if (tokenFrom === constants.ZERO_ADDRESS) tokenFrom = NativeToken[event.chain];

    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD({ token: tokenFrom, balance: amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.SWAP,
      value: parseFloat(assetValue.toString()),
      user: tx.from,
    });
  }
}

const MetamaskAdapter: types.Adapter = {
  appKey: "f6f171d44b0eda21a845383f949db87a7ed72f9397ae2043fb2244e926ea3258",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: MetaSwapInterface,
        address: "0x881d40237659c251811cec9c364ef91dc08d300c",
        eventHandlers: {
          [SWAP]: swapEvent,
        },
        startBlock: 11041725,
      },
    ],
    [constants.Chain.POLYGON]: [
      {
        contract: MetaSwapInterface,
        address: "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
        eventHandlers: {
          [SWAP]: swapEvent,
        },
        startBlock: 16792570,
      },
    ],
    [constants.Chain.BSC]: [
      {
        contract: MetaSwapInterface,
        address: "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
        eventHandlers: {
          [SWAP]: swapEvent,
        },
        startBlock: 5387949,
      },
    ],
  },
};
export default MetamaskAdapter;
