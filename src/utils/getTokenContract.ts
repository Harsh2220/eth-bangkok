import { Chain } from "viem";
import { arbitrum, base, optimism, polygon } from "viem/chains";
import { AaveV3Base, AaveV3Arbitrum, AaveV3Optimism, AaveV3Polygon } from "@bgd-labs/aave-address-book"
import { TOKENS } from "@/types";


export default function getTokenContract(chain: Chain, token: TOKENS) {
    switch (chain) {
        case base:
            if (token === TOKENS.USDC) {
                return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
            } else {
                return null
            }
        case polygon:
            if (token === TOKENS.USDC) {
                return "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
            } else {
                return "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
            }
        case arbitrum:
            if (token === TOKENS.USDC) {
                return "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
            } else {
                return "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
            }
        case optimism:
            if (token === TOKENS.USDC) {
                return "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"
            } else {
                return '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
            }
        default:
            break;
    }
}
