import { Chain } from "constant/chains";
import { Adapter } from "types/adapter";
import { Event } from "types/event";

import { Staking__factory, Vault__factory } from "./types";
import { StakeOrUnstakeOrClaimEventObject } from "./types/Staking";
import { DepositEventObject, WithdrawEventObject } from "./types/Vault";

const vault = Vault__factory.createInterface();
const staking = Staking__factory.createInterface();

const DEPOSIT = vault.getEventTopic(vault.getEvent("Deposit"));
const WITHDRAW = vault.getEventTopic(vault.getEvent("Withdraw"));
const STAKE_OR_UNSTAKE_OR_CLAIN = staking.getEventTopic(staking.getEvent("StakeOrUnstakeOrClaim"));

async function depositEvent(event: Event<DepositEventObject>) {}

async function withdrawEvent(event: Event<WithdrawEventObject>) {}

async function stakeOrUnsatkeEvent(event: Event<StakeOrUnstakeOrClaimEventObject>) {}

const unipilotAdapter: Adapter = {
  appKey: "",
  transformers: {
    [Chain.ETHEREUM]: [
      {
        contract: vault,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAW]: withdrawEvent,
        },
      },
      {
        address: "0xc9256e6e85ad7ac18cd9bd665327fc2062703628",
        contract: staking,
        eventHandlers: {
          [STAKE_OR_UNSTAKE_OR_CLAIN]: stakeOrUnsatkeEvent,
        },
      },
    ],
  },
};

export default unipilotAdapter;
