import { stakingTvl } from "../../utils/staking";
import { sumBalancesUSD, tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { BurnEventObject, MintEventObject } from "./types/ElkPair";
import { StakedEventObject, WithdrawnEventObject } from "./types/Staking";
import { BURN, MINT, STAKE, UNSTAKE, ELK_TOKEN, elkPair, staking, pairAddresses, elk_Pair, Label } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function mintEvent(event: types.Event<MintEventObject>) {
  const pair = await elk_Pair.getPool(event.address, event.chain);
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
  const pair = await elk_Pair.getPool(event.address, event.chain);
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

export async function stakeEvent(event: types.Event<StakedEventObject>) {
  const block = await Promise.resolve(event.block);
  const elkToken = ELK_TOKEN[event.chain];

  if (elkToken && event.params.amount) {
    const elkAmount = await tokenBalanceUSD(
      { token: elkToken, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.STAKE,
      value: parseFloat(elkAmount.toString()),
      user: event.params.user,
    });
  }
}

export async function withdrawnEvent(event: types.Event<WithdrawnEventObject>) {
  const block = await Promise.resolve(event.block);
  const elkToken = ELK_TOKEN[event.chain];

  if (elkToken && event.params.amount) {
    const elkAmount = await tokenBalanceUSD(
      { token: elkToken, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.extraction({
      label: Label.UNSTAKE,
      value: parseFloat(elkAmount.toString()),
      user: event.params.user,
    });
  }
}

const elknetAdapter: types.Adapter = {
  appKey: "f964f38e8bba1ea6ce41d371c17c2086f709b341b6c17f73ae22cbaf80162f53",
  transformers: {
    [constants.Chain.POLYGON]: [
      {
        contract: elkPair,
        getAddresses: pairAddresses,
        eventHandlers: {
          [MINT]: mintEvent,
          [BURN]: burnEvent,
        },
        startBlock: 22757610,
      },
      {
        contract: staking,
        address: "0x57a1ce7686f3b2ab61f5191c76361f985b57e0fa",
        eventHandlers: {
          [STAKE]: stakeEvent,
          [UNSTAKE]: withdrawnEvent,
        },
        startBlock: 26971152,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.POLYGON]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 22757610,
      },
      {
        category: types.TVL_Category.STAKING,
        extractor: stakingTvl(
          "0x57a1ce7686f3b2ab61f5191c76361f985b57e0fa",
          ELK_TOKEN[constants.Chain.POLYGON]?.address ?? "",
        ),
        startBlock: 26971152,
      },
    ],
  },
};

export default elknetAdapter;
