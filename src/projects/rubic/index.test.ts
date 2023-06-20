import { extractEvent } from "../../utils/extraction";
import { expectContribution } from "../../utils/testing";
import { rubicTransferStartedEvent, rubicSwappedGenericEvent } from "./index";
import { Label, RUBIC_TRANSFER_STARTED, RUBIC_SWAPPED_GENERIC, generaicSwapFacetInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("rubic", () => {
  describe("chain => ethereum", () => {
    describe("cross-chain swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: generaicSwapFacetInterface,
          hanlder: rubicTransferStartedEvent,
          hash: "0xb95fc2dea25ac3604f9aef90e4ebb2b5f75b3f9d339c013e642ca60298967db2",
          signature: RUBIC_TRANSFER_STARTED,
        });

        expectContribution(protocolValue, Label.CROSS_CHAIN_SWAP, "0x86185b7a03499e70ed3ebdc65afb88a0d19aae24");
      });
    });

    describe("on-chain swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: generaicSwapFacetInterface,
          hanlder: rubicSwappedGenericEvent,
          hash: "0x2368cbab8cc9b395ca34dfd8c109917e5fdce70c548b9e6b6f54d1e6f2010868",
          signature: RUBIC_SWAPPED_GENERIC,
        });

        expectContribution(protocolValue, Label.ON_CHAIN_SWAP, "0xfde5c57aef216f3f881c80f99bc56652ab7d8ab8");
      });
    });
  });
});
