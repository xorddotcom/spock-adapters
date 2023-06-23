import { extractEvent } from "../../utils/extraction";
import { expectContribution } from "../../utils/testing";
import { stakeLidoEvent, stakeRocketEvent, swapEvent } from "./index";
import {
  Label,
  LidoEthStakingInterface,
  MetaSwapInterface,
  RockedEthStakingInterface,
  STAKE_LIDO,
  STAKE_ROCKET,
  SWAP,
} from "./utils";
import { constants } from "@spockanalytics/base";

describe("Metamask", () => {
  describe("chain => Ethereum", () => {
    describe("Liquid staking", () => {
      it("should return contribution on deposit to lido", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: LidoEthStakingInterface,
          hanlder: stakeLidoEvent,
          hash: "0x48542446050b8735df4ff3bc8561c63be348d0f6bdc8c195d7b545f45e96d5f1",
          signature: STAKE_LIDO,
        });

        expectContribution(protocolValue, Label.STAKE_LIDO, "0x92828511e258b22d7231c6f8e5e2035c0a8b47d8");
      });
      it("should return contribution on deposit to rocket", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: RockedEthStakingInterface,
          hanlder: stakeRocketEvent,
          hash: "0xd45a2fd494b22ae64fb7a6e2fd0782fc54251d1f25a34f5714be29f79257907e",
          signature: STAKE_ROCKET,
        });

        expectContribution(protocolValue, Label.STAKE_ROCKET, "0x7e51f4f8d54d6b2c468d0c2a6fa53ad465c5eeee");
      });
    });

    describe.skip("Swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: MetaSwapInterface,
          hanlder: swapEvent,
          hash: "0x440fb4febc0ff285f896caa6fba1865b6afca03b44bb93e62c14c3776745a93f",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0x692f049490b976449bcc9dd5732a9e80b0259bf6");
      });
    });
  });

  describe.skip("chain => Polygon", () => {
    describe("Swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: MetaSwapInterface,
          hanlder: swapEvent,
          hash: "0xca171ec41f944ecc088883b64de42eaabd4b3ffabf0a3ece61fdaac77ea15e84",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0xc049724617e9a86767c77833cf79345edf9a290a");
      });
    });
  });

  describe.skip("chain => BSC", () => {
    describe("Swap", () => {
      it("should return contribution on swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: MetaSwapInterface,
          hanlder: swapEvent,
          hash: "0xac383a18860257730ce33fe7531b14a5ea51a9f0cbab3c599da02379a9f82116",
          signature: SWAP,
        });

        expectContribution(protocolValue, Label.SWAP, "0xe61c56b8dd056a29d2c02e8edec8b78516525855");
      });
    });
  });
});
