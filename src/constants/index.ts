import { TOKENS } from "@/types";
import { arbitrum, base, optimism, polygon } from "viem/chains";

export const SUPPORTED_TOKENS = [TOKENS.USDC, TOKENS.USDT]

export const SUPPORTED_CHAINS = [arbitrum, base, optimism, polygon];