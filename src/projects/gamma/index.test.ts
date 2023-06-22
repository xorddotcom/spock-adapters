import { extractEvent } from "../../utils/extraction";
import { testTvl, expectContribution, expectExtraction } from "../../utils/testing";
import gammaAdapter, { depositEvent, withdrawEvent } from "./index";
import unipilotAdapter from "./index";
import { constants } from "@spockanalytics/base";

describe("Gamma", () => {
  // describe("Hypervisor", () => {
  //   it("should return contribution on deposit", async () => {
  //     const protocolValue = await extractEvent({
  //       chain: constants.Chain.ETHEREUM,
  //       contractInterface: vault,
  //       hanlder: depositEvent,
  //       hash: "0x384a0a4f3718ba92ffa9d93f6659f50a0f10f7877e964b41465231466fbd396c",
  //       signature: DEPOSIT,
  //     });
  //     expectContribution(protocolValue, Label.ADD_LIQUIDITY, "0x8edd5f3cad0c1b6b2a5a36f8893c83d3df352692");
  //   });
  //   it("should return extraction on withdraw", async () => {
  //     const protocolValue = await extractEvent({
  //       chain: constants.Chain.ETHEREUM,
  //       contractInterface: vault,
  //       hanlder: withdrawEvent,
  //       hash: "0xb4255b55ad484b3b60e300fd1cda2c7039435eb3c2e87392222b34be092a8d90",
  //       signature: WITHDRAW,
  //     });
  //     expectExtraction(protocolValue, Label.REMOVE_LIQUIDITY, "0x8edd5f3cad0c1b6b2a5a36f8893c83d3df352692");
  //   });
  // });

  testTvl(gammaAdapter);
});
