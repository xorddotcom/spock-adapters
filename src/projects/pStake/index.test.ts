import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { depositEvent, withdrawEvent } from "./index";
import pStakeAdapter from "./index";
import { DEPOSIT, WITHDRAW, Label, stakePoolInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("pStake", () => {
  describe("chain => BSC", () => {
    describe("stake pool", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: stakePoolInterface,
          hanlder: depositEvent,
          hash: "0x76d91778195cb4a5ca5f69b3cf2d6b7dcfd011c973f272d6c0dc012dddc35e5c",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.STAKE, "0xe24759dff56214433a78ddfcc68af10f58c8c17b");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: stakePoolInterface,
          hanlder: withdrawEvent,
          hash: "0xf821b4199092d58db22534e9baf7e9b8a0c2ba5121cf52e60756293bafa73b6e",
          signature: WITHDRAW,
        });

        expectExtraction(protocolValue, Label.UNSTAKE, "0x08c14167dee815cebad812bd46b5319c42251fc6");
      });
    });
  });

  testTvl(pStakeAdapter);
});
