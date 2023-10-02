import { Interface, Result } from "@ethersproject/abi";
import { abi, constants, types, utils } from "@spockanalytics/base";

interface TestTransformer {
  address?: string | ((chain: constants.Chain) => Promise<string[]>);
  chain: constants.Chain;
  contractInterface: Interface;
  hanlder: types.EventHandler;
  hash: string;
  signature: string;
  eventIndex?: number;
}

export async function extractEvent({
  address,
  chain,
  contractInterface,
  hanlder,
  hash,
  signature,
  eventIndex,
}: TestTransformer) {
  const provider = abi.Web3Node.provider(chain);
  const receipt = await provider.getTransactionReceipt(hash);
  let log;
  if (typeof address === "string") {
    log = receipt.logs.find((log) => utils.isSameAddress(log.address, address));
  } else if (typeof address === "function") {
    const addresses = await address(chain);
    log = receipt.logs.find((log) => addresses.includes(log.address.toLowerCase()));
  } else {
    log = receipt.logs.find(
      ({ topics, logIndex }) => topics[0] === signature && (eventIndex ? logIndex === eventIndex : true),
    );
  }

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
