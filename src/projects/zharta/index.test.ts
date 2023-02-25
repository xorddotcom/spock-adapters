import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { depositEvent, withdrawalEvent, loanCreatedEvent, loanPaidEvent } from "./index";
import zhartaAdapter from "./index";
import { Label, poolInterface, DEPOSIT, WITHDRAWAL, loansInterface, LOAN_CREATED, LOAN_PAID } from "./utils";
import { constants } from "@spockanalytics/base";

describe("zharta", () => {
  describe("chain => Ethereum", () => {
    describe("pool", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: poolInterface,
          hanlder: depositEvent,
          hash: "0x3f438f2db5f8007865a48027c9c90b9220bc55fc485243e964d1acdbf5ed3f59",
          signature: DEPOSIT,
        });

        expectContribution(protocolValue, Label.DEPOSIT, "0x24fd699168a4f4b5f38b555985df600533339f66");
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: poolInterface,
          hanlder: withdrawalEvent,
          hash: "0x2cd073d862d639e2a24a2a8dd1c827ce3dcf14be548a9e102b7f08b2c6969a5e",
          signature: WITHDRAWAL,
        });

        expectExtraction(protocolValue, Label.WITHDRAWAL, "0x24fd699168a4f4b5f38b555985df600533339f66");
      });
    });

    describe("loans", () => {
      it("should return amount of new loan", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: loansInterface,
          hanlder: loanCreatedEvent,
          hash: "0x2b46c11d593a064354cd4cdb15b671f929841267b53cad0a6222768e37e74eea",
          signature: LOAN_CREATED,
        });

        expectContribution(protocolValue, Label.LOAN_CREATED, "0x6a6177790d52b37294a4ad6f09fac561fd90f260");
      });

      it("should return amount of paid loan", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: loansInterface,
          hanlder: loanPaidEvent,
          hash: "0x33af5519cd060d20fe23c682109cfc4cf8948b726e5f91327e13ab958823918c",
          signature: LOAN_PAID,
        });

        expectContribution(protocolValue, Label.LOAN_PAID, "0x6a6177790d52b37294a4ad6f09fac561fd90f260");
      });
    });
  });

  testTvl(zhartaAdapter);
});
