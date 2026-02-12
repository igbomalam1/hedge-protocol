import {
    WalletScanResult,
    AllocationResult,
    ALLOCATION_CONFIG,
} from "@/types/blockchain";

/**
 * Calculate $HOGS allocation based on wallet scan results
 */
export function calculateAllocation(
    scanResults: WalletScanResult[]
): AllocationResult {
    // Calculate base score from all chains
    let totalScore = 0;
    let fromTransactions = 0;
    let fromTokens = 0;
    let fromAge = 0;
    let fromNfts = 0;
    let fromDefi = 0;

    let hasNfts = false;
    let hasDefiActivity = false;
    let isEarlyAdopter = false;
    let hasAnyActivity = false;

    for (const result of scanResults) {
        // Check if wallet has any real activity
        if (result.transactionCount > 0 || result.nftCount > 0 || result.totalValue > 0) {
            hasAnyActivity = true;
        }

        // Transaction score
        const txScore = result.transactionCount * ALLOCATION_CONFIG.TRANSACTION_WEIGHT;
        fromTransactions += txScore;

        // Token holdings score
        const tokenScore = result.totalValue * ALLOCATION_CONFIG.TOKEN_VALUE_WEIGHT;
        fromTokens += tokenScore;

        // Wallet age score
        const ageScore = result.walletAge * ALLOCATION_CONFIG.WALLET_AGE_WEIGHT;
        fromAge += ageScore;

        // NFT score
        if (result.nftCount > 0) {
            hasNfts = true;
            const nftScore = result.nftCount * ALLOCATION_CONFIG.NFT_WEIGHT;
            fromNfts += nftScore;
        }

        // DeFi score
        if (result.defiInteractions > 0) {
            hasDefiActivity = true;
            const defiScore = result.defiInteractions * ALLOCATION_CONFIG.DEFI_WEIGHT;
            fromDefi += defiScore;
        }

        // Early adopter check
        if (result.walletAge >= ALLOCATION_CONFIG.EARLY_ADOPTER_DAYS) {
            isEarlyAdopter = true;
        }

        totalScore += result.score;
    }

    // Calculate base allocation
    let baseAllocation = fromTransactions + fromTokens + fromAge + fromNfts + fromDefi;

    // FALLBACK: If no activity detected but wallet is being scanned, give minimum allocation
    // This handles cases where Moralis API fails or wallet has activity we can't detect
    if (baseAllocation === 0 && !hasAnyActivity) {
        console.log("No activity detected, but giving minimum allocation as fallback");
        baseAllocation = 1000; // Minimum 1000 $HOGS
        hasAnyActivity = true; // Mark as having activity
    }

    // Check eligibility: Must have ANY allocation
    const isEligible = baseAllocation > 0;

    // If wallet is not eligible, return rejection
    if (!isEligible) {
        return {
            address: scanResults[0]?.address || "",
            totalScore: 0,
            baseAllocation: 0,
            multipliers: {
                nftBonus: 1,
                defiBonus: 1,
                earlyAdopterBonus: 1,
            },
            finalAllocation: 0,
            breakdown: {
                fromTransactions: 0,
                fromTokens: 0,
                fromAge: 0,
                fromNfts: 0,
                fromDefi: 0,
            },
            scanResults,
            isEligible: false,
        };
    }

    // Apply multipliers
    const multipliers = {
        nftBonus: hasNfts ? ALLOCATION_CONFIG.NFT_MULTIPLIER : 1,
        defiBonus: hasDefiActivity ? ALLOCATION_CONFIG.DEFI_MULTIPLIER : 1,
        earlyAdopterBonus: isEarlyAdopter ? ALLOCATION_CONFIG.EARLY_ADOPTER_MULTIPLIER : 1,
    };

    let finalAllocation = baseAllocation * multipliers.nftBonus * multipliers.defiBonus * multipliers.earlyAdopterBonus;

    // Ensure allocation is within bounds
    finalAllocation = Math.max(
        ALLOCATION_CONFIG.MIN_ALLOCATION,
        Math.min(ALLOCATION_CONFIG.MAX_ALLOCATION, Math.floor(finalAllocation))
    );

    return {
        address: scanResults[0]?.address || "",
        totalScore,
        baseAllocation,
        multipliers,
        finalAllocation,
        breakdown: {
            fromTransactions,
            fromTokens,
            fromAge,
            fromNfts,
            fromDefi,
        },
        scanResults,
        isEligible: true,
    };
}

/**
 * Calculate score for a single chain scan result
 */
export function calculateChainScore(
    transactionCount: number,
    totalValue: number,
    walletAge: number,
    nftCount: number,
    defiInteractions: number
): number {
    let score = 0;

    score += transactionCount * ALLOCATION_CONFIG.TRANSACTION_WEIGHT;
    score += totalValue * ALLOCATION_CONFIG.TOKEN_VALUE_WEIGHT;
    score += walletAge * ALLOCATION_CONFIG.WALLET_AGE_WEIGHT;
    score += nftCount * ALLOCATION_CONFIG.NFT_WEIGHT;
    score += defiInteractions * ALLOCATION_CONFIG.DEFI_WEIGHT;

    return Math.floor(score);
}

/**
 * Generate a simulated allocation for chains without real scanning
 */
export function generateSimulatedAllocation(address: string): number {
    // Use address as seed for consistent results
    const seed = parseInt(address.slice(2, 10), 16);
    const random = (seed % 1000) / 1000;

    const range = ALLOCATION_CONFIG.MAX_ALLOCATION - ALLOCATION_CONFIG.MIN_ALLOCATION;
    return Math.floor(ALLOCATION_CONFIG.MIN_ALLOCATION + random * range);
}
