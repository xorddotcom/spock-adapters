import { Aggregator__factory, DCA__factory } from "./types";

// contract interfaces
export const aggregatorInterface = Aggregator__factory.createInterface();
export const dcaInterface = DCA__factory.createInterface();

// contract events
export const TOKENS_SWAPPED = aggregatorInterface.getEventTopic(aggregatorInterface.getEvent("TokensSwapped"));
export const CREATE_POSITION = dcaInterface.getEventTopic(dcaInterface.getEvent("Created"));
export const WITHDRAW_POSITION = dcaInterface.getEventTopic(dcaInterface.getEvent("Withdrawn"));
export const MODIFY_POSITION = dcaInterface.getEventTopic(dcaInterface.getEvent("Modified"));

//types
export enum Label {
  TOKENS_SWAPPED = "Tokens Swapped ",
  CREATE_POSITION = "Create Position",
  WITHDRAW_POSITION = "Withdraw Position",
  MODIFY_POSITION = "Modify Position ",
}

//constants
export const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
