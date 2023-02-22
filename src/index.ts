// export * from "./projects";
import { computeTVL } from "./projects/tetu/tvl";
import { testTvl } from "./utils/calculateTVL";

testTvl(137, computeTVL);
