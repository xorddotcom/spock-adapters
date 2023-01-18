import { extractEvent } from "../../utils/extraction";
import { mintEvent, burnEvent } from "./index";
import { MINT, BURN, Label, bullPair } from "./utils";
import { constants, types } from "@spockanalytics/base";

describe("bullionfx", () => {
  describe("chain => Ethereum", () => {
    describe("pair", () => {
      it.only("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: bullPair,
          hanlder: mintEvent,
          hash: "0x97a82376dcdcb7f2ffb0ed9682c6813205fffcefb51aca51e59701f0262a324c",
          signature: MINT,
        });

        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.CONTRIBUTION,
            label: Label.ADD_LIQUIDITY,
            user: "0xc424c43e934e80332db5ef6d32a1fa2c03c1da6b",
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
            label: Label.REMOVE_LIQUIDITY,
            user: "",
          }),
        );
        const value = protocolValue ? protocolValue.value : undefined;
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
