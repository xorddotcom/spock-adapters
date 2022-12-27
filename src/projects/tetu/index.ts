import { DepositEventObject, WithdrawEventObject } from "./types/SmartVault";
import { DEPOSIT, WITHDRAW, smartVault, vaultInfo, Label } from "./utils";
import { formatUnits } from "@ethersproject/units";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const vault = await vaultInfo(event.address, event.block.number, event.chain);
  if (vault) {
    const amount = formatUnits(event.params.amount, vault.token.decimals);
    const amountInUSD = parseFloat(amount) * vault.price;
    const contribution = utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: amountInUSD,
      user: event.params.beneficiary,
    });
    return contribution;
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const vault = await vaultInfo(event.address, event.block.number, event.chain);
  if (vault) {
    const amount = formatUnits(event.params.amount, vault.token.decimals);
    const amountInUSD = parseFloat(amount) * vault.price;
    const extraction = utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: amountInUSD,
      user: event.params.beneficiary,
    });
    return extraction;
  }
}

const tetuEarnAdapter: types.Adapter = {
  appKey: "04f751c5389f6174907c514d95cbf8a5b937ba332fa919a2e85e13e05afdef6c",
  transformers: {
    [constants.Chain.POLYGON]: [
      {
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 17462310,
      },
    ],
    [constants.Chain.BSC]: [
      {
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 20580131,
      },
    ],
    [constants.Chain.ETHEREUM]: [
      {
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 14507915,
      },
    ],
  },
};

export default tetuEarnAdapter;