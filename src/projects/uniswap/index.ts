import { sumBalancesUSD } from "../../utils/sumBalances";
import { BurnEventObject, MintEventObject } from "./types/Pool";
import { pool, BURN, MINT, uniswapV3Pool, Label } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function mintEvent(event: types.Event<MintEventObject>) {
  const pool = await uniswapV3Pool.getPool(event.address, event.chain);
  if (pool) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token0, balance: event.params.amount0 },
        { token: pool.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(totalSum.toString()),
      user: transaction.from,
    });
  }
}

export async function burnEvent(event: types.Event<BurnEventObject>) {
  const pool = await uniswapV3Pool.getPool(event.address, event.chain);
  if (pool) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token0, balance: event.params.amount0 },
        { token: pool.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: parseFloat(totalSum.toString()),
      user: transaction.from,
    });
  }
}

const uniswapAdapter: types.Adapter = {
  appKey: "70dbe55c4987d9ac9d84605d9edb8e6781bae2d631d649e176656e6bd3642fd9",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: pool,
        eventHandlers: {
          [MINT]: mintEvent,
          [BURN]: burnEvent,
        },
        startBlock: 12369621,
        // startBlock: 15785296,
      },
    ],
  },
};

export default uniswapAdapter;
