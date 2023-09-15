import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { DepositEventObject, WithdrawEventObject, MintEventObject, BurnEventObject } from "./types/ZeroLiquid";
import { Label, DEPOSIT, WITHDRAW, MINT, BURN, wrappedETH, zeroLiquidInterface, PROXY_ZERO_LIQUID } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  if (event.params.yieldToken) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD(
      { token: event.params.yieldToken, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(amount.toString()),
      user: event.params.sender,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  if (event.params.yieldToken) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD(
      { token: event.params.yieldToken, balance: event.params.shares },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: parseFloat(amount.toString()),
      user: event.params.owner,
    });
  }
}

export async function mintEvent(event: types.Event<MintEventObject>) {
  const block = await Promise.resolve(event.block);
  //using wrappedETH instead of zETH becuase zETH pricing are not able right now, will replace it in future
  const amount = await tokenBalanceUSD(
    { token: wrappedETH, balance: event.params.amount },
    event.chain,
    block.timestamp,
  );
  return utils.ProtocolValue.contribution({
    label: Label.MINT,
    value: parseFloat(amount.toString()),
    user: event.params.owner,
  });
}

export async function burnEvent(event: types.Event<BurnEventObject>) {
  const block = await Promise.resolve(event.block);
  const amount = await tokenBalanceUSD(
    { token: wrappedETH, balance: event.params.amount },
    event.chain,
    block.timestamp,
  );
  return utils.ProtocolValue.extraction({
    label: Label.BURN,
    value: parseFloat(amount.toString()),
    user: event.params.sender,
  });
}

const zeroLiquidAdapter: types.Adapter = {
  appKey: "8cb1e30476d21977b8d21688dcda9050d60950d93cc06f64f7c1de5a600a875c",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: PROXY_ZERO_LIQUID,
        contract: zeroLiquidInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
          [BURN]: burnEvent,
          [MINT]: mintEvent,
        },
        startBlock: 17986759,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 17986759,
      },
    ],
  },
};

export default zeroLiquidAdapter;
