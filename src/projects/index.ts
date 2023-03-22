import BullionFxAdapter from "./bullionfx";
import DafiAdapter from "./dafi";
import PStakeAdapter from "./pStake";
import PaxoAdapter from "./paxo";
import TenderizeAdapter from "./tenderize";
import TetuEarnAdapter from "./tetu";
import UnipilotAdapter from "./unipilot";
import ZhartaAdapter from "./zharta";
import { types } from "@spockanalytics/base";

export const Adapters: types.Adapter[] = [
  BullionFxAdapter,
  DafiAdapter,
  PStakeAdapter,
  PaxoAdapter,
  TenderizeAdapter,
  TetuEarnAdapter,
  UnipilotAdapter,
  ZhartaAdapter,
];
