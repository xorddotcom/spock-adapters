import { tokenBalanceUSD } from "../../utils/sumBalances";
import { SubmittedEventObject } from "./types/LidoEthStaking";
import { SwapEventObject } from "./types/MetaSwap";
import { DepositReceivedEventObject } from "./types/RockedEthStaking";
import {
  MetamaskStakingAggregator,
  LidoEthStakingInterface,
  RockedEthStakingInterface,
  MetaSwapInterface,
  STAKE_LIDO,
  STAKE_ROCKET,
  NativeToken,
  Label,
} from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function stakeLidoEvent(event: types.Event<SubmittedEventObject>) {
  if (utils.isSameAddress(event.params.sender, MetamaskStakingAggregator[event.chain])) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);

    const token = NativeToken[event.chain] ?? "";

    const assetValue = await tokenBalanceUSD(
      { token: token, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.STAKE_LIDO,
      value: parseFloat(assetValue.toString()),
      user: transaction.from,
    });
  }
}

export async function stakeRocketEvent(event: types.Event<DepositReceivedEventObject>) {
  if (utils.isSameAddress(event.params.from, MetamaskStakingAggregator[event.chain])) {
    const [block, transaction] = await Promise.all([event.block, event.transaction]);

    const token = NativeToken[event.chain] ?? "";

    const assetValue = await tokenBalanceUSD(
      { token: token, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.STAKE_ROCKET,
      value: parseFloat(assetValue.toString()),
      user: transaction.from,
    });
  }
}

export async function swapEvent(event: types.Event<SwapEventObject>) {
  const transaction = await Promise.resolve(event.transaction);

  const { amount } = MetaSwapInterface.decodeFunctionData("swap", transaction.data);
  let { tokenFrom } = MetaSwapInterface.decodeFunctionData("swap", transaction.data);

  if (tokenFrom && amount) {
    if (tokenFrom === constants.ZERO_ADDRESS) tokenFrom = NativeToken[event.chain];

    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD({ token: tokenFrom, balance: amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.SWAP,
      value: parseFloat(assetValue.toString()),
      user: transaction.from,
    });
  }
}

const MetamaskAdapter: types.Adapter = {
  appKey: "73c2f54b80de6c98f999b9a351b2a66add2c9e51c338351926405dd0bd5e9a08",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: LidoEthStakingInterface,
        address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        eventHandlers: {
          [STAKE_LIDO]: stakeLidoEvent,
        },
        startBlock: 16528964,
      },
      {
        contract: RockedEthStakingInterface,
        address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        eventHandlers: {
          [STAKE_ROCKET]: stakeRocketEvent,
        },
        startBlock: 16528964,
      },
      // {
      //   contract: MetaSwapInterface,
      //   address: "0x881d40237659c251811cec9c364ef91dc08d300c",
      //   eventHandlers: {
      //     [SWAP]: swapEvent,
      //   },
      //   startBlock: 17522372,
      // },
    ],
    // [constants.Chain.POLYGON]: [
    //   {
    //     contract: MetaSwapInterface,
    //     address: "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
    //     eventHandlers: {
    //       [SWAP]: swapEvent,
    //     },
    //     startBlock: 16792570,
    //   },
    // ],
    // [constants.Chain.BSC]: [
    //   {
    //     contract: MetaSwapInterface,
    //     address: "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
    //     eventHandlers: {
    //       [SWAP]: swapEvent,
    //     },
    //     startBlock: 5387949,
    //   },
    // ],
  },
};
export default MetamaskAdapter;
