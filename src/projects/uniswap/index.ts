import { Chain } from "../../constants/chains";
import { Adapter } from "../../types/adapter";
import { Event } from "../../types/event";
import { Pool__factory } from "./types";
import { BurnEventObject, MintEventObject } from "./types/Pool";

const pool = Pool__factory.createInterface();

const BURN = pool.getEventTopic(pool.getEvent("Burn"));
const MINT = pool.getEventTopic(pool.getEvent("Mint"));

async function burnEvent(event: Event<BurnEventObject>) {}

async function mintEvent(event: Event<MintEventObject>) {}

const uniswapAdapter: Adapter = {
  appKey: "abcd",
  transformers: {
    [Chain.ETHEREUM]: [
      {
        contract: pool,
        eventHandlers: {
          [BURN]: burnEvent,
          [MINT]: mintEvent,
        },
        startBlock: 12369621,
      },
    ],
  },
};

export default uniswapAdapter;
