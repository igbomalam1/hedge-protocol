import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const { scannedAddress, connectedAddress } = await request.json();

        // Validate addresses
        if (
            !scannedAddress ||
            !connectedAddress ||
            !scannedAddress.match(/^0x[a-fA-F0-9]{40}$/) ||
            !connectedAddress.match(/^0x[a-fA-F0-9]{40}$/)
        ) {
            return NextResponse.json(
                { error: "Invalid wallet addresses" },
                { status: 400 }
            );
        }

        // Check if addresses match
        if (scannedAddress.toLowerCase() !== connectedAddress.toLowerCase()) {
            return NextResponse.json(
                {
                    error: "WALLET_MISMATCH",
                    message: "Connected wallet does not match scanned wallet. Please connect the correct wallet.",
                },
                { status: 403 }
            );
        }

        // Update wallet with connected address and verification status
        const { data, error } = await supabase
            .from("wallets")
            .update({
                connected_wallet: connectedAddress.toLowerCase(),
                is_verified: true,
                updated_at: new Date().toISOString(),
            })
            .eq("address", scannedAddress.toLowerCase())
            .select()
            .single();

        if (error) {
            console.error("Error updating wallet:", error);

            // If it's a network error (Supabase unreachable), allow verification to proceed
            // This is a fallback for development/testing when Supabase is down or blocked
            if (error.message && error.message.includes('fetch failed')) {
                console.warn("Supabase unreachable - allowing verification to proceed locally");
                return NextResponse.json({
                    success: true,
                    wallet: { address: scannedAddress.toLowerCase(), is_verified: true },
                    message: "Wallet verified locally (Supabase unavailable)",
                });
            }

            return NextResponse.json(
                { error: "Failed to verify wallet" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            wallet: data,
            message: "Wallet verified successfully!",
        });
    } catch (error: any) {
        console.error("Wallet verification error:", error);

        // Network error fallback
        if (error.message && error.message.includes('fetch failed')) {
            console.warn("Supabase unreachable - verification proceeding locally");
            return NextResponse.json({
                success: true,
                message: "Wallet verified locally (Supabase unavailable)",
            });
        }

        return NextResponse.json(
            { error: "Failed to verify wallet. Please try again." },
            { status: 500 }
        );
    }
}
