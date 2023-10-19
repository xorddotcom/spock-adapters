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
          hanlder: handleSwap,
          hash: "0xe77408466dade7a3506348e3700ba89dee91875d49d696e6efb166bc4305ad3f",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0x08f886398cf13968716a36489f8659efd46a0fc3");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapIn,
          hash: "0xe5a8d2173602cf56e7d710b96a8ec479747869551239fc5689c61d8a93b08835",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, Label.SWAP_IN, "0x6e054b0b80fd06ada55eaaf09c625e7d2833d9a6");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapOut,
          hash: "0x6e5871874ee37e6726f35ac4d438d227e8b47fc5c84285eb65bc1417a9490646",
          signature: SWAP_OUT,
        });

        expectContribution(protocolValue, Label.SWAP_OUT, "0xc6547284d2c7dbdc4bc7a29105b01d62c03b9481");
      }, 50000);
    });
  });

  describe("chain => Polygon", () => {
    describe("Diamond", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwap,
          hash: "0x515cd94da02b946fb41c91d62ab8e52cd26916d69b0c388f626e0e193653202d",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0xc234c1bac1101f0a717fa6fef8f5f27b989e9c22");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapIn,
          hash: "0xf93ee1edc9e849229f6e9499229a18bf19312844f4eefa9ddef84c88044457cb",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, Label.SWAP_IN, "0x6ada80622a88735f410da6f31dfb90cf767274db");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapOut,
          hash: "0xb8552e331eb38a7bee61b0e3937688bf53872ff3de540d5458a71dec6d3e0f60",
          signature: SWAP_OUT,
        });

        expectContribution(protocolValue, Label.SWAP_OUT, "0xd8c9df454c9e61a68738d6e07f53888e936d60e0");
      }, 50000);
    });
  });

  describe("chain => Avalanche", () => {
    describe("Diamond", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.AVALANCHE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwap,
          hash: "0x1f6768555baeb35745c056994eec8377a0ab070080493ef14cf74fd5f6dc5a17",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0xadeb3e768097e9df161d3a8c4e1751cf9f2ddf86");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.AVALANCHE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapIn,
          hash: "0x0fe05c155f6b01190bca118dc6b925239baded4dc77f3d5dbb987fecc55f5fad",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, Label.SWAP_IN, "0x4990d3ba7662590a5472d2b071101bd5c2d81c94");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.AVALANCHE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapOut,
          hash: "0x339d7eb04b856079c657359d61553808ae344c101d45a2c5df0a69d93b874d3b",
          signature: SWAP_OUT,
        });

        expectContribution(protocolValue, Label.SWAP_OUT, "0x1c7411ce07ee24cca0fab2401d66ef72b81f83d0");
      }, 50000);
    });
  });

  describe("chain => Arbitrum", () => {
    describe("Diamond", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwap,
          hash: "0xbaabe81a7566c2c4ef35a3e43c937d4bf137b43489c27f4bd273fdb94d06ba70",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0x725fde1292357918abf7968089c8c590388d27a5");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapIn,
          hash: "0x08465aae4eab3df756c355c639d007d8fa196173096524284576e3e3b6fcf452",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, Label.SWAP_IN, "0xdea3c4034a9034ee13fd4a29b5c966be4efaa131");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapOut,
          hash: "0xe0a15f70b559816e8940c0c32f8288a48c171626d87ba4587e57f11e829ec1cc",
          signature: SWAP_OUT,
        });

        expectContribution(protocolValue, Label.SWAP_OUT, "0xd8c9df454c9e61a68738d6e07f53888e936d60e0");
      }, 50000);
    });
  });

  describe("chain => Optimism", () => {
    describe("Diamond", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.OPTIMISM,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwap,
          hash: "0xd13a9ce096bdcb09197cade6c22c51f9bbd70efd432341eac4d55523e5d39e77",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0x35fc77ab8f5e9be49a181e2d7cdd5c08cf52c8a8");
      }, 50000);

      it("should return contribution on swapIn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.OPTIMISM,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapIn,
          hash: "0xda9092521f325da212bef5e58c087afb40bc2d53aa9c9f490087cf6bd8445a14",
          signature: SWAP_IN,
        });

        expectContribution(protocolValue, Label.SWAP_IN, "0xefe51f2b3b895b918c35c75b4cb7853fb3b5fb94");
      }, 50000);

      it("should return contribution on swapOut", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.OPTIMISM,
          contractInterface: aggregatorFacetInterface,
          hanlder: handleSwapOut,
          hash: "0xffb9d602d680ce5c547e7677dacbc2d2571d691d0e061a634f93c2bd4e58d6a5",
          signature: SWAP_OUT,
        });

        expectContribution(protocolValue, Label.SWAP_OUT, "0xc97cdde0329970c8fcf23ebdec8540b94be0bf6e");
      }, 50000);
    });
  });
});
