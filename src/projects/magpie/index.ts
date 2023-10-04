import { tokenBalanceUSD } from "../../utils/sumBalances";
import { SwapEventObject, SwapInEventObject, SwapOutEventObject } from "./types/AggregatorFacet";
import { SWAP, SWAP_IN, SWAP_OUT, Label, WETH, aggregatorFacetInterface } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function handleSwap(event: types.Event<SwapEventObject>) {
  const block = await Promise.resolve(event.block);

  const token = utils.isSameAddress(event.params.fromAssetAddress, constants.ZERO_ADDRESS)
    ? WETH
    : event.params.fromAssetAddress;

  const amount = await tokenBalanceUSD({ token, balance: event.params.amountIn }, event.chain, block.timestamp);

  return utils.ProtocolValue.contribution({
    label: Label.SWAP,
    value: amount.toNumber(),
    user: event.params.fromAddress,
  });
}

export async function handleSwapIn(event: types.Event<SwapInEventObject>) {
  const block = await Promise.resolve(event.block);

  const token = utils.isSameAddress(event.params.fromAssetAddress, constants.ZERO_ADDRESS)
    ? WETH
    : event.params.fromAssetAddress;

  const amount = await tokenBalanceUSD({ token, balance: event.params.amountIn }, event.chain, block.timestamp);

  return utils.ProtocolValue.contribution({
    label: Label.SWAP_IN,
    value: amount.toNumber(),
    user: event.params.fromAddress,
  });
}

export async function handleSwapOut(event: types.Event<SwapOutEventObject>) {
  const block = await Promise.resolve(event.block);

  const token = utils.isSameAddress(event.params.toAssetAddress, constants.ZERO_ADDRESS)
    ? WETH
    : event.params.toAssetAddress;

  const amount = await tokenBalanceUSD({ token, balance: event.params.amountOut }, event.chain, block.timestamp);

  return utils.ProtocolValue.contribution({
    label: Label.SWAP_OUT,
    value: amount.toNumber(),
    user: event.params.toAddress,
  });
}

const MagpieAdapter: types.Adapter = {
  appKey: "fd7c01b20fec78254b138913659bdd32f599408516d1ed313979ea92241fa3f2",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: aggregatorFacetInterface,
        address: "0xba7bac71a8ee550d89b827fe6d67bc3dca07b104",
        eventHandlers: {
          [SWAP]: handleSwap,
          [SWAP_IN]: handleSwapIn,
          [SWAP_OUT]: handleSwapOut,
        },
        startBlock: 17292909,
      },
    ],
  },
};

export default MagpieAdapter;
