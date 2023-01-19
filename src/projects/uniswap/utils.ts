import { Pool, uniswapV2_Pair } from "../../utils/pool";
import { Pool__factory, Pool as UniswapV3Pool } from "./types";

// contract interfaces
export const pool = Pool__factory.createInterface();

// contract events
export const MINT = pool.getEventTopic(pool.getEvent("Mint"));
export const BURN = pool.getEventTopic(pool.getEvent("Burn"));

// helper functions
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

export const uniswapV3Pool = new Pool(uniswapV2_Pair<UniswapV3Pool>(pool));
