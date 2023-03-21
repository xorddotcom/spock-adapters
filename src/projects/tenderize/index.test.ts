import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { depositEvent, withdrawEvent, addLiquidityEvent, removeLiquidityEvent, farmEvent, unfarmEvent } from "./index";
import tenderizeAdapter from "./index";
import {
  DEPOSIT,
  WITHDRAW,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  FARM,
  UNFARM,
  tenderizerInterface,
  tenderSwapInterface,
  tenderFarmInterface,
  Label,
} from "./utils";
import { constants } from "@spockanalytics/base";

describe("tenderize", () => {
  describe("chain => Ethereum", () => {
    describe("tenderizer", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderizerInterface,
          hanlder: depositEvent,
          hash: "0xf597236846fa58b24de2eb8fe401943dfd7b1c9ec13f7e9a382e5ed5bcc1dd9f",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x7e98781f250a166a89215a1426b962108b9c38f6");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderizerInterface,
          hanlder: withdrawEvent,
          hash: "0x3ffc7e31cb5dbc7044eee812f55ea0017d12ace98f8d6e246435b65c62e1053d",
          signature: WITHDRAW,
        });

        expectExtraction(protocolValue, Label.WITHDRAW, "0xa1ea52b245f7f3e29599c8c83a1016e09ddd2523");
      });
    });

    describe("tenderSwap", () => {
      it("should return contribution on add liquidity", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderSwapInterface,
          hanlder: addLiquidityEvent,
          hash: "0x0faae1d34edbe7397eafc45dadeebad7ba5f759fc43382af9f8276bd9c39d598",
          signature: ADD_LIQUIDITY,
        });

        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0xb04091c5151d23f160c30d74b89e447d76a754d3");
      });

      it("should return extraction on remove liquidity", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderSwapInterface,
          hanlder: removeLiquidityEvent,
          hash: "0x13c9e784e09688c74f010e9930caf3c7d0d5d879e36e5353fb6abe1115de6af4",
          signature: REMOVE_LIQUIDITY,
        });

        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0xb04091c5151d23f160c30d74b89e447d76a754d3");
      });
    });

    describe("tenderFarm", () => {
      it("should return contribution on farm", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderFarmInterface,
          hanlder: farmEvent,
          hash: "0x719de0f38d05afc76775a1d76a200de8a66cf8b7f3eade7be1dd578a8b5e0d37",
          signature: FARM,
        });

        expectContribution(protocolValue, Label.FARM, "0x5f76f7461fcb6a1048aae116b577a58d580faeb4");
      });

      it("should return extraction on unfarm", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: tenderFarmInterface,
          hanlder: unfarmEvent,
          hash: "0x0244db2aaab0bba8cae9f5c7f291d699442cb1a955bf5a57143bbabf26d8b7fc",
          signature: UNFARM,
        });

        expectExtraction(protocolValue, Label.UNFARM, "0x16c2312b7168f0e268751a4d5d73953176d87768");
      });
    });

    testTvl(tenderizeAdapter);
  });
});
