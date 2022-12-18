import DafiAdapter from "./dafi";
import UnipilotAdapter from "./unipilot";
import { types } from "@spockanalytics/base";

export const Adapters: types.Adapter[] = [DafiAdapter, UnipilotAdapter];
