import { Log } from "@ethersproject/providers";
import { abi, types } from "@spockanalytics/base";

export async function getLogs(params: abi.LogParams, cache?: types.LogsCache, address?: string): Promise<Array<Log>> {
  if (cache) {
    const cachedData = await cache.getCache(address);
    console.log({ cachedData });
    const newParams = cachedData ? { ...params, fromBlock: cachedData.block + 1 } : params;
    let logs = await abi.getBatchLogs(newParams);
    logs = [...(cachedData?.logs ?? []), ...logs];
    await cache.setCache({ address, block: params.toBlock, logs, timestamp: params.timestamp ?? 0 });
    return logs;
  } else {
    return await abi.getBatchLogs(params);
  }
}
