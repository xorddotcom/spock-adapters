import { Interface, Result } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { abi, constants, types } from "@spockanalytics/base";

interface TestTransformer {
  chain: constants.Chain;
  contractInterface: Interface;
  hanlder: types.EventHandler;
  hash: string;
  signature: string;
}

const ZERO_BN = BigNumber.from(0);

export async function extractEvent({ chain, contractInterface, hanlder, hash, signature }: TestTransformer) {
  const provider = abi.Web3Node.provider(chain);
  const receipt = await provider.getTransactionReceipt(hash);
  const log = receipt.logs.find(({ topics }) => topics[0] === signature);

  if (log) {
    const decodedLog = contractInterface.parseLog(log);
    const block = provider.getBlock(receipt.blockNumber);
    const transaction = provider.getTransaction(hash);

    // const { from, to, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas } = txn;
    const { address, blockNumber, transactionHash, transactionIndex, logIndex } = log;
    // const { parentHash, difficulty, gasLimit, gasUsed, miner, timestamp, baseFeePerGas } = block;
    // const { status, type, gasUsed: receiptGasUsed } = receipt;

    const eventData: types.Event<Result> = {
      address,
      signature,
      params: decodedLog.args,
      blockNumber,
      block,
      transaction,
      transactionHash,
      transactionReceipt: provider.getTransactionReceipt(hash),
      transactionLogIndex: transactionIndex,
      logIndex,
      chain,
    };

    return await hanlder(eventData);
  }
}
