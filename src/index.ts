// export * from "./projects";
import { pairAddresses, bull_Pair } from "./projects/bullionfx/utils";
import { vaultAddresses } from "./projects/tetu/utils";

const main = async () => {
  // const pairs = await pairAddresses(1);
  // console.log({ pairs });

  // const vaults = await vaultAddresses(1);
  // console.log({ vaults });

  const pair = await bull_Pair.getPool("0xc044b084e3fBF5179A14b1af382c85F6F4C2202d", 1);
  console.log({ pair: pair?.token0.totalSupply.toString() });
};
main();
