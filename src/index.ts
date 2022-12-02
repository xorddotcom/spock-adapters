export * from "./projects";

// import { Vault__factory } from "./projects/unipilot/types";
// import { vaultInfo } from "./projects/unipilot/utils";
// import { abi, constants } from "@spockanalytics/base";

// const vault = Vault__factory.createInterface();

// const PILOT_ETH = "0xab170c6bda86b521c16f83e836f6b4fecb867508";
// const ABC = "0x1ae1df64bf695ea1f1a7ebdc280af712340f09a9";
// const PILOT = "0x37C997B35C619C21323F3518B9357914E8B99525";
// const MKR = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2";

// const main = async () => {
//   //   const res = await abi.Multicall.singleCall({
//   //     address: PILOT_ETH,
//   //     chain: constants.Chain.ETHEREUM,
//   //     contractInterface: vault,
//   //     fragment: "getVaultInfo",
//   //   });

//   //   const res = await abi.Multicall.multipleContractSingleData({
//   //     address: [PILOT_ETH, ABC],
//   //     chain: constants.Chain.ETHEREUM,
//   //     contractInterface: vault,
//   //     fragment: "getVaultInfo",
//   //   });

//   const res = await new abi.Token(PILOT).balanceOf("0xafa13aa8f1b1d89454369c28b0ce1811961a7907");

//   console.log({ res: res.balance.toString() });

//   // const vault = await vaultInfo(PILOT_ETH, constants.Chain.ETHEREUM);
//   // console.log({ vault });
// };

// // const ab = [
// //     "0xafa13aa8f1b1d89454369c28b0ce1811961a7907",
// //     "0xc9256e6e85ad7ac18cd9bd665327fc2062703628",
// //   ]

// main();
