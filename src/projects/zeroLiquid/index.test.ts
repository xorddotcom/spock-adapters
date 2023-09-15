import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction, testTvl } from "../../utils/testing";
import { depositEvent, withdrawEvent, mintEvent, burnEvent } from "./index";
import zeroLiquidAdapter from "./index";
import { Label, DEPOSIT, WITHDRAW, MINT, BURN, zeroLiquidInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("zeroLiquid", () => {
  describe("chain => ethereum", () => {
    describe("Loan", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: zeroLiquidInterface,
          hanlder: depositEvent,
          hash: "0xae8a51f5a4e170011faf00943aaa91279cf06d9f2defa7a26f3c8c45707072af",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x270d2fa547a6aa19a95c48ad1d7929354e924e1a");
      });

      it("should return extract on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: zeroLiquidInterface,
          hanlder: withdrawEvent,
          hash: "0x1f594af6336a00e2c14c76354a19ab36c855f1d683ffd67afd2736c6ec162353",
          signature: WITHDRAW,
        });

        expectExtraction(protocolValue, Label.WITHDRAW, "0xa0a31d7d02723e66ea24df8285b30ea5e29e2317");
      });

      it("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: zeroLiquidInterface,
          hanlder: mintEvent,
          hash: "0x3c90487d7d7202124b82d0f20add45999dfa8c62463f5d1a7635c59e4c0da64e",
          signature: MINT,
        });

        expectContribution(protocolValue, Label.MINT, "0x6671219099ea6ccc75eb3f4f4200d46a97b09a19");
      });

      it("should return extraction on burn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: zeroLiquidInterface,
          hanlder: burnEvent,
          hash: "0xe086cfc3317f147626bbb5f3b37111223d5b9ab2be88f82a2fb55a39bb3710f9",
          signature: BURN,
        });

        expectExtraction(protocolValue, Label.BURN, "0x4e3aa6092cd50ddafcb3e091990ede029f18653b");
      });
    });
  });

  testTvl(zeroLiquidAdapter);
});
