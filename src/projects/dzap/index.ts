import { WRAPPED_NATIVE_TOKEN } from "../../constants/tokens";
import { Erc20, Erc20__factory } from "../../contracts/types";
import { sumBalancesUSD, tokenBalanceUSD, USDBalanceInput } from "../../utils/sumBalances";
import { DCA } from "./types";
import { TokensSwappedEventObject } from "./types/Aggregator";
import { CreatedEventObject, WithdrawnEventObject, ModifiedEventObject } from "./types/DCA";
import {
  aggregatorInterface,
  TOKENS_SWAPPED,
  CREATE_POSITION,
  WITHDRAW_POSITION,
  MODIFY_POSITION,
  Label,
  E_ADDRESS,
  dcaInterface,
} from "./utils";
import { BigNumber } from "@ethersproject/bignumber";
import { abi, constants, types, utils } from "@spockanalytics/base";

export async function tokensSwappedEvent(event: types.Event<TokensSwappedEventObject>) {
  const srcTokens = event.params.swapInfo.reduce<Record<string, BigNumber>>((accum, swap) => {
    const address = [constants.ZERO_ADDRESS, E_ADDRESS].includes(swap.srcToken) //contract is using zero and 0xee.. for native
      ? WRAPPED_NATIVE_TOKEN[event.chain]
      : swap.srcToken;

    accum[address] = (accum[address] ?? BigNumber.from(0)).add(swap.amount);
    return accum;
  }, {});

  const [block, tokenDecimals] = await Promise.all([
    event.block,
    abi.Multicall.multipleContractSingleData<Erc20>({
      address: Object.keys(srcTokens),
      chain: event.chain,
      contractInterface: Erc20__factory.createInterface(),
      fragment: "decimals",
    }),
  ]);

  const tokenInputs = Object.entries(srcTokens).reduce<USDBalanceInput[]>((accum, [address, balance], index) => {
    accum = [
      ...accum,
      {
        token: { address, decimals: tokenDecimals[index].output },
        balance,
      },
    ];
    return accum;
  }, []);

  const amount = await sumBalancesUSD(tokenInputs, event.chain, block.timestamp);

  let label: string = Label.TOKENS_SWAPPED;
  label +=
    event.params.swapInfo.length === 1
      ? "(Single-Swap)"
      : Object.keys(srcTokens).length === 1
      ? "(Batch-Buy)"
      : "(Batch-Sell)";

  return utils.ProtocolValue.contribution({
    label,
    user: event.params.sender,
    value: parseFloat(amount.toString()),
  });
}

export async function createPositionEvent(event: types.Event<CreatedEventObject>) {
  const block = await Promise.resolve(event.block);

  const positionDetail = (
    await abi.Multicall.singleCall<DCA>({
      address: event.address,
      chain: event.chain,
      contractInterface: dcaInterface,
      fragment: "getPositionDetails",
      blockNumber: block.number,
      callInput: [event.params.positionId],
    })
  ).output;

  const amount = await tokenBalanceUSD(
    { token: positionDetail.from, balance: positionDetail.unswapped },
    event.chain,
    block.timestamp,
  );

  return utils.ProtocolValue.contribution({
    label: Label.CREATE_POSITION,
    user: event.params.user,
    value: parseFloat(amount.toString()),
  });
}

export async function withdrawPositionEvent(event: types.Event<WithdrawnEventObject>) {
  const block = await Promise.resolve(event.block);

  const positionDetail = (
    await abi.Multicall.singleCall<DCA>({
      address: event.address,
      chain: event.chain,
      contractInterface: dcaInterface,
      fragment: "getPositionDetails",
      blockNumber: block.number,
      callInput: [event.params.positionId],
    })
  ).output;

  const amount = await tokenBalanceUSD(
    { token: positionDetail.to, balance: event.params.swapped },
    event.chain,
    block.timestamp,
  );

  return utils.ProtocolValue.extraction({
    label: Label.WITHDRAW_POSITION,
    user: event.params.user,
    value: parseFloat(amount.toString()),
  });
}

export async function modifyPositionEvent(event: types.Event<ModifiedEventObject>) {
  const [block, transaction] = await Promise.all([event.block, event.transaction]);

  const { amount_, isIncrease_ } = dcaInterface.decodeFunctionData("modifyPosition", transaction.data);

  //skip position parameter's modification
  if (amount_.gt(0)) {
    const positionDetail = (
      await abi.Multicall.singleCall<DCA>({
        address: event.address,
        chain: event.chain,
        contractInterface: dcaInterface,
        fragment: "getPositionDetails",
        blockNumber: block.number,
        callInput: [event.params.positionId],
      })
    ).output;

    const amountUSD = await tokenBalanceUSD(
      { token: positionDetail.from, balance: amount_ },
      event.chain,
      block.timestamp,
    );

    return isIncrease_
      ? utils.ProtocolValue.contribution({
          label: Label.MODIFY_POSITION + "(Increase)",
          user: event.params.user,
          value: parseFloat(amountUSD.toString()),
        })
      : utils.ProtocolValue.extraction({
          label: Label.MODIFY_POSITION + "(Decrease)",
          user: event.params.user,
          value: parseFloat(amountUSD.toString()),
        });
  }
}

const dzapAdapter: types.Adapter = {
  appKey: "e2cb630dc30f69a36a8cd5cbe0b3bd3c34556190879823725def6b2efc9ec832",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        address: "0x3af3cc4930ef88f4afe0b695ac95c230e1a108ec",
        contract: aggregatorInterface,
        eventHandlers: {
          [TOKENS_SWAPPED]: tokensSwappedEvent,
        },
        startBlock: 15783628,
      },
    ],
    [constants.Chain.POLYGON]: [
      {
        address: "0x3af3cc4930ef88f4afe0b695ac95c230e1a108ec",
        contract: aggregatorInterface,
        eventHandlers: {
          [TOKENS_SWAPPED]: tokensSwappedEvent,
        },
        startBlock: 34544200,
      },
      {
        address: "0x603b31bbe692adcd522e280019f72b7919d6167c",
        contract: dcaInterface,
        eventHandlers: {
          [CREATE_POSITION]: createPositionEvent,
          [WITHDRAW_POSITION]: withdrawPositionEvent,
          [MODIFY_POSITION]: modifyPositionEvent,
        },
        startBlock: 39538869,
      },
    ],
  },
};

export default dzapAdapter;
