import { extractEvent } from "../../utils/extraction";
import { expectContribution } from "../../utils/testing";
import { claimEvent, depositEvent } from "./index";
import { Label, CLAIM, DEPOSIT, bridgeInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("helloBridge", () => {
  describe("chain => bsc", () => {
    describe("bridge", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: bridgeInterface,
          hanlder: depositEvent,
          hash: "0x6e94be81a0455086bc931cbaf33acbcbbc2f49006d8f753751bfd3702f39ceab",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x17673de73ca1761597b160004b2b278a00c2a4a5");
      });

      it("should return contribution on claim", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: bridgeInterface,
          hanlder: claimEvent,
          hash: "0x9a53890acd61e2d7c38d29fc0d1855280376d3aa29e298cb1feb4efcdc092240",
          signature: CLAIM,
        });

        expectContribution(protocolValue, Label.CLAIM, "0x17673de73ca1761597b160004b2b278a00c2a4a5");
      });
    });
  });

  describe("chain => ethereum", () => {
    describe("bridge", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bridgeInterface,
          hanlder: depositEvent,
          hash: "0xbd8b5cfd7932c2d2cd30b7e67e0aa947ed85dd2c0e736f04556ffbde93379466",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x06a555f62fa48c1a1f2889492e363f3b65d8badd");
      });

      it("should return contribution on claim", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bridgeInterface,
          hanlder: claimEvent,
          hash: "0xeec299b2c2811bdb2b185f69c07fedc632ab4295c2db82f064594ce5b9e55edc",
          signature: CLAIM,
        });

        expectContribution(protocolValue, Label.CLAIM, "0x67873cf017f256875f78d32d176df51a72d830fe");
      });
    });
  });
});
