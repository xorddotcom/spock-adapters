import { extractEvent } from "../../utils/extraction";
import { expectContribution, expectExtraction, testTvl } from "../../utils/testing";
import alpacaAdapter from "./index";
import { depositEvent, withdrawEvent } from "./index";
import { DEPOSIT, InterestBearingTokenInterface, Label, WITHDRAW } from "./utils";
import { constants } from "@spockanalytics/base";

describe("alpaca", () => {
  describe("Interest Bearing Token", () => {
    it("should return contribution on deposit", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.BSC,
        contractInterface: InterestBearingTokenInterface,
        hanlder: depositEvent,
        hash: "0x8a2700bb365ea6f26ff4de49014a1fa5e6e0e554cea03c7aceba2439798d8045",
        signature: DEPOSIT,
      });

      expectContribution(protocolValue, Label.DEPOSIT, "0xd20b887654db8dc476007bdca83d22fa51e93407");
    });

    it("should return extraction on withdraw", async () => {
      const protocolValue = await extractEvent({
        chain: constants.Chain.BSC,
        contractInterface: InterestBearingTokenInterface,
        hanlder: withdrawEvent,
        hash: "0x499dc8cbfd870825ffa6d2d46773de056399190909d8c800cde1c292cf84bb41",
        signature: WITHDRAW,
      });

      expectExtraction(protocolValue, Label.WITHDRAW, "0xd20b887654db8dc476007bdca83d22fa51e93407");
    });
  });

  testTvl(alpacaAdapter);
});
