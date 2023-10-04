import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import SperaxAdapter, { handleTransfer, handleDeposit, handleWithdraw } from "./index";
import { USDsInterface, Label, TRANSFER, VeSPAInterface, DEPOSIT, WITHDRAW } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Sperax", () => {
  describe("chain => Arbitrum", () => {
    describe("USDs", () => {
      it("should return contribution on add collateral", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: USDsInterface,
          hanlder: handleTransfer,
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
          hanlder: handleTransfer,
          hash: "0xcde76ee4b50f6ccb4fc58fa7da9841f7c5664cdaca1a6d7360e59fbdd6e67f3a",
          signature: TRANSFER,
          eventIndex: 3,
        });

        expectExtraction(protocolValue, Label.REMOVE_COLLATERAL, "0xb56e5620a79cfe59af7c0fcae95aadbea8ac32a1");
      }, 50000);

      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: VeSPAInterface,
          hanlder: handleDeposit,
          hash: "0x9b0939b128b2b017dd1b4130de6323663f2b076328af469fc281a8cd46d8728d",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.STAKE, "0x7957b2891f443873fdcd9dd698b73d648520f79a");
      }, 50000);

      it("should return extraction on withdrawal", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: VeSPAInterface,
          hanlder: handleWithdraw,
          hash: "0x228409a84c26c02d965676016199ad0624f6eddd721db0f0cce91805f2e8dba5",
          signature: WITHDRAW,
        });

        expectExtraction(protocolValue, Label.UNSTAKE, "0xfc8333829a69d922b9d691f4d76185bdf4f47642");
      }, 50000);
    });
  });

  testTvl(SperaxAdapter);
});
