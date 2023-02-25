import { ChainRecord } from "../types/chain";
import { testTvlAdapter } from "./calculateTVL";
import { constants, types } from "@spockanalytics/base";

const MAX_TIMEOUT = 10 * 60 * 1000;

const CHAIN_NAME: ChainRecord<string> = {
  [constants.Chain.BSC]: "BSC",
  [constants.Chain.ETHEREUM]: "Ethereum",
  [constants.Chain.POLYGON]: "Polygon",
};

export function testTvl(adapter: types.Adapter) {
  const tvlExtractors = adapter.tvlExtractors ?? {};
  const extractorTests: Array<{ chain: constants.Chain; name: string; tvlExtractor: types.TvlExtractor }> = (
    Object.keys(tvlExtractors) as unknown as constants.Chain[]
  ).flatMap((chain) =>
    (tvlExtractors[chain] ?? [])?.map((tvlExtractor) => ({
      chain,
      name: CHAIN_NAME[chain],
      tvlExtractor,
    })),
  );

  describe("tvl", () => {
    it.each(extractorTests)(
      "should return $name $tvlExtractor.category value",
      async ({ chain, name, tvlExtractor: { category, extractor } }) => {
        const data = await testTvlAdapter(chain, extractor);
        console.log({ chain: name, category, ...data });
        expect(data).toBeDefined();
        expect(data.tvl).toBeGreaterThanOrEqual(0);
      },
      MAX_TIMEOUT,
    );
  });
}

function expectProtocolValue(
  protocolValue: types.ProtocolValueReturnType | void,
  type: types.ProtocolValueType,
  label: string,
  user: string,
) {
  expect(protocolValue).toBeDefined();
  expect(protocolValue).toEqual(expect.objectContaining({ type, label, user }));
  const value = protocolValue ? protocolValue.value : undefined;
  expect(value).toBeGreaterThan(0);
}

export function expectContribution(protocolValue: types.ProtocolValueReturnType | void, label: string, user: string) {
  expectProtocolValue(protocolValue, types.ProtocolValueType.CONTRIBUTION, label, user);
}

export function expectExtraction(protocolValue: types.ProtocolValueReturnType | void, label: string, user: string) {
  expectProtocolValue(protocolValue, types.ProtocolValueType.EXTRACTION, label, user);
}
