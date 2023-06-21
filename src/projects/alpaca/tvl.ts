import { SummedBalances, sumMultipleBalance } from "../../utils/sumBalances";
import { abi, constants } from "@spockanalytics/base";
import axios from "axios";
import { Interface } from "ethers/lib/utils";

async function getMoneyMarket() {
  const moneyMarketRes = await axios.get(
    "https://raw.githubusercontent.com/alpaca-finance/alpaca-v2-money-market/main/.mainnet.json",
  );
  return {
    moneyMarketDiamond: moneyMarketRes.data?.moneyMarket?.moneyMarketDiamond,
    markets: moneyMarketRes.data?.moneyMarket?.markets?.map((e: { token: string }) => e.token),
  };
}

export async function computeLendingTVL(chain: constants.Chain, block: number) {
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

export async function computeBorrowTVL(chain: constants.Chain, block: number) {
  const balances: SummedBalances = {};

  const { moneyMarketDiamond, markets }: { moneyMarketDiamond: string; markets: string[] } = await getMoneyMarket();

  const debtValues = await abi.Multicall.singleContractMultipleData({
    address: moneyMarketDiamond,
    blockNumber: block,
    chain,
    fragment: "getGlobalDebtValueWithPendingInterest",
    contractInterface: new Interface([
      "function getGlobalDebtValueWithPendingInterest(address _token) external view returns (uint256)",
    ]),
    callInput: markets,
  });

  markets.forEach((e, i) => {
    balances[e.toLowerCase()] = debtValues[i].output.toString();
  });

  return balances;
}
