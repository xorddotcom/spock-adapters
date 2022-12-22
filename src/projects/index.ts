import DafiAdapter from "./dafi";
import TetuEarnAdapter from "./tetu";
import UnipilotAdapter from "./unipilot";
import { types } from "@spockanalytics/base";

export const Adapters: types.Adapter[] = [DafiAdapter, TetuEarnAdapter, UnipilotAdapter];
