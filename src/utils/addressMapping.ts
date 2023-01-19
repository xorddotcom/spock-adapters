import { getParamCalls } from "./helper";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseContract } from "@ethersproject/contracts";
import { abi, constants } from "@spockanalytics/base";

export type FactoryAddressMapping<T extends BaseContract> = {
  address: string;
  chain: constants.Chain;
  contractInterface: abi.CallContractInterface<T>;
  lengthFragment: abi.CallFragment<T>;
  addressFragment: abi.CallFragment<T>;
};

export type AddressMappingResult = Promise<string[] | undefined>;

export async function factoryAddressMapping<T extends BaseContract>({
  address,
  chain,
  contractInterface,
  lengthFragment,
  addressFragment,
}: FactoryAddressMapping<T>): AddressMappingResult {
  try {
    const addressesLength: BigNumber = await abi.Multicall.singleCall<T>({
      address,
      chain,
      contractInterface,
      fragment: lengthFragment,
    });

    const addresses = await abi.Multicall.singleContractMultipleData<T>({
      address,
      chain,
      contractInterface,
      fragment: addressFragment,
      callInput: getParamCalls(Number(addressesLength.toString())),
    });

    return addresses.map((address) => address[0].toLowerCase());
  } catch {
    return undefined;
  }
}
