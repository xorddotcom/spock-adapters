import { PartialTokenDecimals } from "../types/token";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { abi, api, constants, types, utils } from "@spockanalytics/base";

export type USDBalanceInput = { token: types.IToken | PartialTokenDecimals; balance: BigNumberish };
export type SummedBalances = Record<string, string>;

export async function sumBalancesUSD(
  inputs: USDBalanceInput[],
  chain: constants.Chain = constants.Chain.ETHEREUM,
  timestamp?: number,
) {
  const addresses = inputs.map(({ token }) => token.address);
  const prices = await api.ankr.multipleTokenPrices({ addresses, chain, toTimestamp: timestamp });

  return inputs.reduce((accum, { token, balance }) => {
    const formattedBalance = formatUnits(balance, token.decimals);
    accum = accum.plus(utils.BN_Opeartion.mul(formattedBalance, prices[token.address]));
    return accum;
  }, utils.BN_Opeartion.ZERO_BN);
}

export async function tokenBalanceUSD(
  { token, balance }: USDBalanceInput,
  chain: constants.Chain = constants.Chain.ETHEREUM,
  timestamp?: number,
) {
  const price = await api.ankr.tokenPrice(token.address, chain, timestamp);
  const formattedBalance = formatUnits(balance, token.decimals);
  return utils.BN_Opeartion.mul(formattedBalance, price);
}

export function sumSingleBalance(balances: SummedBalances, address: string, amount: BigNumber | string | number) {
  if (!amount) throw new Error("Amount not be undefined");

  if (typeof amount === "number" || typeof amount === "string") {
    amount = BigNumber.from(amount);
  }

  address = address.toLowerCase();
  const tokenAmount = balances[address] ?? "0";
  balances[address] = amount.add(tokenAmount).toString();
}

export function sumMultipleBalance(
  balances: SummedBalances,
  erc20MultipleBalances: Awaited<ReturnType<typeof abi.erc20MultiBalanceOf>>,
) {
  erc20MultipleBalances.map(({ token, balance }) => sumSingleBalance(balances, token, balance));
}
