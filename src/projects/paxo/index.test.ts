import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { mintEvent, redeemEvent, borrowEvent, repayEvent } from "./index";
import paxoAdapter from "./index";
import { MINT, REDEEM, BORROW, REPAY, Label, marketInterface } from "./utils";
import { constants } from "@spockanalytics/base";

describe("paxo", () => {
  describe("chain => Polygon", () => {
    describe("market", () => {
      it("should return contribution on mint", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: marketInterface,
          hanlder: mintEvent,
          hash: "0xea849749c78f1c58b08a39db0d31fa365fe848701563cc3987335cfd5f472ab8",
          signature: MINT,
        });

        expectContribution(protocolValue, Label.LEND, "0xc8fbec860339fa461c1192f37a48b10857e24525");
      });

      it("should return extraction on redeem", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: marketInterface,
          hanlder: redeemEvent,
          hash: "0x3bffadd75d589b8af9b16d7f580f774a0e000d3d41b265997f758f96c202d3e8",
          signature: REDEEM,
        });

        expectExtraction(protocolValue, Label.REDEEM, "0x1d72c5ec4ae74ef80c51bbbd3433cf6a2ed21ea0");
      });

      it("should return contribution on borrow", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: marketInterface,
          hanlder: borrowEvent,
          hash: "0xa03eb31722eaa3b980b64877f5ffa449bdb141c574685a4da5655dab4a2e477b",
          signature: BORROW,
        });

        expectContribution(protocolValue, Label.BORROW, "0x7e0474850956f249f175d138b57f1d525dd96629");
      });

      it("should return contribution on repay", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: marketInterface,
          hanlder: repayEvent,
          hash: "0xd8dafda919b9df887aa0514a30bdbe2a3634422f3b1efe362dbdda8514eabab6",
          signature: REPAY,
        });

        expectContribution(protocolValue, Label.REPAY, "0xf5ba34a83a5f95a0d0bd7119b8f38eb47aafa655");
      });
    });
  });

  testTvl(paxoAdapter);
});
