import { sumBalancesUSD, tokenBalanceUSD, USDBalanceInput } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { BurnEventObject, MintEventObject, SwapEventObject } from "./types/BullPair";
import { BURN, MINT, SWAP, bullPair, pairAddresses, bull_Pair, Label, isNativeToken } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function mintEvent(event: types.Event<MintEventObject>) {
  const pair = await bull_Pair.getPool(event.address, event.chain);
  if (pair) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const totalSum = await sumBalancesUSD(
      [
        { token: pair.token0, balance: event.params.amount0 },
        { token: pair.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.ADD_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: transaction.from,
    });
  }
}

export async function burnEvent(event: types.Event<BurnEventObject>) {
  const pair = await bull_Pair.getPool(event.address, event.chain);
  if (pair) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const totalSum = await sumBalancesUSD(
      [
        { token: pair.token0, balance: event.params.amount0 },
        { token: pair.token1, balance: event.params.amount1 },
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

//TODO: support more indept data tracking for events like swap,
//because it is not simply classified into contribution or extraction
export async function swapEvent(event: types.Event<SwapEventObject>) {
  const pair = await bull_Pair.getPool(event.address, event.chain);
  if (pair) {
    const block = await Promise.resolve(event.block);

    const { amount0In, amount1In, amount0Out, amount1Out } = event.params;

    const tokenIn = amount0In.gt(0) ? pair.token0 : pair.token1;
    const tokenOut = amount0Out.gt(0) ? pair.token0 : pair.token1;
    const amountIn = amount0In.gt(0) ? amount0In : amount1In;
    const amountOut = amount0Out.gt(0) ? amount0Out : amount1Out;

    let balanceInput: USDBalanceInput = { token: tokenIn, balance: amountIn };
    let label: string = Label.SWAP;

    if (isNativeToken(tokenIn.address)) {
      balanceInput = {
        token: tokenIn,
        balance: amountIn,
      };
      label = `${Label.SELL} ${tokenIn.symbol}`;
    } else if (isNativeToken(tokenOut.address)) {
      balanceInput = {
        token: tokenOut,
        balance: amountOut,
      };
      label = `${Label.BUY} ${tokenOut.symbol}`;
    }

    const amountUSD = await tokenBalanceUSD(balanceInput, event.chain, block.timestamp);

    if (isNativeToken(tokenIn.address)) {
      return utils.ProtocolValue.extraction({
        label,
        value: parseFloat(amountUSD.toString()),
        user: event.params.to,
      });
    } else {
      return utils.ProtocolValue.contribution({
        label,
        value: parseFloat(amountUSD.toString()),
        user: event.params.to,
      });
    }
  }
}

const bullionfxAdapter: types.Adapter = {
  appKey: "11c528680d8e5a5039b30e8bd9ba8ea67a085fea2a39946a552b6e6fa2c6621b",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: bullPair,
        getAddresses: pairAddresses,
        eventHandlers: {
          [MINT]: mintEvent,
          [BURN]: burnEvent,
          [SWAP]: swapEvent,
        },
        startBlock: 16326700,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 16326700,
      },
    ],
  },
};

export default bullionfxAdapter;
