import { tokenTotalSupply } from "../../utils/erc20";
import { tokenBalanceUSD, sumBalancesUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { TenderSwap } from "./types";
import { FarmEventObject, UnfarmEventObject } from "./types/TenderFarm";
import { AddLiquidityEventObject, RemoveLiquidityEventObject } from "./types/TenderSwap";
import { DepositEventObject, WithdrawEventObject } from "./types/Tenderizer";
import {
  getSteak,
  DEPOSIT,
  WITHDRAW,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  FARM,
  UNFARM,
  Label,
  tenderSwapPool,
  tenderizerInterface,
  tenderSwapInterface,
  tenderFarmInterface,
  farmInfo,
} from "./utils";
import { abi, constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const steak = await getSteak(event.address, event.chain);
  if (steak) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: steak, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(assetValue.toString()),
      user: event.params.from,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const steak = await getSteak(event.address, event.chain);
  if (steak) {
    const block = await Promise.resolve(event.block);
    const assetValue = await tokenBalanceUSD(
      { token: steak, balance: event.params.amount },
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: parseFloat(assetValue.toString()),
      user: event.params.from,
    });
  }
}

export async function addLiquidityEvent(event: types.Event<AddLiquidityEventObject>) {
  const pool = await tenderSwapPool.getPool(event.address, event.chain);
  if (pool) {
    const block = await Promise.resolve(event.block);
    //token0 value is derived from token1 due to 1:1 ratio
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token1, balance: event.params.tokenAmounts[0] },
        { token: pool.token1, balance: event.params.tokenAmounts[1] },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.contribution({
      label: Label.ADD_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: event.params.provider,
    });
  }
}

export async function removeLiquidityEvent(event: types.Event<RemoveLiquidityEventObject>) {
  const pool = await tenderSwapPool.getPool(event.address, event.chain);
  if (pool) {
    const block = await Promise.resolve(event.block);
    //token0 value is derived from token1 due to 1:1 ratio
    const totalSum = await sumBalancesUSD(
      [
        { token: pool.token1, balance: event.params.tokenAmounts[0] },
        { token: pool.token1, balance: event.params.tokenAmounts[1] },
      ],
      event.chain,
      block.timestamp,
    );
    return utils.ProtocolValue.extraction({
      label: Label.REMOVE_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: event.params.provider,
    });
  }
}

export async function farmEvent(event: types.Event<FarmEventObject>) {
  const farm = await farmInfo(event.address, event.chain);

  if (farm) {
    const [block, totalSupply, balances] = await Promise.all([
      event.block,
      //totalSupply of lp token, which this farming vault supports
      tokenTotalSupply(farm.swapToken, event.chain),
      //get underlying total token balances for the lp token
      abi.Multicall.execute({
        chain: event.chain,
        calls: [
          new abi.Call<TenderSwap>({
            address: farm.tenderSwap,
            contractInterface: tenderSwapInterface,
            fragment: "getToken0Balance",
          }),
          new abi.Call<TenderSwap>({
            address: farm.tenderSwap,
            contractInterface: tenderSwapInterface,
            fragment: "getToken1Balance",
          }),
        ],
      }),
    ]);

    //calculate share w.r.t the amount of lp user depositing and lp totalSupply
    const userShare = utils.BN_Opeartion.div(event.params.amount.toString(), totalSupply.toString());

    //calculate user deposit share from the underlying tokens
    const token0A = utils.BN_Opeartion.mul(balances[0].output.toString(), userShare.toString());
    const token1A = utils.BN_Opeartion.mul(balances[1].output.toString(), userShare.toString());

    //sum then as both are 1:1 ration token:ttoken
    const totalTokens = token0A.plus(token1A);

    //get its used value
    const assetValue = await tokenBalanceUSD(
      { token: farm.steak, balance: totalTokens.toString().split(".")[0] },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: Label.FARM,
      value: parseFloat(assetValue.toString()),
      user: event.params.account,
    });
  }
}

export async function unfarmEvent(event: types.Event<UnfarmEventObject>) {
  const farm = await farmInfo(event.address, event.chain);

  if (farm) {
    const [block, totalSupply, balances] = await Promise.all([
      event.block,
      //totalSupply of lp token, which this farming vault supports
      tokenTotalSupply(farm.swapToken, event.chain),
      //get underlying total token balances for the lp token
      abi.Multicall.execute({
        chain: event.chain,
        calls: [
          new abi.Call<TenderSwap>({
            address: farm.tenderSwap,
            contractInterface: tenderSwapInterface,
            fragment: "getToken0Balance",
          }),
          new abi.Call<TenderSwap>({
            address: farm.tenderSwap,
            contractInterface: tenderSwapInterface,
            fragment: "getToken1Balance",
          }),
        ],
      }),
    ]);

    //calculate share w.r.t the amount of lp user depositing and lp totalSupply
    const userShare = utils.BN_Opeartion.div(event.params.amount.toString(), totalSupply.toString());

    //calculate user deposit share from the underlying tokens
    const token0A = utils.BN_Opeartion.mul(balances[0].output.toString(), userShare.toString());
    const token1A = utils.BN_Opeartion.mul(balances[1].output.toString(), userShare.toString());

    //sum then as both are 1:1 ration token:ttoken
    const totalTokens = token0A.plus(token1A);

    //get its used value
    const assetValue = await tokenBalanceUSD(
      { token: farm.steak, balance: totalTokens.toString().split(".")[0] },
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.extraction({
      label: Label.UNFARM,
      value: parseFloat(assetValue.toString()),
      user: event.params.account,
    });
  }
}

const tenderizeAdapter: types.Adapter = {
  appKey: "",
  transformers: {
    //TODO: pass hardcoded addresses to getAddresses
    [constants.Chain.ETHEREUM]: [
      {
        contract: tenderizerInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 14745265,
      },
      {
        contract: tenderSwapInterface,
        eventHandlers: {
          [ADD_LIQUIDITY]: addLiquidityEvent,
          [REMOVE_LIQUIDITY]: removeLiquidityEvent,
        },
        startBlock: 14747812,
      },
      {
        contract: tenderFarmInterface,
        eventHandlers: {
          [FARM]: farmEvent,
          [UNFARM]: unfarmEvent,
        },
        startBlock: 14747796,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 14745265,
      },
    ],
  },
};

export default tenderizeAdapter;
