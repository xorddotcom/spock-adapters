import { ChainRecord } from "../types/chain";
import { constants } from "@spockanalytics/base";

// wrapped token for chain native
export const WRAPPED_NATIVE_TOKEN: ChainRecord<string> = {
  [constants.Chain.ARBITRUM_ONE]: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", //WETH
  [constants.Chain.AVALANCHE]: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7", //WAVAX
  [constants.Chain.BSC]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", //WBNB
  [constants.Chain.ETHEREUM]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", //WETH
  [constants.Chain.FANTOM]: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83", //WFTM
  [constants.Chain.OPTIMISM]: "0x4200000000000000000000000000000000000006", //WETH
  [constants.Chain.POLYGON]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", //WMATIC
};
