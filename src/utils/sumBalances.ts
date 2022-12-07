import { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { api, constants, types, utils } from "@spockanalytics/base";

type BalanceInput = { token: types.IToken | { address: string; decimals: number }; balance: BigNumberish };

export async function sumBalancesUSD(
  inputs: BalanceInput[],
  chain: constants.Chain = constants.Chain.ETHEREUM,
  timestamp?: number,
) {
  const addresses = inputs.map(({ token }) => token.address);
  const prices = await api.ankr.multipleTokenPrices(addresses, chain, timestamp);

  return inputs.reduce((accum, { token, balance }) => {
    const formattedBalance = formatUnits(balance, token.decimals);
    accum = accum.plus(utils.BN_Opeartion.mul(formattedBalance, prices[token.address]));
    return accum;
  }, utils.BN_Opeartion.ZERO_BN);
}

export async function tokenBalanceUSD(
  { token, balance }: BalanceInput,
  chain: constants.Chain = constants.Chain.ETHEREUM,
  timestamp?: number,
) {
  const price = await api.ankr.tokenPrice(token.address, chain, timestamp);
  const formattedBalance = formatUnits(balance, token.decimals);
  return utils.BN_Opeartion.mul(formattedBalance, price);
}
