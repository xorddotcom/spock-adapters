import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { transferEvent } from "./index";
import beefyAdapter from "./index";
import { Label, TRANSFER, beefyVaultInterface, getVaultsAddresses } from "./utils";
import { constants } from "@spockanalytics/base";

describe("beefy", () => {
  describe("chain => polygon", () => {
    describe("transfer", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          address: getVaultsAddresses,
          chain: constants.Chain.POLYGON,
          contractInterface: beefyVaultInterface,
          hanlder: transferEvent,
          hash: "0x5100c4a127a73a4a65b894c8e0e3fd43a3c72b12a56169319ae8c3bb900f7d4a",
          signature: TRANSFER,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x38019cd45c8543fb450ca80661be95ce65cd104a");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: beefyVaultInterface,
          hanlder: transferEvent,
          hash: "0x71a0030fe3bc020bbd222d0d1c1ed09efb7eeaff23f880c8a55415e508da9bc2",
          signature: TRANSFER,
        });

        expectExtraction(protocolValue, Label.WITHDRAW, "0xfe9deaed889afa4b85a2d67734293dfe5ebd176f");
      });
    });
  });

  testTvl(beefyAdapter);
});
