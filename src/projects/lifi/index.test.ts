import { extractEvent } from "../../utils/extraction";
import { expectContribution } from "../../utils/testing";
import { lifiSwappedGenericEvent, lifiTransferStartedEvent } from "./index";
import { Label, LIFI_SWAPPED_GENERIC, LIFI_TRANSFER_STARTED, acrossFacetInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("lifi", () => {
  describe("chain => ethereum", () => {
    describe("cross-chain swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: acrossFacetInterface,
          hanlder: lifiTransferStartedEvent,
          hash: "0x29219630349904cd6ffe390f259c6ecf39fac215fc79ff47f53d144abd3c3bb5",
          signature: LIFI_TRANSFER_STARTED,
        });

        expectContribution(protocolValue, Label.CROSS_CHAIN_SWAP, "0x92e348d142667980de4d80cccea3f3a32b2e2055");
      });
    });

    describe("on-chain swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: acrossFacetInterface,
          hanlder: lifiSwappedGenericEvent,
          hash: "0x093290e82545cd1ecf70361008c9b31a7b2f725f99c11a90ac4cc24fa25cb236",
          signature: LIFI_SWAPPED_GENERIC,
        });

        expectContribution(protocolValue, Label.ON_CHAIN_SWAP, "0x08f3157cbc23c23d5a8de67455e96c6cf76b669b");
      });
    });
  });
});
