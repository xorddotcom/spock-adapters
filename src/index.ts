// export * from "./projects";
import { computeTVL } from "./projects/unipilot/tvl";
import { testTvl } from "./utils/calculateTVL";

testTvl(1, computeTVL);
