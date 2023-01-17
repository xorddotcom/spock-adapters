import { sumBalancesUSD } from "../../utils/sumBalances";
import { BurnEventObject, MintEventObject } from "./types/BullPair";
import { BURN, MINT, bullPair, pairAddresses, bull_Pair, Label } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function mintEvent(event: types.Event<MintEventObject>) {
  const pair = await bull_Pair.getPool(event.address, event.chain);
  if (pair) {
    const block = await Promise.resolve(event.block);
    const totalSum = await sumBalancesUSD(
      [
        { token: pair.token0, balance: event.params.amount0 },
        { token: pair.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

export async function burnEvent(event: types.Event<BurnEventObject>) {
  const pair = await bull_Pair.getPool(event.address, event.chain);
  if (pair) {
    const block = await Promise.resolve(event.block);
    const totalSum = await sumBalancesUSD(
      [
        { token: pair.token0, balance: event.params.amount0 },
        { token: pair.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

const bullionfxAdapter: types.Adapter = {
  appKey: "",
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
