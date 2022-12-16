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
