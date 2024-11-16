import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from "@/constants";
import { ABI } from "@/constants/abi";
import { AAVE_CONTRACT } from "@/constants/contracts";
import getPublicClient from "@/utils/getPublicClient";
import getTokenContract from "@/utils/getTokenContract";
import { formatUnits, Chain, PublicClient } from "viem";

export interface Token {
  address: string;
  symbol: string;
}

export interface Pool {
  token: Token;
  chain: Chain;
  supplyYield: number;
  borrowYield: number;
}

export interface PoolData {
  currentLiquidityRate: bigint;
  currentVariableBorrowRate: bigint;
}

export default function usePools() {
  const fetchPoolData = async (
    publicClient: PublicClient,
    tokenAddress: string
  ): Promise<PoolData | null> => {
    try {
      return await publicClient.readContract({
        abi: ABI,
        address: AAVE_CONTRACT,
        functionName: "getReserveData",
        args: [tokenAddress as `0x${string}`],
      });
    } catch (error) {
      console.error(`Error fetching pool data: ${error}`);
      return null;
    }
  };

  const createPoolObject = (
    tokenAddress: string,
    symbol: string,
    chain: Chain,
    data: PoolData
  ): Pool => ({
    token: {
      address: tokenAddress,
      symbol,
    },
    chain,
    supplyYield: Number(formatUnits(data.currentLiquidityRate, 27)),
    borrowYield: Number(formatUnits(data.currentVariableBorrowRate, 27)),
  });

  async function getPools(): Promise<Pool[]> {
    const pools: Pool[] = [];

    await Promise.all(
      SUPPORTED_TOKENS.map(async (tokenSymbol) => {
        // Get all valid pools for this token across chains
        const chainPools = await Promise.all(
          SUPPORTED_CHAINS.map(async (chain) => {
            const tokenAddress = getTokenContract(chain, tokenSymbol);
            // Skip if no token contract exists for this chain (e.g., USDT on Base)
            if (!tokenAddress) return null;

            const publicClient = getPublicClient(chain);
            const data = await fetchPoolData(publicClient, tokenAddress);
            if (!data) return null;

            return createPoolObject(tokenAddress, tokenSymbol, chain, data);
          })
        );

        // Filter out null results (skipped chains) and find the best pool
        const validPools = chainPools.filter(
          (pool): pool is Pool => pool !== null
        );

        if (validPools.length > 0) {
          const bestPool = validPools.reduce((max, current) =>
            current.supplyYield > max.supplyYield ? current : max
          );
          pools.push(bestPool);
        }
      })
    );

    return pools;
  }

  return { getPools };
}
