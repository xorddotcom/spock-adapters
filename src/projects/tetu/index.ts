import { computeTVL } from "./tvl";
import { DepositEventObject, WithdrawEventObject } from "./types/SmartVault";
import { DEPOSIT, WITHDRAW, smartVault, vaultInfo, Label, vaultAddresses } from "./utils";
import { formatUnits } from "@ethersproject/units";
import { constants, types, utils } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const vault = await vaultInfo(event.address, event.blockNumber, event.chain);
  if (vault) {
    const txn = await Promise.resolve(event.transaction);
    const amount = formatUnits(event.params.amount, vault.token.decimals);
    const amountInUSD = parseFloat(amount) * vault.price;
    const contribution = utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: amountInUSD,
      user: txn.from,
    });
    return contribution;
  }
}

export async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  const vault = await vaultInfo(event.address, event.blockNumber, event.chain);
  if (vault) {
    const txn = await Promise.resolve(event.transaction);
    const amount = formatUnits(event.params.amount, vault.token.decimals);
    const amountInUSD = parseFloat(amount) * vault.price;
    const extraction = utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value: amountInUSD,
      user: txn.from,
    });
    return extraction;
  }
}

const tetuEarnAdapter: types.Adapter = {
  appKey: "04f751c5389f6174907c514d95cbf8a5b937ba332fa919a2e85e13e05afdef6c",
  transformers: {
    [constants.Chain.POLYGON]: [
      {
        getAddresses: vaultAddresses,
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },

        // startBlock: 17463433,
        startBlock: 22757601, //multicall limitation
      },
    ],
    [constants.Chain.BSC]: [
      {
        getAddresses: vaultAddresses,
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 20581239,
      },
    ],
    [constants.Chain.ETHEREUM]: [
      {
        getAddresses: vaultAddresses,
        contract: smartVault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 15845380,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.POLYGON]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        // startBlock: 17463433,
        startBlock: 22757601, //multicall limitation
      },
    ],
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 15845380,
      },
    ],
    [constants.Chain.BSC]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 20581239,
      },
    ],
  },
};

export default tetuEarnAdapter;
