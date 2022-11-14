import { Interface } from "@ethersproject/abi";
import { Chain } from "constant/chains";
import { Event } from "types/event";

export type EventHandler = (event: Event<any>) => Promise<void>;

export interface Transformer {
  address?: string;
  contract: Interface;
  eventHandlers: { [topic: string]: EventHandler };
}

export interface Adapter {
  appKey: string;
  transformers: Partial<Record<Chain, Transformer[]>>;
}
