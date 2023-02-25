import { Erc20, Erc20__factory } from "../contracts/types";
import { Block } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { abi, api, constants, types, utils } from "@spockanalytics/base";

export async function calculateTVL(
  block: Block,
  chain: constants.Chain,
  extractor: types.TvlExtractor["extractor"],
  cache?: types.LogsCache,
) {
  const balances = await extractor(chain, block.number, block.timestamp, cache);

  const tokenAddresses = Object.keys(balances);

  if (tokenAddresses.length === 1 && tokenAddresses[0] === "usd") {
    const tvl = parseFloat(balances["usd"]);
    return { tvl };
  }

  const prices = await api.ankr.multipleTokenPrices({
    addresses: tokenAddresses,
    chain,
    toTimestamp: block.timestamp,
  });

  const decimals = await abi.Multicall.multipleContractSingleData<Erc20>({
    address: tokenAddresses,
    chain,
    contractInterface: Erc20__factory.createInterface(),
    fragment: "decimals",
  });

  const { tvl, tokens, tokensInUSD } = tokenAddresses.reduce<{
    tvl: number;
    tokens: Record<string, number>;
    tokensInUSD: Record<string, number>;
  }>(
    (accum, tokenAddress, index) => {
      const formattedBalance = formatUnits(balances[tokenAddress], decimals[index].output);
      const price = prices[tokenAddress];
      const balanceUSD = parseFloat(utils.BN_Opeartion.mul(formattedBalance, price).toString());

      accum["tvl"] = parseFloat(utils.BN_Opeartion.add(balanceUSD, accum["tvl"]).toString());
      accum["tokens"][tokenAddress] = parseFloat(formattedBalance);
      accum["tokensInUSD"][tokenAddress] = balanceUSD;
      return accum;
    },
    { tvl: 0, tokens: {}, tokensInUSD: {} },
  );

  return { tvl, tokens, tokensInUSD };
}

export async function testTvlAdapter(
  chain: constants.Chain,
  extractor: types.TvlExtractor["extractor"],
  block?: number,
) {
  const blockData = await abi.Web3Node.getBlock(chain, block ?? "latest");
  return await calculateTVL(blockData, chain, extractor);
}
