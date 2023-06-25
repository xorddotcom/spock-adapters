import { tokenBalanceUSD } from "../../utils/sumBalances";
import { computeTVL } from "./tvl";
import { BeefyVaultV7 } from "./types";
import { TransferEventObject } from "./types/BeefyVaultV7";
import { TRANSFER, beefyVaultInterface, getVaultsAddresses, getVault, underlyingLpPrice, Label } from "./utils";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther, parseEther } from "@ethersproject/units";
import { abi, constants, types, utils } from "@spockanalytics/base";

async function transferedValue(event: types.Event<TransferEventObject>) {
  const vault = await getVault(event.address, event.chain);
  if (vault) {
    const lpPricePerShare: BigNumber = (
      await abi.Multicall.singleCall<BeefyVaultV7>({
        address: event.address,
        chain: event.chain,
        contractInterface: beefyVaultInterface,
        fragment: "getPricePerFullShare",
      })
    ).output; //underlying lp price for 1(Decimal) mooshare

    const mooShare = formatEther(event.params.value); //mooshare in decimals
    const underlyingLpBalance = utils.BN_Opeartion.mul(mooShare, formatEther(lpPricePerShare)); //underlyting lp in wei

    let lpPriceUSD = utils.BN_Opeartion.ZERO_BN;

    //if underlying asset is lp
    if (vault.oracle === "lps") {
      const price = await underlyingLpPrice(vault.oracleId);
      lpPriceUSD = underlyingLpBalance.multipliedBy(price);
    } else {
      lpPriceUSD = await tokenBalanceUSD(
        {
          token: vault.tokenAddress,
          balance: parseEther(parseFloat(underlyingLpBalance.toString()).toFixed(5)),
        },
        event.chain,
      );
    }

    return parseFloat(lpPriceUSD.toString());
  }
}

async function deposit(event: types.Event<TransferEventObject>) {
  const value = await transferedValue(event);
  if (typeof value !== "undefined") {
    return utils.ProtocolValue.contribution({
      label: Label.DEPOSIT,
      value,
      user: event.params.to,
    });
  }
}

async function withdraw(event: types.Event<TransferEventObject>) {
  const value = await transferedValue(event);
  if (typeof value !== "undefined") {
    return utils.ProtocolValue.extraction({
      label: Label.WITHDRAW,
      value,
      user: event.params.from,
    });
  }
}

export async function transferEvent(event: types.Event<TransferEventObject>) {
  if (utils.isSameAddress(event.params.from, constants.ZERO_ADDRESS)) {
    return deposit(event);
  } else if (utils.isSameAddress(event.params.to, constants.ZERO_ADDRESS)) {
    return withdraw(event);
  }
}

const beefyAdapter: types.Adapter = {
  appKey: "3a957eef019c4c6c256c96e4613ba0c04232705e6f41cfc68f7c9e04a8e59204",
  transformers: {
    [constants.Chain.POLYGON]: [
      {
        contract: beefyVaultInterface,
        getAddresses: getVaultsAddresses,
        eventHandlers: {
          [TRANSFER]: transferEvent,
        },
        startBlock: 44284986,
      },
    ],
  },
  tvlExtractors: {
    [constants.Chain.POLYGON]: [
      {
        category: types.TVL_Category.TVL,
        extractor: computeTVL(types.TVL_Category.TVL),
        startBlock: 44284986,
      },
      {
        category: types.TVL_Category.STAKING,
        extractor: computeTVL(types.TVL_Category.STAKING),
        startBlock: 44284986,
      },
    ],
  },
};

export default beefyAdapter;
