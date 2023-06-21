import { sumBalancesUSD } from "../../utils/sumBalances";
import { DepositEventObject, WithdrawEventObject } from "./types/Hypervisor";
import { DEPOSIT, WITHDRAW, Label, getHypervisorInfo, hypervisorInterface } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const hypervisorInfo = await getHypervisorInfo(event.address, event.chain);

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
      label: Label.ADD_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const hypervisorInfo = await getHypervisorInfo(event.address, event.chain);

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
      label: Label.REMOVE_LIQUIDITY,
      value: parseFloat(totalSum.toString()),
      user: event.params.sender,
    });
  }
}

const gammaAdapter: types.Adapter = {
  appKey: "079f119db037cbe7de4cee7b62b47ade7ad01f8da462b6f421a4681e6e605be7",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: hypervisorInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 13659998,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [],
  },
};

export default gammaAdapter;
