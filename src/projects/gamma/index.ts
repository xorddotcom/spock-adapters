import { sumBalancesUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { DepositEventObject, WithdrawEventObject } from "./types/Hypervisor";
import {
  DEPOSIT,
  WITHDRAW,
  Label,
  hypervisorInterface,
  gamma_Hypervisor,
  getHypervisorDex,
  getHypervisors,
} from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const [hypervisorInfo, hypervisorDex] = await Promise.all([
    gamma_Hypervisor.getPool(event.address, event.chain),
    getHypervisorDex(event.address, event.chain),
  ]);

  if (hypervisorInfo) {
    const block = await Promise.resolve(event.block);
    const totalSum = await sumBalancesUSD(
      [
        { token: hypervisorInfo.token0, balance: event.params.amount0 },
        { token: hypervisorInfo.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.contribution({
      label: `${Label.ADD_LIQUIDITY} (${hypervisorDex})`,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const [hypervisorInfo, hypervisorDex] = await Promise.all([
    gamma_Hypervisor.getPool(event.address, event.chain),
    getHypervisorDex(event.address, event.chain),
  ]);

  if (hypervisorInfo) {
    const block = await Promise.resolve(event.block);
    const totalSum = await sumBalancesUSD(
      [
        { token: hypervisorInfo.token0, balance: event.params.amount0 },
        { token: hypervisorInfo.token1, balance: event.params.amount1 },
      ],
      event.chain,
      block.timestamp,
    );

    return utils.ProtocolValue.extraction({
      label: `${Label.REMOVE_LIQUIDITY} (${hypervisorDex})`,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

const GammaAdapter: types.Adapter = {
  appKey: "a36dba2c16c6e33139265d6350e70129036088b0780c0291bcccf9a84b15fe69",
  transformers: {
    [constants.Chain.BSC]: [
      {
        contract: hypervisorInterface,
        getAddresses: getHypervisors,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 26097149,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.BSC]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 26097149,
      },
    ],
  },
};

export default GammaAdapter;
