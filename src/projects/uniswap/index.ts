import { sumBalancesUSD } from "../../utils/sumBalances";
import { BurnEventObject, MintEventObject } from "./types/Pool";
import { pool, BURN, MINT, uniswapV3Pool } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

async function burnEvent(event: types.Event<BurnEventObject>) {
  const poolAddress = event.address;
  const pool = await uniswapV3Pool.getPool(poolAddress, event.chain);
  if (pool) {
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token0, balance: event.params.amount0 },
        { token: pool.token1, balance: event.params.amount1 },
      ],
      event.chain,
      event.block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: "Withdraw",
      value: parseFloat(totalSum.toString()),
      user: event.transaction.from,
    });
  }
}

export async function mintEvent(event: types.Event<MintEventObject>) {
  const poolAddress = event.address;
  const pool = await uniswapV3Pool.getPool(poolAddress, event.chain);
  if (pool) {
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token0, balance: event.params.amount0 },
        { token: pool.token1, balance: event.params.amount1 },
      ],
      event.chain,
      event.block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: "Deposit",
      value: parseFloat(totalSum.toString()),
      user: event.transaction.from,
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
          [BURN]: burnEvent,
          [MINT]: mintEvent,
        },
        // startBlock: 12369621,
        startBlock: 15785296,
      },
    ],
  },
};

export default uniswapAdapter;
