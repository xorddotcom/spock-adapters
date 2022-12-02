import { StakeOrUnstakeOrClaimEventObject } from "./types/Staking";
import { DepositEventObject, WithdrawEventObject } from "./types/Vault";
import { vault, staking, DEPOSIT, WITHDRAW, STAKE_OR_UNSTAKE_OR_CLAIN, unipilotVault } from "./utils";
import { formatUnits } from "@ethersproject/units";
import { constants, types } from "@spockanalytics/base";

async function depositEvent(event: types.Event<DepositEventObject>) {
  console.log("unipilot depositEvent => ", event);
  const vaultAddress = event.transaction.to;
  const vault = await unipilotVault.getPool(vaultAddress, event.chain);
  if (vault) {
    const amount0 = formatUnits(event.params.amount0, vault.token0.decimals);
    const amount1 = formatUnits(event.params.amount1, vault.token1.decimals);
  }
}

async function withdrawEvent(event: types.Event<WithdrawEventObject>) {
  console.log("unipilot withdrawEvent => ", event);
}

async function stakeOrUnsatkeEvent(event: types.Event<StakeOrUnstakeOrClaimEventObject>) {
  console.log("unipilot stakeOrUnsatkeEvent => ", event);
}

const unipilotAdapter: types.Adapter = {
  appKey: "08019e5ae0b9b6964c2317c26a4b8666d4ac357b0060c3b6e9fb680b4465f693",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: vault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
        startBlock: 14495907,
      },
      {
        address: "0xc9256e6e85ad7ac18cd9bd665327fc2062703628",
        contract: staking,
        eventHandlers: {
          [STAKE_OR_UNSTAKE_OR_CLAIN]: stakeOrUnsatkeEvent,
        },
        startBlock: 15025220,
      },
    ],
  },
};

export default unipilotAdapter;
