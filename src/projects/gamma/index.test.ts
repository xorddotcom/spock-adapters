import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import GammaAdapter, { handleEvent } from "./index";
import { DEPOSIT, Dex, EventType, Label, WITHDRAW, hypervisorInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Gamma", () => {
  describe("chain => BSC", () => {
    describe("Hypervisor", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: hypervisorInterface,
          hanlder: (event) => handleEvent(event, Dex.UNISWAP_V3, EventType.DEPOSIT),
          hash: "0xbf15454a4dca5a85f13df87598cf213315e2a51a3e62e4302e53b7ce2b8226c7",
          signature: DEPOSIT,
        });
        expectContribution(
          protocolValue,
          `${Label.ADD_LIQUIDITY} (${Dex.UNISWAP_V3})`,
          "0xade38bd2e8d5a52e60047affe6e595bb5e61923a",
        );
      }, 50000);

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: hypervisorInterface,
          hanlder: (event) => handleEvent(event, Dex.UNISWAP_V3, EventType.WITHDRAW),
          hash: "0xb344a11b8f482428dfc4070b94e6c018011d73ddc2ef730a27f29217adb49bc4",
          signature: WITHDRAW,
        });
        expectExtraction(
          protocolValue,
          `${Label.REMOVE_LIQUIDITY} (${Dex.UNISWAP_V3})`,
          "0xa000bce4ce3d1b3ac63c2e0488ce76fbdb9de764",
        );
      }, 50000);
    });
  });

  testTvl(GammaAdapter);
});
