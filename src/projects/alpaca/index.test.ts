import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction, testTvl } from "../../utils/testing";
import alpacaAdapter from "./index";
import { lendEvent, repayEvent, redeemEvent } from "./index";
import { LEND, REDEEM, REPAY, LendFacetInterface, BorrowFacetInterface, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("alpaca", () => {
  describe("chain => BSC", () => {
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
      }, 30000);

      it("should return extraction on redeem", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: LendFacetInterface,
          hanlder: redeemEvent,
          hash: "0x182a044178d3cb373bdf8dc18d0a858f3216758c927db4cd7cde0c0bed01a2f5",
          signature: REDEEM,
        });

        expectExtraction(protocolValue, Label.REDEEM, "0x26eb86225c7e2b21f0a2b77ac732b5a6b1ef85ff");
      }, 30000);

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
  });

  testTvl(alpacaAdapter);
});
