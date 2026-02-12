import {
    WalletScanResult,
    MoralisTokenBalance,
    MoralisNFT,
    MoralisTransaction,
    SUPPORTED_CHAINS,
    ALLOCATION_CONFIG,
} from "@/types/blockchain";
import { calculateChainScore } from "./allocation-calculator";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";
const MORALIS_BASE_URL = "https://deep-index.moralis.io/api/v2.2";

/**
 * Scan a wallet on Ethereum
 */
export async function scanEthereumWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "eth", "Ethereum");
}

/**
 * Scan a wallet on BNB Chain
 */
export async function scanBNBWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "bsc", "BNB Chain");
}

/**
 * Scan a wallet on Base
 */
export async function scanBaseWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "base", "Base");
}

/**
 * Scan a wallet on Polygon
 */
export async function scanPolygonWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "polygon", "Polygon");
}

/**
 * Scan a wallet on Arbitrum
 */
export async function scanArbitrumWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "arbitrum", "Arbitrum");
}

/**
 * Scan a wallet on Optimism
 */
export async function scanOptimismWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "optimism", "Optimism");
}

/**
 * Scan a wallet on Avalanche
 */
export async function scanAvalancheWallet(address: string): Promise<WalletScanResult> {
    return scanMoralisChain(address, "avalanche", "Avalanche");
}

/**
 * Generic Moralis chain scanner
 */
async function scanMoralisChain(
    address: string,
    chain: string,
    chainName: string
): Promise<WalletScanResult> {
    try {
        // Fetch data in parallel
        const [tokenBalances, nfts, transactions] = await Promise.all([
            fetchTokenBalances(address, chain),
            fetchNFTs(address, chain),
            fetchTransactions(address, chain),
        ]);

        // Calculate wallet age from first transaction
        const walletAge = calculateWalletAge(transactions);

        // Calculate total token value (simplified - in production, you'd fetch prices)
        const totalValue = calculateTotalValue(tokenBalances);

        // Count DeFi interactions (simplified heuristic)
        const defiInteractions = countDefiInteractions(transactions);

        // Calculate score
        const score = calculateChainScore(
            transactions.length,
            totalValue,
            walletAge,
            nfts.length,
            defiInteractions
        );

        return {
            chain: chainName,
            address,
            transactionCount: transactions.length,
            tokenHoldings: tokenBalances.map((token) => ({
                symbol: token.symbol,
                name: token.name,
                balance: token.balance,
                decimals: token.decimals,
                valueUsd: 0, // Would need price API in production
            })),
            nftCount: nfts.length,
            walletAge,
            defiInteractions,
            totalValue,
            score,
        };
    } catch (error) {
        console.error(`Error scanning ${chainName} wallet:`, error);
        // Return empty result on error
        return {
            chain: chainName,
            address,
            transactionCount: 0,
            tokenHoldings: [],
            nftCount: 0,
            walletAge: 0,
            defiInteractions: 0,
            totalValue: 0,
            score: 0,
        };
    }
}

/**
 * Fetch token balances from Moralis
 */
async function fetchTokenBalances(
    address: string,
    chain: string
): Promise<MoralisTokenBalance[]> {
    try {
        const response = await fetch(
            `${MORALIS_BASE_URL}/${address}/erc20?chain=${chain}`,
            {
                headers: {
                    "X-API-Key": MORALIS_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter out spam tokens
        return (data || []).filter((token: MoralisTokenBalance) => !token.possible_spam);
    } catch (error) {
        console.error("Error fetching token balances:", error);
        return [];
    }
}

/**
 * Fetch NFTs from Moralis
 */
async function fetchNFTs(address: string, chain: string): Promise<MoralisNFT[]> {
    try {
        const response = await fetch(
            `${MORALIS_BASE_URL}/${address}/nft?chain=${chain}&limit=100`,
            {
                headers: {
                    "X-API-Key": MORALIS_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter out spam NFTs
        return (data.result || []).filter((nft: MoralisNFT) => !nft.possible_spam);
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
    }
}

/**
 * Fetch transactions from Moralis
 */
async function fetchTransactions(
    address: string,
    chain: string
): Promise<MoralisTransaction[]> {
    try {
        const response = await fetch(
            `${MORALIS_BASE_URL}/${address}?chain=${chain}&limit=100`,
            {
                headers: {
                    "X-API-Key": MORALIS_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

/**
 * Calculate wallet age in days from first transaction
 */
function calculateWalletAge(transactions: MoralisTransaction[]): number {
    if (transactions.length === 0) return 0;

    // Find oldest transaction
    const oldestTx = transactions.reduce((oldest, tx) => {
        const txDate = new Date(tx.block_timestamp);
        const oldestDate = new Date(oldest.block_timestamp);
        return txDate < oldestDate ? tx : oldest;
    });

    const firstTxDate = new Date(oldestTx.block_timestamp);
    const now = new Date();
    const ageInMs = now.getTime() - firstTxDate.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

    return ageInDays;
}

/**
 * Calculate total value of token holdings
 * Note: This is simplified. In production, you'd fetch real-time prices
 */
function calculateTotalValue(tokens: MoralisTokenBalance[]): number {
    // For now, just count number of non-spam tokens as a proxy
    // In production, integrate with a price API like CoinGecko
    return tokens.length * 100; // Assume $100 per token as placeholder
}

/**
 * Count DeFi interactions (simplified heuristic)
 * In production, you'd check against known DeFi contract addresses
 */
function countDefiInteractions(transactions: MoralisTransaction[]): number {
    // Simple heuristic: count contract interactions (non-zero data)
    // In production, check against known DeFi protocols
    return Math.min(transactions.length, 50); // Cap at 50 for scoring
}

/**
 * Simulate wallet scan for chains without real scanning
 */
export function simulateWalletScan(
    address: string,
    chainName: string
): WalletScanResult {
    // Generate consistent random values based on address
    const seed = parseInt(address.slice(2, 10), 16);
    const random = (seed % 1000) / 1000;

    const transactionCount = Math.floor(random * 500) + 10;
    const nftCount = Math.floor(random * 20);
    const walletAge = Math.floor(random * 1000) + 30;
    const defiInteractions = Math.floor(random * 30);
    const totalValue = random * 5000;

    const score = calculateChainScore(
        transactionCount,
        totalValue,
        walletAge,
        nftCount,
        defiInteractions
    );

    return {
        chain: chainName,
        address,
        transactionCount,
        tokenHoldings: [],
        nftCount,
        walletAge,
        defiInteractions,
        totalValue,
        score,
    };
}
