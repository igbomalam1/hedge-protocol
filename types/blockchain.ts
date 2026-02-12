// Blockchain scanning types and interfaces

export interface ChainConfig {
    name: string;
    chainId: string;
    rpcUrl: string;
    explorer: string;
    nativeCurrency: string;
    supportsRealScan: boolean;
}

export interface WalletScanResult {
    chain: string;
    address: string;
    transactionCount: number;
    tokenHoldings: TokenHolding[];
    nftCount: number;
    walletAge: number; // in days
    defiInteractions: number;
    totalValue: number; // in USD
    score: number;
}

export interface TokenHolding {
    symbol: string;
    name: string;
    balance: string;
    decimals: number;
    valueUsd: number;
}

export interface AllocationResult {
    address: string;
    totalScore: number;
    baseAllocation: number;
    multipliers: {
        nftBonus: number;
        defiBonus: number;
        earlyAdopterBonus: number;
    };
    finalAllocation: number;
    breakdown: {
        fromTransactions: number;
        fromTokens: number;
        fromAge: number;
        fromNfts: number;
        fromDefi: number;
    };
    scanResults: WalletScanResult[];
    isEligible?: boolean;
}

export interface MoralisTokenBalance {
    token_address: string;
    name: string;
    symbol: string;
    balance: string;
    decimals: number;
    possible_spam?: boolean;
}

export interface MoralisNFT {
    token_address: string;
    token_id: string;
    name: string;
    symbol: string;
    possible_spam?: boolean;
}

export interface MoralisTransaction {
    hash: string;
    from_address: string;
    to_address: string;
    value: string;
    block_timestamp: string;
    block_number: string;
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        name: "Ethereum",
        chainId: "0x1",
        rpcUrl: "https://eth.llamarpc.com",
        explorer: "https://etherscan.io",
        nativeCurrency: "ETH",
        supportsRealScan: true,
    },
    bsc: {
        name: "BNB Chain",
        chainId: "0x38",
        rpcUrl: "https://bsc-dataseed.binance.org",
        explorer: "https://bscscan.com",
        nativeCurrency: "BNB",
        supportsRealScan: true,
    },
    base: {
        name: "Base",
        chainId: "0x2105",
        rpcUrl: "https://mainnet.base.org",
        explorer: "https://basescan.org",
        nativeCurrency: "ETH",
        supportsRealScan: true,
    },
    polygon: {
        name: "Polygon",
        chainId: "0x89",
        rpcUrl: "https://polygon-rpc.com",
        explorer: "https://polygonscan.com",
        nativeCurrency: "MATIC",
        supportsRealScan: false,
    },
    arbitrum: {
        name: "Arbitrum",
        chainId: "0xa4b1",
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        explorer: "https://arbiscan.io",
        nativeCurrency: "ETH",
        supportsRealScan: false,
    },
    optimism: {
        name: "Optimism",
        chainId: "0xa",
        rpcUrl: "https://mainnet.optimism.io",
        explorer: "https://optimistic.etherscan.io",
        nativeCurrency: "ETH",
        supportsRealScan: false,
    },
    avalanche: {
        name: "Avalanche",
        chainId: "0xa86a",
        rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
        explorer: "https://snowtrace.io",
        nativeCurrency: "AVAX",
        supportsRealScan: false,
    },
};

// Allocation constants
export const ALLOCATION_CONFIG = {
    MIN_ALLOCATION: 5000,
    MAX_ALLOCATION: 120000,

    // Scoring weights
    TRANSACTION_WEIGHT: 10,
    TOKEN_VALUE_WEIGHT: 0.1,
    WALLET_AGE_WEIGHT: 5,
    NFT_WEIGHT: 50,
    DEFI_WEIGHT: 100,

    // Multipliers
    NFT_MULTIPLIER: 1.2,
    DEFI_MULTIPLIER: 1.3,
    EARLY_ADOPTER_MULTIPLIER: 1.5, // Wallet older than 2 years

    // Thresholds
    EARLY_ADOPTER_DAYS: 730, // 2 years
    MIN_TRANSACTIONS: 10,
    SPAM_TOKEN_THRESHOLD: 0.01, // Min value in USD to not be considered spam
};
