import { SummedBalances, sumMultipleBalance } from "../../utils/sumBalances";
import { abi, constants } from "@spockanalytics/base";
import axios from "axios";

async function getMoneyMarket() {
  const moneyMarketRes = await axios.get(
    "https://raw.githubusercontent.com/alpaca-finance/alpaca-v2-money-market/main/.mainnet.json",
  );
  return {
    moneyMarketDiamond: moneyMarketRes.data?.moneyMarket?.moneyMarketDiamond,
    markets: moneyMarketRes.data?.moneyMarket?.markets?.map((e: { token: string }) => e.token),
  };
}

export async function computeTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const { moneyMarketDiamond, markets }: { moneyMarketDiamond: string; markets: string[] } = await getMoneyMarket();

  const marketBalancesInput = markets.map((tokenAddress: string) => {
    return {
      token: tokenAddress,
      owner: moneyMarketDiamond,
    };
  });

  const marketBalances = await abi.erc20MultiBalanceOf(marketBalancesInput, chain, block);

  sumMultipleBalance(balances, marketBalances);

  return balances;
}
