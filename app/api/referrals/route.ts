import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get("address");

        if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
            return NextResponse.json(
                { error: "Invalid wallet address" },
                { status: 400 }
            );
        }

        // Fetch referrals for this address
        const { data: referrals, error } = await supabase
            .from("referrals")
            .select(`
        *,
        referred:wallets!referrals_referred_address_fkey(address, allocation, created_at)
      `)
            .eq("referrer_address", address.toLowerCase())
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching referrals:", error);
            return NextResponse.json(
                { error: "Failed to fetch referrals" },
                { status: 500 }
            );
        }

        // Calculate total bonus
        const totalBonus = referrals.reduce((sum, ref) => sum + ref.bonus_amount, 0);

        return NextResponse.json({
            success: true,
            referrals,
            count: referrals.length,
            totalBonus,
        });
    } catch (error) {
        console.error("Referrals fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch referrals. Please try again." },
            { status: 500 }
        );
    }
}
