import { extractEvent } from "../../utils/extraction";
import { expectContribution } from "../../utils/testing";
import { swapEvent } from "./index";
import { Label, MetaSwapInterface, SWAP } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Metamask", () => {
  describe("MetaSwap", () => {
    it("should return contribution on swap (Ethereum)", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.ETHEREUM,
        contractInterface: MetaSwapInterface,
        hanlder: swapEvent,
        hash: "0x440fb4febc0ff285f896caa6fba1865b6afca03b44bb93e62c14c3776745a93f",
        signature: SWAP,
      });

      expectContribution(protocolValue, Label.SWAP, "0x692f049490b976449bcc9dd5732a9e80b0259bf6");
    });
    it("should return contribution on swap (Polygon)", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.POLYGON,
        contractInterface: MetaSwapInterface,
        hanlder: swapEvent,
        hash: "0xca171ec41f944ecc088883b64de42eaabd4b3ffabf0a3ece61fdaac77ea15e84",
        signature: SWAP,
      });

      expectContribution(protocolValue, Label.SWAP, "0xc049724617e9a86767c77833cf79345edf9a290a");
    });
    it("should return contribution on swap (BSC)", async () => {
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
