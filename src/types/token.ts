import { types } from "@spockanalytics/base";

export type PartialTokenDecimals = Pick<types.IToken, "address" | "decimals">;
