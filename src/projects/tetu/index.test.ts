import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { depositEvent, withdrawEvent } from "./index";
import tetuAdapter from "./index";
import { DEPOSIT, WITHDRAW, smartVault, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("tetu", () => {
  describe("chain => Polygon", () => {
    describe("smart vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: smartVault,
          hanlder: depositEvent,
          hash: "0xde3806747f81e09df72171f77f7c8081c6f1e27b5f825a1edd1a46449389d01b",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.DEPOSIT, "0xb7d4cc582bf137166e1499960754d32558e18440");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: smartVault,
          hanlder: withdrawEvent,
          hash: "0xbad5e475b194e1fc25fdb793afc481b4d8e28a87b708971524cd7b2bccf69318",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.WITHDRAW, "0x76c8a1c74fdc88072f4582830ddbe588388c055b");
      });
    });
  });

  describe("chain => BSC", () => {
    describe("smart vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: smartVault,
          hanlder: depositEvent,
          hash: "0xe7d5b6cf4b7d0e4d9b981ad37488ee0ef1fb617c69b299bbe7fdcc54a6e91aad",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.DEPOSIT, "0xebc1950ee59f1178708f88133396de87e79f138c");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: smartVault,
          hanlder: withdrawEvent,
          hash: "0x69fc0187c4d1c5093519a57c2e40769a7578d8eba112c7f9288b702ff9033ef5",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.WITHDRAW, "0x647b41b745cf5e32e244e432902468c4bd89643c");
      });
    });
  });

  describe("chain => Ethereum", () => {
    describe("smart vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: smartVault,
          hanlder: depositEvent,
          hash: "0xd7d5d40a3808ad2353d270902c8e4b4438197b87c90a75e3db1ec6b6a45a9896",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.DEPOSIT, "0xbbbbb8c4364ec2ce52c59d2ed3e56f307e529a94");
      });
    });
  });

  testTvl(tetuAdapter);
});
