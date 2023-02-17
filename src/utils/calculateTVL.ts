import { Erc20, Erc20__factory } from "../contracts/types";
import { formatUnits } from "@ethersproject/units";
import { abi, api, constants, types, utils } from "@spockanalytics/base";

async function calculateTVL(block: number, chain: constants.Chain, extractor: types.TvlExtractor["extractor"]) {
  const blockData = await abi.Web3Node.provider(chain).getBlock(block);

  const balances = await extractor(chain, block, blockData.timestamp);
  console.log({ balances });

  const tokenAddresses = Object.keys(balances);
  const prices = await api.ankr.multipleTokenPrices({
    addresses: tokenAddresses,
    chain,
    toTimestamp: blockData.timestamp,
  });

  console.log({ prices });

  const decimals = await abi.Multicall.multipleContractSingleData<Erc20>({
    address: tokenAddresses,
    chain,
    contractInterface: Erc20__factory.createInterface(),
    fragment: "decimals",
  });

  const tvl = tokenAddresses.reduce<{ tvl: string; tokensUSD: Record<string, string> }>(
    (accum, tokenAddress, index) => {
      const formattedBalance = formatUnits(balances[tokenAddress], decimals[index]);
      const price = prices[tokenAddress];
      const balanceUSD = utils.BN_Opeartion.mul(formattedBalance, price).toString();

      accum["tvl"] = utils.BN_Opeartion.add(balanceUSD, accum["tvl"]).toString();
      accum["tokensUSD"][tokenAddress] = balanceUSD;
      return accum;
    },
    { tvl: "0", tokensUSD: {} },
  );

  console.log({ tvl });
}

export async function testTvl(chain: constants.Chain, extractor: types.TvlExtractor["extractor"]) {
  const currentBlock = await abi.Web3Node.currentBlock(chain);
  await calculateTVL(currentBlock, chain, extractor);
}
