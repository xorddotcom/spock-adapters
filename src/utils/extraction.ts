import { DEPOSIT } from "../projects/unipilot/utils";
import { abi, constants } from "@spockanalytics/base";

export async function extraction(chain: constants.Chain, hash: string) {
  const provider = abi.Web3Node.provider(chain);
  const transaction = await provider.getTransactionReceipt(hash);
  console.log({ transaction });
  console.log(DEPOSIT);
  // const logs = await provider.getLogs()
}
