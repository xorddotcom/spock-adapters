import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import SperaxAdapter, { handleTransfer } from "./index";
import { USDsInterface, Label, TRANSFER } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Sperax", () => {
  describe("chain => Arbitrum", () => {
    describe("USDs", () => {
      it("should return contribution on add collateral", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: USDsInterface,
          hanlder: (event) => handleTransfer(event),
          hash: "0x1106261bc469a64bcd1fa424174f0fa8146503d401a9df1e130651cc389f1ad4",
          signature: TRANSFER,
          eventIndex: 49,
        });

        expectContribution(protocolValue, Label.ADD_COLLATERAL, "0xaa4d101efd2f57dd9e3767f2b850417e7744367e");
      }, 50000);

      it("should return extraction on remove collateral", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: USDsInterface,
          hanlder: (event) => handleTransfer(event),
          hash: "0xcde76ee4b50f6ccb4fc58fa7da9841f7c5664cdaca1a6d7360e59fbdd6e67f3a",
          signature: TRANSFER,
          eventIndex: 3,
        });

        expectExtraction(protocolValue, Label.REMOVE_COLLATERAL, "0xb56e5620a79cfe59af7c0fcae95aadbea8ac32a1");
      }, 50000);
    });
  });

  testTvl(SperaxAdapter);
});
