import { extractEvent } from "../../utils/extraction";
import { depositEvent, withdrawalEvent, loanCreatedEvent, loanPaidEvent } from "./index";
import { Label, poolInterface, DEPOSIT, WITHDRAWAL, loansInterface, LOAN_CREATED, LOAN_PAID } from "./utils";
import { constants, types } from "@spockanalytics/base";

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

        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.CONTRIBUTION,
            label: Label.DEPOSIT,
            user: "0x24fd699168a4f4b5f38b555985df600533339f66",
          }),
        );

        const value = protocolValue ? protocolValue.value : undefined;

        expect(value).toBeGreaterThan(0);
      });

      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: poolInterface,
          hanlder: withdrawalEvent,
          hash: "0x2cd073d862d639e2a24a2a8dd1c827ce3dcf14be548a9e102b7f08b2c6969a5e",
          signature: WITHDRAWAL,
        });

        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.EXTRACTION,
            label: Label.WITHDRAWAL,
            user: "0x24fd699168a4f4b5f38b555985df600533339f66",
          }),
        );

        const value = protocolValue ? protocolValue.value : undefined;

        expect(value).toBeGreaterThan(0);
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

        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.CONTRIBUTION,
            label: Label.LOAN_CREATED,
            user: "0x6a6177790d52b37294a4ad6f09fac561fd90f260",
          }),
        );

        const value = protocolValue ? protocolValue.value : undefined;

        expect(value).toBeGreaterThan(0);
      });

      it("should return amount of paid loan", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: loansInterface,
          hanlder: loanPaidEvent,
          hash: "0x33af5519cd060d20fe23c682109cfc4cf8948b726e5f91327e13ab958823918c",
          signature: LOAN_PAID,
        });

        expect(protocolValue).toEqual(
          expect.objectContaining({
            type: types.ProtocolValueType.CONTRIBUTION,
            label: Label.LOAN_PAID,
            user: "0x6a6177790d52b37294a4ad6f09fac561fd90f260",
          }),
        );

        const value = protocolValue ? protocolValue.value : undefined;

        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
