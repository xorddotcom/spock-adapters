import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction } from "../../utils/testing";
import { transferEvent } from "./index";
import { Label, TRANSFER, beefyVaultInterface, getVaultsAddresses } from "./utils";
import { constants } from "@spockanalytics/base";

describe("beefy", () => {
  describe("chain => polygon", () => {
    describe("transfer", () => {
      it.only("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          address: getVaultsAddresses,
          chain: constants.Chain.POLYGON,
          contractInterface: beefyVaultInterface,
          hanlder: transferEvent,
          hash: "0x5100c4a127a73a4a65b894c8e0e3fd43a3c72b12a56169319ae8c3bb900f7d4a",
          signature: TRANSFER,
        });

        console.log({ protocolValue });

        expectContribution(protocolValue, Label.DEPOSIT, "0x38019cd45c8543fb450ca80661be95ce65cd104a");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: beefyVaultInterface,
          hanlder: transferEvent,
          hash: "0xb95fc2dea25ac3604f9aef90e4ebb2b5f75b3f9d339c013e642ca60298967db2",
          signature: TRANSFER,
        });

        expectExtraction(protocolValue, Label.WITHDRAW, "0x86185b7a03499e70ed3ebdc65afb88a0d19aae24");
      });
    });
  });
});
