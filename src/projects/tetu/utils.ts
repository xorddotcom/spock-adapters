import { PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { SmartVault__factory, ContractReader__factory, ContractReader, SmartVault } from "./types";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { constants, abi } from "@spockanalytics/base";

// contract interfaces
export const smartVault = SmartVault__factory.createInterface();
export const contractReader = ContractReader__factory.createInterface();

// contract events
export const DEPOSIT = smartVault.getEventTopic(smartVault.getEvent("Deposit"));
export const WITHDRAW = smartVault.getEventTopic(smartVault.getEvent("Withdraw"));

// helper functions
const CONTRACT_READER: PartialChainRecord<string> = {
  [constants.Chain.POLYGON]: "0xCa9C8Fba773caafe19E6140eC0A7a54d996030Da",
  [constants.Chain.BSC]: "0xE8210A2d1a7B56115a47B8C06a72356773f6838E",
  [constants.Chain.ETHEREUM]: "0x6E4D8CAc827B52E7E67Ae8f68531fafa36eaEf0B",
};

export async function vaultInfo(
  address: string,
  blockNumber: number,
  chain: constants.Chain,
): Promise<{ token: PartialTokenDecimals; price: number } | undefined> {
  try {
    const calls = [
      new abi.Call<SmartVault>({ address, contractInterface: smartVault, fragment: "underlying" }),
      new abi.Call<SmartVault>({ address, contractInterface: smartVault, fragment: "underlyingUnit" }),
    ];

    const result = await abi.Multicall.execute(chain, calls);
    const underlying: string = result[0][0];
    const underlyingUnit: number = result[1][0].toString().length - 1;

    const price: BigNumber = await abi.Multicall.singleCall<ContractReader>({
      address: CONTRACT_READER[chain] ?? "",
      chain,
      contractInterface: contractReader,
      fragment: "getPrice",
      callInput: [underlying],
      blockNumber,
    });

    return {
      token: { address: underlying, decimals: underlyingUnit },
      price: parseFloat(formatEther(price.toString())),
    };
  } catch (e) {
    return undefined;
  }
}

export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}
