import { Chain } from "viem";
import { arbitrum, base, optimism, polygon } from "viem/chains";
import { AaveV3Base, AaveV3Arbitrum, AaveV3Optimism, AaveV3Polygon } from "@bgd-labs/aave-address-book"
import { TOKENS } from "@/types";


export default function getTokenContract(chain: Chain, token: TOKENS) {
    switch (chain) {
        case base:
            if (token === TOKENS.USDC) {
                return AaveV3Base.ASSETS["USDC"].UNDERLYING
            } else {
                return null
            }
        case polygon:
            if (token === TOKENS.USDC) {
                return AaveV3Polygon.ASSETS["USDC"].UNDERLYING
            } else {
                return AaveV3Polygon.ASSETS["USDT"].UNDERLYING
            }
        case arbitrum:
            if (token === TOKENS.USDC) {
                return AaveV3Arbitrum.ASSETS["USDC"].UNDERLYING
            } else {
                return AaveV3Polygon.ASSETS["USDT"].UNDERLYING
            }
        case optimism:
            if (token === TOKENS.USDC) {
                return AaveV3Optimism.ASSETS["USDC"].UNDERLYING
            } else {
                return AaveV3Optimism.ASSETS["USDT"].UNDERLYING
            }
        default:
            break;
    }
}
