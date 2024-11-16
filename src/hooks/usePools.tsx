import { ABI } from "@/constants/abi";
import getPublicClient from "@/utils/getPublicClient";
import getTokenContract from "@/utils/getTokenContract";
import { arbitrum, base, optimism, polygon } from "viem/chains";
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from "@/constants";
import { POLYGON_CONTRACT } from "@/constants/contracts";

export default function usePools() {
  async function getPools() {
    for (let index = 0; index < SUPPORTED_TOKENS.length; index++) {
      for (let index = 0; index < SUPPORTED_CHAINS.length; index++) {
        const publicClient = getPublicClient(SUPPORTED_CHAINS[index]);

        const tokenAddress = getTokenContract(
          SUPPORTED_CHAINS[index],
          SUPPORTED_TOKENS[index]
        );

        if (!tokenAddress) {
          return index++;
        }

        const data = await publicClient.readContract({
          abi: ABI,
          address: POLYGON_CONTRACT,
          functionName: "getReserveData",
          args: [tokenAddress],
        });
      }
    }
  }

  return { getPools };
}
