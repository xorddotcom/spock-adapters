import { sumBalancesUSD } from "../../utils/sumBalances";
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
  appKey: "2dc573cf9a7b7f866bbc8e8af187bef148a23f3e56e04f99f53cd09ee2798f7a",
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
};

export default bullionfxAdapter;
