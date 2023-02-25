import { sumBalancesUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { BurnEventObject, MintEventObject } from "./types/BullPair";
import { BURN, MINT, bullPair, pairAddresses, bull_Pair, Label } from "./utils";
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
