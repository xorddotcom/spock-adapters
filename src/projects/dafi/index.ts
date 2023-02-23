import { tokenBalanceUSD } from "../../utils/sumBalances";
import { STAKEDEventObject, UNSTAKEDEventObject } from "./types/Staking";
import { STAKE, UNSTAKE, staking, DAFI, Label } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function stakeEvent(event: types.Event<STAKEDEventObject>) {
  const dafiToken = DAFI[event.chain];
  if (dafiToken) {
    const block = await Promise.resolve(event.block);
    const dafiAmount = await tokenBalanceUSD(
      { token: dafiToken, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.STAKE,
      value: parseFloat(dafiAmount.toString()),
      user: event.params.user,
    });
  }
}

export async function unstakeEvent(event: types.Event<UNSTAKEDEventObject>) {
  const dafiToken = DAFI[event.chain];
  if (dafiToken) {
    const block = await Promise.resolve(event.block);
    const dafiAmount = await tokenBalanceUSD(
      { token: dafiToken, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.UNSTAKE,
      value: parseFloat(dafiAmount.toString()),
      user: event.params.user,
    });
  }
}

const dafiAdapter: types.Adapter = {
  appKey: "6b419b19aa25a652705861c5ced37fff5cfb4d226b3dabe7dfb6316b07deb85f",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x10c53debec28cab72e93bb9ac760a64dad07229b",
        contract: staking,
        eventHandlers: {
          [STAKE]: stakeEvent,
          [UNSTAKE]: unstakeEvent,
        },
        startBlock: 12791982,
      },
    ],
    [constants.Chain.POLYGON]: [
      {
        address: "0x10c53debec28cab72e93bb9ac760a64dad07229b",
        contract: staking,
        eventHandlers: {
          [STAKE]: stakeEvent,
          [UNSTAKE]: unstakeEvent,
        },
        startBlock: 21121034,
      },
    ],
    [constants.Chain.BSC]: [
      {
        address: "0x6a4b3fe069b69c0a2094ce711b0cdca9c9c844bf",
        contract: staking,
        eventHandlers: {
          [STAKE]: stakeEvent,
          [UNSTAKE]: unstakeEvent,
        },
        // startBlock: 15161796, //multicall limitation
        startBlock: 16627877,
      },
    ],
  },
};

export default dafiAdapter;
