import { TOKENS } from '@/types';

export default function getTokenImage(token: TOKENS) {
    switch (token) {
        case TOKENS.USDC:
            return "https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg"
        case TOKENS.USDT:
            return "https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.jpg"
    }
}
