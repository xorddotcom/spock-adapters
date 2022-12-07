import { BurnEventObject, MintEventObject } from "./types/Pool";
import { pool, BURN, MINT } from "./utils";
import { constants, types } from "@spockanalytics/base";

async function burnEvent(event: types.Event<BurnEventObject>) {
  // console.log("uniswap burnEvent => ", event);
}

async function mintEvent(event: types.Event<MintEventObject>) {
  // console.log("uniswap mintEvent => ", event);
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
        startBlock: 12369621,
      },
    ],
  },
};

export default uniswapAdapter;
