import { tokenBalanceUSD } from "../../utils/sumBalances";
import { DepositEventObject, ClaimEventObject } from "./types/Bridge";
import { Label, DEPOSIT, CLAIM, HELLO_TOKEN, bridgeInterface } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const token = HELLO_TOKEN[event.chain];

  if (token) {
    const block = await Promise.resolve(event.block);

    const amount = await tokenBalanceUSD({ token, balance: event.params.amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(amount.toString()),
      user: event.params.sender,
    });
  }
}

export async function claimEvent(event: types.Event<ClaimEventObject>) {
  const token = HELLO_TOKEN[event.chain];

  if (token) {
    const block = await Promise.resolve(event.block);

    const amount = await tokenBalanceUSD(
      { token, balance: event.params.totalDepositedOnOtherChain },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.CLAIM,
      value: parseFloat(amount.toString()),
      user: event.params.sender,
    });
  }
}

const helloLabsAdapter: types.Adapter = {
  appKey: "6435704f70f4d822062cef87ee4c7b1c324a2eb436809e9d4f76ed72823d440f",
  transformers: {
    [constants.Chain.BSC]: [
      {
        address: "0x052443fdafd5ad61c960b35e6c5dd45d02864f9d",
        contract: bridgeInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [CLAIM]: claimEvent,
        },
        startBlock: 31111502,
      },
    ],
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x9274b07a2daec5dbb6efa61c28e49c1bc8f79abd",
        contract: bridgeInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [CLAIM]: claimEvent,
        },
        startBlock: 17979369,
      },
    ],
  },
};

export default helloLabsAdapter;
