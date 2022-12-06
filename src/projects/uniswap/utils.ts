import { Pool__factory } from "./types";

export const pool = Pool__factory.createInterface();

export const BURN = pool.getEventTopic(pool.getEvent("Burn"));
export const MINT = pool.getEventTopic(pool.getEvent("Mint"));
