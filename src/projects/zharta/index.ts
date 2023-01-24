import { LoanCreatedEventObject, LoanPaidEventObject } from "./types/Loans";
import { DepositEventObject, WithdrawalEventObject } from "./types/Pool";
import { Label, loansInterface, poolInterface, DEPOSIT, WITHDRAWAL, LOAN_CREATED, LOAN_PAID, getLoan } from "./utils";
import { constants, types, utils } from "@spockanalytics/base";
import { parseUnits } from "ethers/lib/utils";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const walletAddress = event.params.wallet;
  const amount = parseUnits(event.params.amount.toString(), 18);

  return utils.ProtocolValue.contribution({
    label: Label.DEPOSIT,
    value: Number(amount),
    user: walletAddress,
  });
}

export async function withdrawalEvent(event: types.Event<WithdrawalEventObject>) {
  const walletAddress = event.params.wallet;
  const amount = parseUnits(event.params.amount.toString(), 18);

  return utils.ProtocolValue.extraction({
    label: Label.WITHDRAWAL,
    value: Number(amount),
    user: walletAddress,
  });
}

export async function loanCreatedEvent(event: types.Event<LoanCreatedEventObject>) {
  const walletAddress = event.params.wallet;
  const loanId = event.params.loanId;
  const loanInfo = await getLoan("0x5Be916Cff5f07870e9Aef205960e07d9e287eF27", event.chain, [
    walletAddress,
    loanId.toNumber(),
  ]);

  if (loanInfo) {
    return utils.ProtocolValue.contribution({
      label: Label.LOAN_CREATED,
      value: Number(parseUnits(loanInfo.amount.toString(), 18)),
      user: walletAddress,
    });
  }
}

export async function loanPaidEvent(event: types.Event<LoanPaidEventObject>) {
  const walletAddress = event.params.wallet;
  const loanId = event.params.loanId;
  const loanInfo = await getLoan("0x5Be916Cff5f07870e9Aef205960e07d9e287eF27", event.chain, [
    walletAddress,
    loanId.toNumber(),
  ]);

  if (loanInfo) {
    return utils.ProtocolValue.contribution({
      label: Label.LOAN_PAID,
      value: Number(parseUnits(loanInfo.amount.toString(), 18)),
      user: walletAddress,
    });
  }
}

const zhartaAdapter: types.Adapter = {
  appKey: "8b25dbb191f57942bd8c8cf470ae34b845b2c0a9c84daed81abd03f917e46c23",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: loansInterface,
        eventHandlers: {
          [LOAN_CREATED]: loanCreatedEvent,
          [LOAN_PAID]: loanPaidEvent,
        },
        startBlock: 16422125,
      },
      {
        contract: poolInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAWAL]: withdrawalEvent,
        },
        startBlock: 16422124,
      },
    ],
  },
};

export default zhartaAdapter;
