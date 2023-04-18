import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { mintEvent, burnEvent, swapEvent } from "./index";
import bullionFxAdapter from "./index";
import { MINT, BURN, SWAP, Label, bullPair } from "./utils";
import { constants } from "@spockanalytics/base";

describe("bullionfx", () => {
  describe("chain => Ethereum", () => {
    describe("pair", () => {
      it("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: mintEvent,
          hash: "0x97a82376dcdcb7f2ffb0ed9682c6813205fffcefb51aca51e59701f0262a324c",
          signature: MINT,
        });

        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b");
      });

      it("should return extraction on burn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: burnEvent,
          hash: "0x31de47dbde4fdc8aa473fc23dafefe8554616a4a8d3591d3ae566fc11ae6f59c",
          signature: BURN,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b");
      });

      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: swapEvent,
          hash: "0x0f7e3b9ea8cd8e72bf7c3f3c25e3280f73d7a07b626a283209d2a67a6ccc531f",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b");
      });

      it("should return contribution on native token buy", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: swapEvent,
          hash: "0xa2743973196cedc9e0c04425d8ec67b3fae916ac9ea70eaa0dbb067af30979eb",
          signature: SWAP,
        });

        expectContribution(protocolValue, `${Label.BUY} GOLD`, "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b");
      });

      it("should return extraction on native token sell", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: swapEvent,
          hash: "0x0f7e3b9ea8cd8e72bf7c3f3c25e3280f73d7a07b626a283209d2a67a6ccc531f",
          signature: SWAP,
        });

        expectExtraction(protocolValue, `${Label.SELL} GOLD`, "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b");
      });
    });
  });

  testTvl(bullionFxAdapter);
});
