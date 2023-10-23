import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction } from "../../utils/testing";
import { tokensSwappedEvent, createPositionEvent, withdrawPositionEvent, modifyPositionEvent } from "./index";
import {
  TOKENS_SWAPPED,
  CREATE_POSITION,
  WITHDRAW_POSITION,
  MODIFY_POSITION,
  aggregatorInterface,
  dcaInterface,
  Label,
} from "./utils";
import { constants } from "@spockanalytics/base";

describe("dzap", () => {
  describe("chain => Ethereum", () => {
    describe("Aggregator", () => {
      it("should return contribution on tokens swap", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: aggregatorInterface,
          hanlder: tokensSwappedEvent,
          hash: "0x7828effdf80f00678ca112f1cb1a6bc6e96369a9a9bdde23817c6590fe015388",
          signature: TOKENS_SWAPPED,
        });
        expectContribution(
          protocolValue,
          Label.TOKENS_SWAPPED + "(Batch-Sell)",
          "0xe4675fb7f995c5ba264e59480cbe4a45ac60d6ce",
        );
      });
    });
  });

  describe("chain => Polygon", () => {
    describe("Aggregator", () => {
      it("should return contribution on tokens swap (Single-Swap)", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorInterface,
          hanlder: tokensSwappedEvent,
          hash: "0xd976ae27ab3ca1d949bc4b266faea8af32baa6302161760a08ac380b69242cb1",
          signature: TOKENS_SWAPPED,
        });
        expectContribution(
          protocolValue,
          Label.TOKENS_SWAPPED + "(Single-Swap)",
          "0x2569ef572a71980ea23bda1f7b11ff5ec74d8a7b",
        );
      });

      it("should return contribution on tokens swap (Batch-Buy)", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorInterface,
          hanlder: tokensSwappedEvent,
          hash: "0xa9076a983f3aa4261c31f5b512ab707a929f34918e1de80b1b9d28cf9d7436cf",
          signature: TOKENS_SWAPPED,
        });
        expectContribution(
          protocolValue,
          Label.TOKENS_SWAPPED + "(Batch-Buy)",
          "0xaef4bbaa8fd278302ece4c51a78c1216dc514164",
        );
      });

      it("should return contribution on tokens swap (Batch-Sell)", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: aggregatorInterface,
          hanlder: tokensSwappedEvent,
          hash: "0x01bf2a5a37b8284daefa5d09f5293928bf1cec755962e545b59c67e4e8289f39",
          signature: TOKENS_SWAPPED,
        });
        expectContribution(
          protocolValue,
          Label.TOKENS_SWAPPED + "(Batch-Sell)",
          "0xe4675fb7f995c5ba264e59480cbe4a45ac60d6ce",
        );
      });
    });

    describe("DCA", () => {
      it("should return contribution on creating position", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: dcaInterface,
          hanlder: createPositionEvent,
          hash: "0x6cabe560c3ea8574f79c99884ac21df0b1b82b47bebb212aa3e2b855549dc098",
          signature: CREATE_POSITION,
        });
        expectContribution(protocolValue, Label.CREATE_POSITION, "0x52f6036a6b9fc1e9d2d6465e49a3bf43d220ecfd");
      });

      it("should return extraction on withdrawing position", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: dcaInterface,
          hanlder: withdrawPositionEvent,
          hash: "0x45925c01240af41886e9242c95ccaf3237b21af5dc841be7a540323535166255",
          signature: WITHDRAW_POSITION,
        });
        expectExtraction(protocolValue, Label.WITHDRAW_POSITION, "0x52f6036a6b9fc1e9d2d6465e49a3bf43d220ecfd");
      });

      it("should return contribution on modifying position by increasing asset", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: dcaInterface,
          hanlder: modifyPositionEvent,
          hash: "0x83cadf90c6d3a7f8ad17dfb8585637e641ae2753389a69996ad0e7706b90abd3",
          signature: MODIFY_POSITION,
        });
        expectContribution(
          protocolValue,
          Label.MODIFY_POSITION + "(Increase)",
          "0x2cb99f193549681e06c6770ddd5543812b4fafe8",
        );
      });

      it("should return extraction on modifying position by decreasing asset", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: dcaInterface,
          hanlder: modifyPositionEvent,
          hash: "0xb0bb6439402ca44b63c96946359d4775d12d9f05b674790928053471af9b4c81",
          signature: MODIFY_POSITION,
        });
        expectExtraction(
          protocolValue,
          Label.MODIFY_POSITION + "(Decrease)",
          "0xa957394a29f2a0c29857e010d6ee7c7f12a8f0e8",
        );
      });
    });
  });
});
