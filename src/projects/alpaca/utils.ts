import { LendFacet__factory, BorrowFacet__factory } from "./types";

// contract interfaces
export const LendFacetInterface = LendFacet__factory.createInterface();
export const BorrowFacetInterface = BorrowFacet__factory.createInterface();

// contract events
// lending facet
export const LEND = LendFacetInterface.getEventTopic(LendFacetInterface.getEvent("LogDeposit"));
export const REDEEM = LendFacetInterface.getEventTopic(LendFacetInterface.getEvent("LogWithdraw"));
// borrow facet
export const REPAY = BorrowFacetInterface.getEventTopic(BorrowFacetInterface.getEvent("LogRepay"));

//types
export enum Label {
  LEND = "Lend",
  REDEEM = "Redeem",
  REPAY = "Repay",
}
