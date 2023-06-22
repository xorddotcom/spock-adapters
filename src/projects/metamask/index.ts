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
  if (event.params.sender.toLowerCase() === MetamaskStakingAggregator[event.chain]) {
    const tx = await Promise.resolve(event.transaction);
    const block = await Promise.resolve(event.block);

    const token = NativeToken[event.chain];

    const assetValue = await tokenBalanceUSD(
      { token: token, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.STAKE_LIDO,
      value: parseFloat(assetValue.toString()),
      user: tx.from,
    });
  }
}

export async function stakeRocketEvent(event: types.Event<DepositReceivedEventObject>) {
  if (event.params.from.toLowerCase() === MetamaskStakingAggregator[event.chain]) {
    const tx = await Promise.resolve(event.transaction);
    const block = await Promise.resolve(event.block);

    const token = NativeToken[event.chain];

    const assetValue = await tokenBalanceUSD(
      { token: token, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.STAKE_ROCKET,
      value: parseFloat(assetValue.toString()),
      user: tx.from,
    });
  }
}

export async function swapEvent(event: types.Event<SwapEventObject>) {
  const tx = await Promise.resolve(event.transaction);

  const { amount } = MetaSwapInterface.decodeFunctionData("swap", tx.data);
  let { tokenFrom } = MetaSwapInterface.decodeFunctionData("swap", tx.data);

  if (tokenFrom && amount) {
    if (tokenFrom === constants.ZERO_ADDRESS) tokenFrom = NativeToken[event.chain];

    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD({ token: tokenFrom, balance: amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.SWAP,
      value: parseFloat(assetValue.toString()),
      user: tx.from,
    });
  }
}

const MetamaskAdapter: types.Adapter = {
  appKey: "f6f171d44b0eda21a845383f949db87a7ed72f9397ae2043fb2244e926ea3258",
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
