import { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { api, constants, types, utils } from "@spockanalytics/base";

type BalanceInput = { token: types.IToken | { address: string; decimals: number }; balance: BigNumberish };

export async function sumBalancesUSD(
  inputs: BalanceInput[],
  chain: constants.Chain = constants.Chain.ETHEREUM,
  blockNumber?: number,
) {
  const addresses = inputs.map(({ token }) => token.address);
  const prices = await api.moralis.multipleTokenPrices(addresses, chain, blockNumber);

  return inputs.reduce((accum, { token, balance }) => {
    const formattedBalance = formatUnits(balance, token.decimals);
    const ab = utils.BN_Opeartion.mul(formattedBalance, prices[token.address]);
    accum = accum.plus(ab);
    return accum;
  }, utils.BN_Opeartion.ZERO_BN);
}

export async function tokenBalanceUSD(
  { token, balance }: BalanceInput,
  chain: constants.Chain = constants.Chain.ETHEREUM,
  blockNumber?: number,
) {
  const price = await api.moralis.tokenPrice(token.address, chain, blockNumber);
  const formattedBalance = formatUnits(balance, token.decimals);
  return utils.BN_Opeartion.mul(formattedBalance, price);
}
