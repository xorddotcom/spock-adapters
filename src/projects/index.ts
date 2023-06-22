import AlpacaAdapter from "./alpaca";
import BullionFxAdapter from "./bullionfx";
import DafiAdapter from "./dafi";
import LifiAdapter from "./lifi";
import MetamaskAdapter from "./metamask";
import PStakeAdapter from "./pStake";
import PaxoAdapter from "./paxo";
import RubicAdapter from "./rubic";
import TenderizeAdapter from "./tenderize";
import TetuEarnAdapter from "./tetu";
import UnipilotAdapter from "./unipilot";
import ZhartaAdapter from "./zharta";
import { types } from "@spockanalytics/base";

export const Adapters: types.Adapter[] = [
  AlpacaAdapter,
  BullionFxAdapter,
  DafiAdapter,
  MetamaskAdapter,
  PStakeAdapter,
  LifiAdapter,
  PaxoAdapter,
  PStakeAdapter,
  RubicAdapter,
  TenderizeAdapter,
  TetuEarnAdapter,
  UnipilotAdapter,
  ZhartaAdapter,
];
