import { NextRequest, NextResponse } from "next/server";
import {
    scanEthereumWallet,
    scanBNBWallet,
    scanBaseWallet,
    scanPolygonWallet,
    scanArbitrumWallet,
    scanOptimismWallet,
    scanAvalancheWallet,
} from "@/lib/blockchain-scanner";
import { calculateAllocation } from "@/lib/allocation-calculator";
import { supabase } from "@/lib/supabase";
import { WalletScanResult } from "@/types/blockchain";

export async function POST(request: NextRequest) {
    try {
        const { address, referralCode } = await request.json();

        // Validate address
        if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
            return NextResponse.json(
                { error: "Invalid wallet address" },
                { status: 400 }
            );
        }

        // Check if wallet already exists
        const { data: existingWallet } = await supabase
            .from("wallets")
            .select("*")
            .eq("address", address.toLowerCase())
            .single();

        if (existingWallet) {
            return NextResponse.json({
                success: true,
                allocation: {
                    address: existingWallet.address,
                    finalAllocation: existingWallet.allocation,
                    baseAllocation: existingWallet.base_allocation,
                    totalScore: existingWallet.total_score,
                    multipliers: {
                        nftBonus: existingWallet.nft_bonus,
                        defiBonus: existingWallet.defi_bonus,
                        earlyAdopterBonus: existingWallet.early_adopter_bonus,
                    },
                    breakdown: {
                        fromTransactions: existingWallet.from_transactions,
                        fromTokens: existingWallet.from_tokens,
                        fromAge: existingWallet.from_age,
                        fromNfts: existingWallet.from_nfts,
                        fromDefi: existingWallet.from_defi,
                    },
                    scanResults: existingWallet.scan_data,
                },
                referralCode: existingWallet.referral_code,
                isExisting: true,
            });
        }

        const scanResults: WalletScanResult[] = [];

        console.log(`Scanning wallet: ${address}`);

        // Scan all chains with real Moralis data
        const chainScanners = [
            { name: "Ethereum", scanner: scanEthereumWallet },
            { name: "BNB Chain", scanner: scanBNBWallet },
            { name: "Base", scanner: scanBaseWallet },
            { name: "Polygon", scanner: scanPolygonWallet },
            { name: "Arbitrum", scanner: scanArbitrumWallet },
            { name: "Optimism", scanner: scanOptimismWallet },
            { name: "Avalanche", scanner: scanAvalancheWallet },
        ];

        // Scan all chains in parallel
        const scanPromises = chainScanners.map(async ({ name, scanner }) => {
            try {
                const result = await scanner(address);
                console.log(`${name} scan complete: ${result.transactionCount} txs`);
                return result;
            } catch (error) {
                console.error(`${name} scan failed:`, error);
                // Return empty result on failure
                return {
                    chain: name,
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
        });

        const results = await Promise.all(scanPromises);
        scanResults.push(...results);

        // Calculate final allocation
        const allocation = calculateAllocation(scanResults);

        // Check if wallet is eligible (has activity AND minimum $2 balance)
        if (allocation.isEligible === false) {
            console.log(`Wallet ${address} rejected: No sufficient activity or balance`);
            return NextResponse.json(
                {
                    error: "NOT_ELIGIBLE",
                    message: "This wallet has no on-chain activity. Please scan a wallet with transactions, NFTs, or token holdings on supported chains.",
                },
                { status: 403 }
            );
        }

        console.log(`Final allocation for ${address}: ${allocation.finalAllocation} $HOGS`);

        // Store wallet in database
        const { data: newWallet, error: insertError } = await supabase
            .from("wallets")
            .insert({
                address: address.toLowerCase(),
                allocation: allocation.finalAllocation,
                base_allocation: allocation.baseAllocation,
                total_score: allocation.totalScore,
                has_activity: true,
                nft_bonus: allocation.multipliers.nftBonus,
                defi_bonus: allocation.multipliers.defiBonus,
                early_adopter_bonus: allocation.multipliers.earlyAdopterBonus,
                from_transactions: allocation.breakdown.fromTransactions,
                from_tokens: allocation.breakdown.fromTokens,
                from_age: allocation.breakdown.fromAge,
                from_nfts: allocation.breakdown.fromNfts,
                from_defi: allocation.breakdown.fromDefi,
                scan_data: scanResults,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting wallet:", insertError);
            return NextResponse.json(
                { error: "Failed to store wallet data" },
                { status: 500 }
            );
        }

        // If referred by someone, create referral record
        if (referralCode) {
            // Find referrer by referral code
            const { data: referrer } = await supabase
                .from("wallets")
                .select("address")
                .eq("referral_code", referralCode)
                .single();

            if (referrer && referrer.address !== address.toLowerCase()) {
                // Create referral record
                const { error: referralError } = await supabase
                    .from("referrals")
                    .insert({
                        referrer_address: referrer.address,
                        referred_address: address.toLowerCase(),
                        bonus_amount: 5000,
                    });

                if (!referralError) {
                    console.log(`Referral created: ${referrer.address} referred ${address}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            allocation,
            referralCode: newWallet.referral_code,
            isExisting: false,
        });
    } catch (error) {
        console.error("Wallet scan error:", error);
        return NextResponse.json(
            { error: "Failed to scan wallet. Please try again." },
            { status: 500 }
        );
    }
}
