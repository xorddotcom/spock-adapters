import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import gammaAdapter, { depositEvent, withdrawEvent } from "./index";
import { DEPOSIT, Label, WITHDRAW, hypervisorInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("Gamma", () => {
  describe("Hypervisor", () => {
    it("should return contribution on deposit", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.ETHEREUM,
        contractInterface: hypervisorInterface,
        hanlder: depositEvent,
        hash: "0xb5b9259f61b24ba48f2aeb3be64a655378b0e29ec7f0f14408b0d2c3046126c8",
        signature: DEPOSIT,
      });
      expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0xade38bd2e8d5a52e60047affe6e595bb5e61923a");
    }, 30000);

    it("should return extraction on withdraw", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.ETHEREUM,
        contractInterface: hypervisorInterface,
        hanlder: withdrawEvent,
        hash: "0xe4dee4084ed6d23ac21e7816e44812638a20865fd237dd4c254ffc9b713ab70d",
        signature: WITHDRAW,
      });
      expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x5069fdcac0305b579500189c284939a7d5a85166");
    }, 30000);
  });

  testTvl(gammaAdapter);
});
