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
    const block = await provider.getBlock(receipt.blockNumber);
    const txn = await provider.getTransaction(hash);

    const { from, to, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas } = txn;
    const { address, blockNumber, blockHash, transactionHash, transactionIndex, logIndex } = log;
    const { parentHash, difficulty, gasLimit, gasUsed, miner, timestamp, baseFeePerGas } = block;
    const { status, type, gasUsed: receiptGasUsed } = receipt;

    const eventData: types.Event<Result> = {
      address,
      signature,
      params: decodedLog.args,
      block: {
        number: blockNumber,
        hash: blockHash,
        parentHash,
        difficulty,
        gasLimit,
        gasUsed,
        miner,
        timestamp,
        baseFeePerGas,
      },
      transaction: {
        hash: transactionHash,
        from,
        to: to ?? "",
        value: value.toString(),
        gasPrice: gasPrice ?? ZERO_BN,
        maxFeePerGas: maxFeePerGas ?? ZERO_BN,
        maxPriorityFeePerGas: maxPriorityFeePerGas ?? ZERO_BN,
        receipt: {
          status,
          type,
          gasUsed: receiptGasUsed,
        },
      },
      transactionLogIndex: transactionIndex,
      logIndex,
      chain,
    };

    return await hanlder(eventData);
  }
}
