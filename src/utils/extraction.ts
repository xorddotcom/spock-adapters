import { Interface, Result } from "@ethersproject/abi";
import { abi, constants, types } from "@spockanalytics/base";

interface TestTransformer {
  chain: constants.Chain;
  contractInterface: Interface;
  hanlder: types.EventHandler;
  hash: string;
  signature: string;
}

export async function extractEvent({ chain, contractInterface, hanlder, hash, signature }: TestTransformer) {
  const provider = abi.Web3Node.provider(chain);
  const receipt = await provider.getTransactionReceipt(hash);
  const log = receipt.logs.find(({ topics }) => topics[0] === signature);

  if (log) {
    const decodedLog = contractInterface.parseLog(log);
    const { address, blockNumber, transactionHash, transactionIndex, logIndex } = log;

    const eventData: types.Event<Result> = {
      address,
      signature,
      params: decodedLog.args,
      blockNumber,
      block: provider.getBlock(receipt.blockNumber),
      transaction: provider.getTransaction(hash),
      transactionHash,
      transactionReceipt: provider.getTransactionReceipt(hash),
      transactionLogIndex: transactionIndex,
      logIndex,
      chain,
    };

    return await hanlder(eventData);
  }
}
