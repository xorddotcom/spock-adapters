import BullionFxAdapter from "./bullionfx";
import DafiAdapter from "./dafi";
import TetuEarnAdapter from "./tetu";
import UnipilotAdapter from "./unipilot";
import ZhartaAdapter from "./zharta";
import { types } from "@spockanalytics/base";

export const Adapters: types.Adapter[] = [
  BullionFxAdapter,
  DafiAdapter,
  TetuEarnAdapter,
  UnipilotAdapter,
  ZhartaAdapter,
];
