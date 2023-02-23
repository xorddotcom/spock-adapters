// export * from "./projects";
import { computeTVL } from "./projects/tetu/tvl";
// import { computeTVL } from "./projects/zharta/tvl";
import { testTvl } from "./utils/calculateTVL";

testTvl(137, computeTVL);
