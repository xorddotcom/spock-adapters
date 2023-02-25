import { AddressMap } from "../../types/chain";
import { Loans__factory, LoansCore__factory, Pool__factory, LoansCore } from "./types";
import { BigNumber } from "@ethersproject/bignumber";
import { abi, constants } from "@spockanalytics/base";

// contract interfaces
export const loansCoreInterface = LoansCore__factory.createInterface();
export const loansInterface = Loans__factory.createInterface();
export const poolInterface = Pool__factory.createInterface();

// contract events
export const DEPOSIT = poolInterface.getEventTopic(poolInterface.getEvent("Deposit"));
export const WITHDRAWAL = poolInterface.getEventTopic(poolInterface.getEvent("Withdrawal"));
export const LOAN_CREATED = loansInterface.getEventTopic(loansInterface.getEvent("LoanCreated"));
export const LOAN_PAID = loansInterface.getEventTopic(loansInterface.getEvent("LoanPaid"));

// types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
  LOAN_CREATED = "Loan Created",
  LOAN_PAID = "Loan Paid",
  LOAN_DEFAULTED = "Loan Defaulted",
}

type LoanInfoExtractor = (
  chain: constants.Chain,
  callInput: [string, number],
  blockNumber: number,
) => Promise<{
  loanId: number;
  amount: BigNumber;
} | null>;

// constants
const LOANS_CORE: AddressMap = {
  [constants.Chain.ETHEREUM]: "0x5Be916Cff5f07870e9Aef205960e07d9e287eF27",
};

// helper functions
export const getLoan: LoanInfoExtractor = async (chain, callInput, blockNumber) => {
  try {
    const result = (
      await abi.Multicall.singleCall<LoansCore>({
        address: LOANS_CORE[chain] ?? "",
        chain,
        contractInterface: loansCoreInterface,
        fragment: "getLoan",
        callInput,
        blockNumber,
      })
    ).output;

    return { loanId: result.id.toNumber(), amount: result.amount };
  } catch (e) {
    return null;
  }
};
