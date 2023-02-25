import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction } from "../../utils/testing";
import { stakeEvent, unstakeEvent } from "./index";
import { STAKE, UNSTAKE, staking, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("dafi", () => {
  describe("chain => Ethereum", () => {
    describe("staking", () => {
      it("should return contribution on staking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: staking,
          hanlder: stakeEvent,
          hash: "0x99a86f4bb6fb634daa4c8ea46f41a73a2eb6634ea3b603f1a25039aa7dbcaf23",
          signature: STAKE,
        });
        expectContribution(protocolValue, Label.STAKE, "0x4cc98a94c1abe80a0e141b857f9024048f084267");
      });
      it("should return extraction on unstaking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: staking,
          hanlder: unstakeEvent,
          hash: "0x2108781eb8e22a79281d39f52bb41d16f3befaf5951f435504212f03b9d3a08d",
          signature: UNSTAKE,
        });
        expectExtraction(protocolValue, Label.UNSTAKE, "0x4a8796a79bab19291922e6fe6a8fa60691716b74");
      });
    });
  });

  describe("chain => Polygon", () => {
    describe("staking", () => {
      it("should return contribution on staking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: staking,
          hanlder: stakeEvent,
          hash: "0x089fc918f4497e04eb1407af064d981b0f7de2cdb9705375dce17a08cb41f44d",
          signature: STAKE,
        });
        expectContribution(protocolValue, Label.STAKE, "0x5a3546ef0467333d5f2176a2d13970032886139c");
      });
      it("should return extraction on unstaking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: staking,
          hanlder: unstakeEvent,
          hash: "0x2915e995651090e23bdedd14d4a770f8f3d9de81e670953715c143f1d5eca028",
          signature: UNSTAKE,
        });
        expectExtraction(protocolValue, Label.UNSTAKE, "0x129f5a7f6fcafe11f4f91cdaf4ba8c68d080309b");
      });
    });
  });

  describe("chain => BSC", () => {
    describe("staking", () => {
      it("should return contribution on staking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: staking,
          hanlder: stakeEvent,
          hash: "0x2aa02017f97bbc5ae971c0f5bd3a80e7887f7593366093e219b6c4cf81d272a1",
          signature: STAKE,
        });
        expectContribution(protocolValue, Label.STAKE, "0x2c6c2b1a1f2b0739a2457a46d43fdf06c07e30c4");
      });
      it("should return extraction on unstaking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: staking,
          hanlder: unstakeEvent,
          hash: "0x284539804a1c779337da6754387b1896ffe82b4b29b41fb74e0dab6031916b12",
          signature: UNSTAKE,
        });
        expectExtraction(protocolValue, Label.UNSTAKE, "0x86f386ed20c58ea66b21c32432ccc8329ead773b");
      });
    });
  });
});
