import { computeCollateralTVL, computeStakingTVL } from "./tvl";
import { Transfer_address_address_uint256_EventObject as Transfer_EventObject } from "./types/USDs";
import { Label, USDsInterface, TRANSFER, USDsAddress } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";
import { formatUnits } from "ethers/lib/utils";

export async function handleTransfer(event: types.Event<Transfer_EventObject>) {
  if (event.params.value.eq(0)) return;

  if (event.params.from === constants.ZERO_ADDRESS) {
    // mint

    return utils.ProtocolValue.contribution({
      label: `${Label.ADD_COLLATERAL}`,
      value: utils.BN_Opeartion.mul(formatUnits(event.params.value, 18), 1).toNumber(),
      user: event.params.to,
    });
  } else if (event.params.to === constants.ZERO_ADDRESS) {
    // burn

    return utils.ProtocolValue.extraction({
      label: `${Label.REMOVE_COLLATERAL}`,
      value: utils.BN_Opeartion.mul(formatUnits(event.params.value, 18), 1).toNumber(),
      user: event.params.from,
    });
  }
}

const SperaxAdapter: types.Adapter = {
  appKey: "---",
  transformers: {
    [constants.Chain.ARBITRUM_ONE]: [
      {
        contract: USDsInterface,
        address: USDsAddress,
        eventHandlers: {
          [TRANSFER]: (event) => handleTransfer(event),
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
        extractor: computeStakingTVL,
        startBlock: 9349291,
      },
    ],
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.STAKING,
        extractor: computeStakingTVL,
        startBlock: 14527094,
      },
    ],
  },
};

export default SperaxAdapter;
