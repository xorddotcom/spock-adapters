import { DEPOSIT } from "../projects/unipilot/utils";
import { abi, constants } from "@spockanalytics/base";

export async function extraction(chain: constants.Chain, hash: string) {
  const provider = abi.Web3Node.provider(chain);
  const receipt = await provider.getTransactionReceipt(hash);
  // const txn = await provider.getTransaction(hash);
  // console.log({ txn });
  // console.log({ receipt });
  console.log({ topics: receipt.logs[0].topics });
  console.log(DEPOSIT);
  // const logs = await provider.getLogs()
}
