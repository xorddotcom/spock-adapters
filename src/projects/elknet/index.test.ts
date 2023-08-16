import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { mintEvent, burnEvent, stakeEvent, withdrawnEvent } from "./index";
import elknetAdapter from "./index";
import { MINT, BURN, STAKE, UNSTAKE, Label, elkPair, staking } from "./utils";
import { constants } from "@spockanalytics/base";

describe("elknet", () => {
  describe("chain => Polygon", () => {
    describe("pair", () => {
      it("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: elkPair,
          hanlder: mintEvent,
          hash: "0x0378ba9ff72ee7e0b451b9952e9a42dc91edfa3f002c2cd024f0033105b2b4c6",
          signature: MINT,
        });

        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0xbae29b5c066b02d59493da8bbccc1faf51529438");
      });

      it("should return extraction on burn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: elkPair,
          hanlder: burnEvent,
          hash: "0xbaaff0ff48e146a996445094fc09d827f339419d21af7b9dc022ced125ad62d2",
          signature: BURN,
        });

        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0xca6518489d7f955aa0c0c28ffa212f49dd80c99d");
      });
    });

    describe("staking", () => {
      it("should return contribution on stake", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: staking,
          hanlder: stakeEvent,
          hash: "0xee12328feb5b065eb25ebf7a169910578b8dc9a459866e575ce4462eb62ce824",
          signature: STAKE,
        });

        expectContribution(protocolValue, Label.STAKE, "0xfce051101bbb0bf43050af498a4629f0327f741a");
      });

      it("should return extraction on unstake", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: staking,
          hanlder: withdrawnEvent,
          hash: "0x8cba4fc24900e89774ea70e27a966981a962666aafa093fdc18d2f871cf1a569",
          signature: UNSTAKE,
        });

        expectExtraction(protocolValue, Label.UNSTAKE, "0x8181f49f1ae41d5801bb9239d2bec888e60f83df");
      });
    });
  });

  testTvl(elknetAdapter);
});
