import { swapEvent } from ".";
import { Label, RUBIC_TRANSFER_STARTED, bridgeInterface } from "./utils";
import { constants } from "@spockanalytics/base";
import { extractEvent } from "utils/extraction";
import { expectContribution } from "utils/testing";

describe("rubic", () => {
  describe("chain => ethereum", () => {
    describe("swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bridgeInterface,
          hanlder: swapEvent,
          hash: "0xde3806747f81e09df72171f77f7c8081c6f1e27b5f825a1edd1a46449389d01b",
          signature: RUBIC_TRANSFER_STARTED,
        });
        expectContribution(protocolValue, Label.RUBIC_TRANSFER_STARTED, "0xb7d4cc582bf137166e1499960754d32558e18440");
      });
    });
  });
});
