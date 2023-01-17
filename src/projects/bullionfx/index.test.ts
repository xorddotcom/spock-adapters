import { extractEvent } from "../../utils/extraction";
import { mintEvent, burnEvent } from "./index";
import { MINT, BURN, Label, bullPair } from "./utils";
import { constants, types } from "@spockanalytics/base";

describe.skip("bullionfx", () => {
  describe("chain => Ethereum", () => {
    describe("pair", () => {
      it("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: mintEvent,
          hash: "",
          signature: MINT,
        });
        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.CONTRIBUTION,
            label: Label.DEPOSIT,
            user: "",
          }),
        );
        const value = protocolValue ? protocolValue.value : undefined;
        expect(value).toBeGreaterThan(0);
      });

      it("should return extraction on burn", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: burnEvent,
          hash: "",
          signature: BURN,
        });
        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.EXTRACTION,
            label: Label.WITHDRAW,
            user: "",
          }),
        );
        const value = protocolValue ? protocolValue.value : undefined;
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
