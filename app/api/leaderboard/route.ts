import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Fetch leaderboard from cache
        const { data, error } = await supabase
            .from("leaderboard_cache")
            .select("*")
            .order("rank", { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching leaderboard:", error);
            return NextResponse.json(
                { error: "Failed to fetch leaderboard" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            leaderboard: data,
            total: data.length,
        });
    } catch (error) {
        console.error("Leaderboard error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard. Please try again." },
            { status: 500 }
        );
    }
}
