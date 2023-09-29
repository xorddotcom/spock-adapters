import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import { depositEvent, withdrawEvent, stakeOrUnsatkeEvent } from "./index";
import unipilotAdapter from "./index";
import { DEPOSIT, WITHDRAW, STAKE_OR_UNSTAKE_OR_CLAIN, vault, staking, Label } from "./utils";
import { constants } from "@spockanalytics/base";

describe("unipilot", () => {
  describe("chain => Ethereum", () => {
    describe("vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: vault,
          hanlder: depositEvent,
          hash: "0x384a0a4f3718ba92ffa9d93f6659f50a0f10f7877e964b41465231466fbd396c",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0x8edd5f3cad0c1b6b2a5a36f8893c83d3df352692");
      });
      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: vault,
          hanlder: withdrawEvent,
          hash: "0xb4255b55ad484b3b60e300fd1cda2c7039435eb3c2e87392222b34be092a8d90",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x8edd5f3cad0c1b6b2a5a36f8893c83d3df352692");
      });
    });
    describe("staking", () => {
      it("should return contribution on staking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: staking,
          hanlder: stakeOrUnsatkeEvent,
          hash: "0x651c3fe554e9da20c974448b080d2a580627b016d2eed3e286409471bc956b5c",
          signature: STAKE_OR_UNSTAKE_OR_CLAIN,
        });
        expectContribution(protocolValue, Label.STAKE, "0xbfd62552f91aa7df5080f1e8c8c03c1ec7f99f6d");
      });
      it("should return extraction on unstaking", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ETHEREUM,
          contractInterface: staking,
          hanlder: stakeOrUnsatkeEvent,
          hash: "0x9d1d7ab65e90bd23538dfd0185426845208436d4c93f84a56eeeffc946b058f2",
          signature: STAKE_OR_UNSTAKE_OR_CLAIN,
        });
        expectExtraction(protocolValue, Label.UNSTAKE, "0x3c42c9df2bb1bb114f404ae16fdad203b48f4199");
      });
    });
  });

  describe("chain => Polygon", () => {
    describe("vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: vault,
          hanlder: depositEvent,
          hash: "0x613fb1ee33fcb7d5386a88280feeb6aa3ff1f8091f03c8f9cf2b7a6ddc8ed67f",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0x4c16f507ab1264014cef4c7f703dcae0f9bf34c7");
      });
      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.POLYGON,
          contractInterface: vault,
          hanlder: withdrawEvent,
          hash: "0x9be1a489973102b254254f83ef86ae7249631277a3193921088a4187bd7ea266",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x35ed2d8a163d1b1aacd11891baea6cd0ce8812fc");
      });
    });
  });

  describe("chain => BSC", () => {
    describe("vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: vault,
          hanlder: depositEvent,
          hash: "0x34b1e32385a12175a489d08c7574600ff447aadc07788d9a18eb4e918ed5f78f",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0x3a4961a71be671f2b19a9156441586865cfeee53");
      });
      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.BSC,
          contractInterface: vault,
          hanlder: withdrawEvent,
          hash: "0xe96f7b9f7916a35589b4d0029db1977f05283bd7ac8390a89f9fbbbd05214ed0",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x1e13e5b5acbb0c3f0fde50fe7661fdf75df8f932");
      });
    });
  });

  describe("chain => Arbitrum", () => {
    describe("vault", () => {
      it("should return contribution on deposit", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: vault,
          hanlder: depositEvent,
          hash: "0x5f4cf2763fb76c78f4fac9cd68313b674c1291a6fecc7b154d941f88d9d8c9b0",
          signature: DEPOSIT,
        });
        expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0x8a83716acd66d9e1fb18c9b79540b72e04f80ac0");
      });
      it("should return extraction on withdraw", async () => {
        const protocolValue = await extractEvent({
          chain: constants.Chain.ARBITRUM_ONE,
          contractInterface: vault,
          hanlder: withdrawEvent,
          hash: "0x317b0725f95bb1d3c22161b890df28396bc2a0d08f42aba4f6305b26bb8b533d",
          signature: WITHDRAW,
        });
        expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x8a83716acd66d9e1fb18c9b79540b72e04f80ac0");
      });
    });
  });

  // testTvl(unipilotAdapter);
});
