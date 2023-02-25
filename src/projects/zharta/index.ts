import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { LoanCreatedEventObject, LoanPaidEventObject } from "./types/Loans";
import { DepositEventObject, WithdrawalEventObject } from "./types/Pool";
import { Label, loansInterface, poolInterface, DEPOSIT, WITHDRAWAL, LOAN_CREATED, LOAN_PAID, getLoan } from "./utils";
import { constants, types, utils, abi } from "@spockanalytics/base";

export async function depositEvent(event: types.Event<DepositEventObject>) {
  const walletAddress = event.params.wallet;
  const token = await new abi.Token(event.params.erc20TokenContract, event.chain).metaData();

  if (token) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD({ token, balance: event.params.amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value: parseFloat(amount.toString()),
      user: walletAddress,
    });
  }
}

export async function withdrawalEvent(event: types.Event<WithdrawalEventObject>) {
  const walletAddress = event.params.wallet;
  const token = await new abi.Token(event.params.erc20TokenContract, event.chain).metaData();

  if (token) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD({ token, balance: event.params.amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAWAL,
      value: parseFloat(amount.toString()),
      user: walletAddress,
    });
  }
}

export async function loanCreatedEvent(event: types.Event<LoanCreatedEventObject>) {
  const walletAddress = event.params.wallet;
  const loanId = event.params.loanId;

  const loanInfo = await getLoan(event.chain, [walletAddress, loanId.toNumber()], event.blockNumber);
  const token = await new abi.Token(event.params.erc20TokenContract, event.chain).metaData();

  if (loanInfo) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD({ token, balance: loanInfo.amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.LOAN_CREATED,
      value: parseFloat(amount.toString()),
      user: walletAddress,
    });
  }
}

export async function loanPaidEvent(event: types.Event<LoanPaidEventObject>) {
  const walletAddress = event.params.wallet;
  const loanId = event.params.loanId;

  const loanInfo = await getLoan(event.chain, [walletAddress, loanId.toNumber()], event.blockNumber);
  const token = await new abi.Token(event.params.erc20TokenContract, event.chain).metaData();

  if (loanInfo) {
    const block = await Promise.resolve(event.block);
    const amount = await tokenBalanceUSD({ token, balance: loanInfo.amount }, event.chain, block.timestamp);

    return utils.ProtocolValue.contribution({
      label: Label.LOAN_PAID,
      value: parseFloat(amount.toString()),
      user: walletAddress,
    });
  }
}

const zhartaAdapter: types.Adapter = {
  appKey: "8b25dbb191f57942bd8c8cf470ae34b845b2c0a9c84daed81abd03f917e46c23",
  transformers: {
    [constants.Chain.ETHEREUM]: [
      {
        contract: loansInterface,
        eventHandlers: {
          [LOAN_CREATED]: loanCreatedEvent,
          [LOAN_PAID]: loanPaidEvent,
        },
        startBlock: 16422125,
      },
      {
        contract: poolInterface,
        eventHandlers: {
          [DEPOSIT]: depositEvent,
          [WITHDRAWAL]: withdrawalEvent,
        },
        startBlock: 16422124,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.ETHEREUM]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL,
        startBlock: 16422124,
      },
    ],
  },
};

export default zhartaAdapter;
