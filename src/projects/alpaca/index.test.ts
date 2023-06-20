import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction, testTvl } from "../../utils/testing";
import alpacaAdapter from "./index";
import { lendEvent, repayEvent, redeemEvent } from "./index";
import { LEND, REDEEM, REPAY, LendFacetInterface, BorrowFacetInterface, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("alpaca", () => {
  describe("Interest Bearing Token", () => {
    it("should return contribution on lend", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.BSC,
        contractInterface: LendFacetInterface,
        hanlder: lendEvent,
        hash: "0x8a2700bb365ea6f26ff4de49014a1fa5e6e0e554cea03c7aceba2439798d8045",
        signature: LEND,
      });

      expectContribution(protocolValue, Label.LEND, "0xaa119df55b9aac2d6f108a95bed24944bc8c7c42");
    });

    it("should return extraction on redeem", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.BSC,
        contractInterface: LendFacetInterface,
        hanlder: redeemEvent,
        hash: "0x499dc8cbfd870825ffa6d2d46773de056399190909d8c800cde1c292cf84bb41",
        signature: REDEEM,
      });

      expectExtraction(protocolValue, Label.REDEEM, "0x6f087ea26685e56ac942b1f453a0990c35d4f321");
    });

    it("should return contribution on repay", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.BSC,
        contractInterface: BorrowFacetInterface,
        hanlder: repayEvent,
        hash: "0x5faeb42333bc0234fe3125e0e0236f7703310e7c2a0b567dce83161091a162e4",
        signature: REPAY,
      });

      expectContribution(protocolValue, Label.REPAY, "0x364f818d34b0ef1e69ce337140056faaff8f18e9");
    }, 30000);
  });

  testTvl(alpacaAdapter);
});
