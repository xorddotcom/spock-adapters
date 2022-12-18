import { constants } from "@spockanalytics/base";

export type ChainRecord<T> = Record<constants.Chain, T>;
export type PartialChainRecord<T> = Partial<ChainRecord<T>>;
