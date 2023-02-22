// export * from "./projects";
// import { computeTVL } from "./projects/unipilot/tvl";
// import { computeTVL } from "./projects/bullionfx/tvl";
import { PILOT, PILOT_STAKING } from "./projects/unipilot/utils";
import { testTvl } from "./utils/calculateTVL";
import { stakingTvl } from "./utils/staking";

// testTvl(1, computeTVL);
testTvl(1, stakingTvl(PILOT_STAKING, PILOT.address));
