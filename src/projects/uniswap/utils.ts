import { Pool, PoolInfoExtracter } from "../../utils/pool";
import { Pool__factory, Pool as UniswapV3Pool } from "./types";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const pool = Pool__factory.createInterface();

// contract events
export const BURN = pool.getEventTopic(pool.getEvent("Burn"));
export const MINT = pool.getEventTopic(pool.getEvent("Mint"));

// helper functions
async function poolInfo(address: string, chain: constants.Chain): ReturnType<PoolInfoExtracter> {
  const calls = [
    new abi.Call<UniswapV3Pool>({ address, contractInterface: pool, fragment: "token0" }),
    new abi.Call<UniswapV3Pool>({ address, contractInterface: pool, fragment: "token1" }),
  ];
  const result = await abi.Multicall.execute(chain, calls);

  return { token0: result[0][0], token1: result[1][0] };
}

export const uniswapV3Pool = new Pool(poolInfo);
