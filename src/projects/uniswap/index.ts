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
  appKey: "70dbe55c4987d9ac9d84605d9edb8e6781bae2d631d649e176656e6bd3642fd9",
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
