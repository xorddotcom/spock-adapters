import { stakingTvl } from "../../utils/staking";
import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeCollateralTVL } from "./tvl";
import { Transfer_address_address_uint256_EventObject as Transfer_EventObject } from "./types/USDs";
import { WithdrawEventObject, UserCheckpointEventObject as DepositEventObject } from "./types/VeSPA";
import {
  USDsInterface,
  VeSPAInterface,
  TRANSFER,
  DEPOSIT,
  WITHDRAW,
  USDsAddress,
  VeSPAAddress,
  SPAAddress,
  Label,
} from "./utils";
import { formatUnits } from "@ethersproject/units";
import { constants, types, utils } from "@spockanalytics/base";

export async function handleTransfer(event: types.Event<Transfer_EventObject>) {
  if (event.params.value.eq(0)) return;

  if (event.params.from === constants.ZERO_ADDRESS) {
    // mint

    return utils.ProtocolValue.contribution({
      label: Label.ADD_COLLATERAL,
      value: parseFloat(formatUnits(event.params.value, 18)), //USD stable $1 price
      user: event.params.to,
    });
  } else if (event.params.to === constants.ZERO_ADDRESS) {
    // burn

    return utils.ProtocolValue.extraction({
      label: Label.REMOVE_COLLATERAL,
      value: parseFloat(formatUnits(event.params.value, 18)), //USD stable $1 price
      user: event.params.from,
    });
  }
}

export async function handleDeposit(event: types.Event<DepositEventObject>) {
  const block = await Promise.resolve(event.block);

  const assetValue = await tokenBalanceUSD(
    { token: SPAAddress[event.chain] as string, balance: event.params.value },
    event.chain,
    block.timestamp,
  );

  return utils.ProtocolValue.contribution({
    label: Label.STAKE,
    value: assetValue.toNumber(),
    user: event.params.provider,
  });
}

export async function handleWithdraw(event: types.Event<WithdrawEventObject>) {
  const block = await Promise.resolve(event.block);

  const assetValue = await tokenBalanceUSD(
    { token: SPAAddress[event.chain] as string, balance: event.params.value },
    event.chain,
    block.timestamp,
  );

  return utils.ProtocolValue.extraction({
    label: Label.UNSTAKE,
    value: assetValue.toNumber(),
    user: event.params.provider,
  });
}

const SperaxAdapter: types.Adapter = {
  appKey: "92e8b0763354b4a6403b7824e062cd343f33ce23b157438f78c722bdb334e900",
  transformers: {
    [constants.Chain.ARBITRUM_ONE]: [
      {
        contract: USDsInterface,
        address: USDsAddress,
        eventHandlers: {
          [TRANSFER]: handleTransfer,
        },
        startBlock: 4032282,
      },
      {
        contract: VeSPAInterface,
        address: VeSPAAddress[constants.Chain.ARBITRUM_ONE],
        eventHandlers: {
          [DEPOSIT]: handleDeposit,
        },
        startBlock: 9349310,
      },
      {
        contract: VeSPAInterface,
        address: VeSPAAddress[constants.Chain.ARBITRUM_ONE],
        eventHandlers: {
          [WITHDRAW]: handleWithdraw,
        },
        startBlock: 9349310,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ARBITRUM_ONE]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeCollateralTVL,
        startBlock: 4032282,
      },
      {
        category: types.TVL_Category.STAKING,
        extractor: stakingTvl(
          VeSPAAddress[constants.Chain.ARBITRUM_ONE] as string,
          SPAAddress[constants.Chain.ARBITRUM_ONE] as string,
        ),
        startBlock: 9349291,
      },
    ],
    // [constants.Chain.ETHEREUM]: [
    //   {
    //     category: types.TVL_Category.STAKING,
    //     extractor: stakingTvl(
    //       VeSPAAddress[constants.Chain.ETHEREUM] as string,
    //       SPAAddress[constants.Chain.ETHEREUM] as string,
    //     ),
    //     startBlock: 14527094,
    //   },
    // ],
  },
};

export default SperaxAdapter;
