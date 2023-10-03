import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction } from "../../utils/testing";
import { handleSwap, handleSwapIn, handleSwapOut } from "./index";
import { aggregatorFacetInterface, SWAP, SWAP_IN, SWAP_OUT, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Magpie", () => {
  describe("chain => Ethereum", () => {
    describe("Diamond", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorFacetInterface,
          hanlder: (event) => handleSwap(event),
          hash: "0xe77408466dade7a3506348e3700ba89dee91875d49d696e6efb166bc4305ad3f",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0x08f886398cf13968716a36489f8659efd46a0fc3");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorFacetInterface,
          hanlder: (event) => handleSwapIn(event),
          hash: "0xe5a8d2173602cf56e7d710b96a8ec479747869551239fc5689c61d8a93b08835",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, `${Label.SWAP_IN} (1 -> 6)`, "0x6e054b0b80fd06ada55eaaf09c625e7d2833d9a6");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorFacetInterface,
          hanlder: (event) => handleSwapOut(event),
          hash: "0x6e5871874ee37e6726f35ac4d438d227e8b47fc5c84285eb65bc1417a9490646",
          signature: SWAP_OUT,
        });

        expectExtraction(protocolValue, `${Label.SWAP_OUT} (5 -> 1)`, "0xc6547284d2c7dbdc4bc7a29105b01d62c03b9481");
      }, 50000);
    });
  });
});
