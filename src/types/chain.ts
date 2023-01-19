import { constants } from "@spockanalytics/base";

export type ChainRecord<T> = Record<constants.Chain, T>;

export type PartialChainRecord<T> = Partial<ChainRecord<T>>;

export type AddressMap = PartialChainRecord<string>;

export type AddressMapStrict = ChainRecord<string>;
