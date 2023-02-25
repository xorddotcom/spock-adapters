import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { mintEvent, burnEvent } from "./index";
import bullionFxAdapter from "./index";
import { MINT, BURN, Label, bullPair } from "./utils";
import { constants } from "@spockanalytics/base";

describe("bullionfx", () => {
  describe("chain => Ethereum", () => {
    describe("pair", () => {
      it.only("should return contribution on mint", async () => {
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
          hash: "",
          signature: BURN,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "");
      });
    });
  });

  testTvl(bullionFxAdapter);
});
