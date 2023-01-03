import { PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { getParamCalls } from "../../utils/helper";
import {
  SmartVault__factory,
  ContractReader__factory,
  ContractReader,
  SmartVault,
  BookKeeper__factory,
  BookKeeper,
} from "./types";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { constants, abi } from "@spockanalytics/base";

// contract interfaces
export const smartVault = SmartVault__factory.createInterface();
export const contractReader = ContractReader__factory.createInterface();
export const bookKeeper = BookKeeper__factory.createInterface();

// contract events
export const DEPOSIT = smartVault.getEventTopic(smartVault.getEvent("Deposit"));
export const WITHDRAW = smartVault.getEventTopic(smartVault.getEvent("Withdraw"));

// helper functions
const CONTRACT_READER: PartialChainRecord<string> = {
  [constants.Chain.POLYGON]: "0xCa9C8Fba773caafe19E6140eC0A7a54d996030Da",
  [constants.Chain.BSC]: "0xE8210A2d1a7B56115a47B8C06a72356773f6838E",
  [constants.Chain.ETHEREUM]: "0x6E4D8CAc827B52E7E67Ae8f68531fafa36eaEf0B",
};

const BOOK_KEEPER: PartialChainRecord<string> = {
  [constants.Chain.POLYGON]: "0x0A0846c978a56D6ea9D2602eeb8f977B21F3207F",
  [constants.Chain.BSC]: "0x8A571137DA0d66c2528DA3A83F097fbA10D28540",
  [constants.Chain.ETHEREUM]: "0xb8bA82F19A9Be6CbF6DAF9BF4FBCC5bDfCF8bEe6",
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

export async function vaultAddresses(chain: constants.Chain): Promise<string[] | undefined> {
  try {
    const vaultsLength: BigNumber = await abi.Multicall.singleCall<BookKeeper>({
      address: BOOK_KEEPER[chain] ?? "",
      chain,
      contractInterface: bookKeeper,
      fragment: "vaultsLength",
    });

    const vaultAddresses = await abi.Multicall.singleContractMultipleData<BookKeeper>({
      address: BOOK_KEEPER[chain] ?? "",
      chain,
      contractInterface: bookKeeper,
      fragment: "_vaults",
      callInput: getParamCalls(Number(vaultsLength.toString())),
    });

    return vaultAddresses.map((address) => address[0].toLowerCase());
  } catch (e) {
    console.log({ e });
    return undefined;
  }
}

export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}
