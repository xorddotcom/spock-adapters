import { Loans__factory, LoansCore__factory, Pool__factory, LoansCore } from "./types";
import { abi, constants } from "@spockanalytics/base";
import { BigNumber } from "ethers";

// contract interfaces
export const loansCoreInterface = LoansCore__factory.createInterface();
export const loansInterface = Loans__factory.createInterface();
export const poolInterface = Pool__factory.createInterface();

// contract events
export const DEPOSIT = poolInterface.getEventTopic(poolInterface.getEvent("Deposit"));
export const WITHDRAWAL = poolInterface.getEventTopic(poolInterface.getEvent("Withdrawal"));
export const LOAN_CREATED = loansInterface.getEventTopic(loansInterface.getEvent("LoanCreated"));
export const LOAN_PAID = loansInterface.getEventTopic(loansInterface.getEvent("LoanPaid"));

export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
  LOAN_CREATED = "Loan Created",
  LOAN_PAID = "Loan Paid",
  LOAN_DEFAULTED = "Loan Defaulted",
}

type LoanInfoExtractor = (
  address: string,
  chain: constants.Chain,
  callInput: [string, number],
) => Promise<{
  walletAddress: string;
  loanId: number;
  amount: BigNumber;
} | null>;

// helper functions
export const getLoan: LoanInfoExtractor = async (address, chain, callInput) => {
  try {
    const result = await abi.Multicall.singleCall<LoansCore>({
      address,
      chain,
      contractInterface: loansCoreInterface,
      fragment: "getLoan",
      callInput,
    });

    return { walletAddress: result[0][0], loanId: result[0][1], amount: result[0][2] };
  } catch (e) {
    return null;
  }
};
