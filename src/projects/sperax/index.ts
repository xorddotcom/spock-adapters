import { stakingTvl } from "../../utils/staking";
import { computeCollateralTVL } from "./tvl";
import { Transfer_address_address_uint256_EventObject as Transfer_EventObject } from "./types/USDs";
import { Label, USDsInterface, TRANSFER, USDsAddress, VeSPAAddress, SPAAddress } from "./utils";
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
