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
import { WalletScanResult } from "@/types/blockchain";

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        // Validate address
        if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
            return NextResponse.json(
                { error: "Invalid wallet address" },
                { status: 400 }
            );
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

        console.log(`Final allocation for ${address}: ${allocation.finalAllocation} $HOGS`);

        return NextResponse.json({
            success: true,
            allocation,
        });
    } catch (error) {
        console.error("Wallet scan error:", error);
        return NextResponse.json(
            { error: "Failed to scan wallet. Please try again." },
            { status: 500 }
        );
    }
}
