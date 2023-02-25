import { AddressMap, PartialChainRecord } from "../../types/chain";
import { PartialTokenDecimals } from "../../types/token";
import { factoryAddressMapping, AddressMappingResult } from "../../utils/addressMapping";
import {
  SmartVault__factory,
  ContractReader__factory,
  ContractReader,
  SmartVault,
  BookKeeper__factory,
  BookKeeper,
  Strategy__factory,
  ControllerV2__factory,
  ContractReaderV2__factory,
  VestedTetu__factory,
} from "./types";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { constants, abi } from "@spockanalytics/base";

// contract interfaces
export const bookKeeper = BookKeeper__factory.createInterface();
export const contractReader = ContractReader__factory.createInterface();
export const contractReaderV2 = ContractReaderV2__factory.createInterface();
export const controllerV2 = ControllerV2__factory.createInterface();
export const smartVault = SmartVault__factory.createInterface();
export const strategy = Strategy__factory.createInterface();
export const veTetu = VestedTetu__factory.createInterface();

// contract events
export const DEPOSIT = smartVault.getEventTopic(smartVault.getEvent("Deposit"));
export const WITHDRAW = smartVault.getEventTopic(smartVault.getEvent("Withdraw"));

//types
export enum Label {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

//constants
export const CONTRACT_READER: AddressMap = {
  [constants.Chain.POLYGON]: "0xCa9C8Fba773caafe19E6140eC0A7a54d996030Da",
  [constants.Chain.BSC]: "0xE8210A2d1a7B56115a47B8C06a72356773f6838E",
  [constants.Chain.ETHEREUM]: "0x6E4D8CAc827B52E7E67Ae8f68531fafa36eaEf0B",
};

export const BOOK_KEEPER: AddressMap = {
  [constants.Chain.POLYGON]: "0x0A0846c978a56D6ea9D2602eeb8f977B21F3207F",
  [constants.Chain.BSC]: "0x8A571137DA0d66c2528DA3A83F097fbA10D28540",
  [constants.Chain.ETHEREUM]: "0xb8bA82F19A9Be6CbF6DAF9BF4FBCC5bDfCF8bEe6",
};

export const EXCLUDED_PLATFORMS: Array<number> = [
  12, // TETU_SWAP
  29, // TETU self farm
];

export const EXCLUDED_VAULTS: PartialChainRecord<Array<string>> = {
  [constants.Chain.ETHEREUM]: ["0xfe700d523094cc6c673d78f1446ae0743c89586e"],
};

export const CONTROLLER_V2: AddressMap = {
  [constants.Chain.POLYGON]: "0x33b27e0A2506a4A2FBc213a01C51d0451745343a",
};

export const V_TETU_CONTRACT: AddressMap = {
  [constants.Chain.POLYGON]: "0x6FB29DD17fa6E27BD112Bc3A2D0b8dae597AeDA4",
};

// helper functions
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

    const result = await abi.Multicall.execute({ chain, calls });
    const underlying: string = result[0].output;
    const underlyingUnit: number = result[1].output.toString().length - 1;

    const price: BigNumber = (
      await abi.Multicall.singleCall<ContractReader>({
        address: CONTRACT_READER[chain] ?? "",
        chain,
        contractInterface: contractReader,
        fragment: "getPrice",
        callInput: [underlying],
        blockNumber,
      })
    ).output;

    return {
      token: { address: underlying, decimals: underlyingUnit },
      price: parseFloat(formatEther(price.toString())),
    };
  } catch (e) {
    return undefined;
  }
}

export async function vaultAddresses(chain: constants.Chain, blockNumber?: number): AddressMappingResult {
  return await factoryAddressMapping<BookKeeper>({
    address: BOOK_KEEPER[chain] ?? "",
    chain,
    contractInterface: bookKeeper,
    lengthFragment: "vaultsLength",
    addressFragment: "_vaults",
    blockNumber,
  });
}
