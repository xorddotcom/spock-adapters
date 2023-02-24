import { BaseContract } from "@ethersproject/contracts";
import { abi, constants, types } from "@spockanalytics/base";

export type PoolInfoExtracter = (
  address: string,
  chain: constants.Chain,
) => Promise<{ token0: string; token1: string }>;

export type PoolInfo = {
  address: string;
  token0: types.IToken;
  token1: types.IToken;
};

export class Pool {
  private readonly poolInfoExtracter: PoolInfoExtracter;

  constructor(poolInfo: PoolInfoExtracter) {
    this.poolInfoExtracter = poolInfo;
  }

  async getPool(address: string, chain: constants.Chain): Promise<PoolInfo | undefined> {
    try {
      const poolInfo = await this.poolInfoExtracter(address, chain);
      if (poolInfo) {
        const tokens = await Promise.all([
          new abi.Token(poolInfo.token0, chain).metaData(),
          new abi.Token(poolInfo.token1, chain).metaData(),
        ]);
        return { address, token0: tokens[0], token1: tokens[1] };
      }
    } catch (e) {
      return undefined;
    }
  }
}

export function uniswapV2_Pair<T extends BaseContract>(
  contractInterface: abi.CallContractInterface<T>,
): PoolInfoExtracter {
  return async (address: string, chain: constants.Chain): ReturnType<PoolInfoExtracter> => {
    const calls = [
      new abi.Call<T>({ address, contractInterface, fragment: "token0" }),
      new abi.Call<T>({ address, contractInterface, fragment: "token1" }),
    ];
    const result = await abi.Multicall.execute({ chain, calls });

    return { token0: result[0].output, token1: result[1].output };
  };
}
