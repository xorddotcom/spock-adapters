import { tokenBalanceUSD } from "../../utils/sumBalances";
import { DepositEventObject, WithdrawEventObject, MintEventObject, BurnEventObject } from "./types/ZeroLiquid";
import { Label, DEPOSIT, WITHDRAW, MINT, BURN, zETH, zeroLiquidInterface } from "./utils";
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
  const amount = await tokenBalanceUSD({ token: zETH, balance: event.params.amount }, event.chain, block.timestamp);
  return utils.ProtocolValue.contribution({
    label: Label.MINT,
    value: parseFloat(amount.toString()),
    user: event.params.owner,
  });
}

export async function burnEvent(event: types.Event<BurnEventObject>) {
  const block = await Promise.resolve(event.block);
  const amount = await tokenBalanceUSD({ token: zETH, balance: event.params.amount }, event.chain, block.timestamp);
  return utils.ProtocolValue.contribution({
    label: Label.MINT,
    value: parseFloat(amount.toString()),
    user: event.params.sender,
  });
}

const zeroLiquidAdapter: types.Adapter = {
  appKey: "8cb1e30476d21977b8d21688dcda9050d60950d93cc06f64f7c1de5a600a875c",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x0246e28c6b161764492e54cbf852e28a4da2d672", //Poxy_Zero_Liquid
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
};

export default zeroLiquidAdapter;
