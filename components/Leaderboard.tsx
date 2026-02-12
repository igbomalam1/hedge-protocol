"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { LeaderboardEntry } from "@/lib/supabase";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/leaderboard?limit=100");
            const data = await response.json();

            if (data.success) {
                setLeaderboard(data.leaderboard);
            } else {
                setError("Failed to load leaderboard");
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
            setError("Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
        if (rank === 2) return <Medal className="text-gray-300" size={24} />;
        if (rank === 3) return <Award className="text-amber-600" size={24} />;
        return <span className="text-white/40 font-bold">#{rank}</span>;
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="bg-black/40 backdrop-blur-xl border border-emerald/20 rounded-3xl p-8 text-center">
                <div className="animate-spin w-12 h-12 border-2 border-emerald border-t-transparent rounded-full mx-auto" />
                <p className="text-white/60 mt-4">Loading leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-emerald/20 rounded-3xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-emerald" size={28} />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    Top Hedgehog Supporters
                </h2>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-4">Wallet</div>
                    <div className="col-span-2 text-right">Base</div>
                    <div className="col-span-2 text-right">Referrals</div>
                    <div className="col-span-2 text-right">Bonus</div>
                    <div className="col-span-1 text-right">Total</div>
                </div>

                {/* Leaderboard Entries */}
                {leaderboard.map((entry) => (
                    <div
                        key={entry.address}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-xl transition-all hover:bg-emerald/5 ${entry.rank <= 3 ? "bg-emerald/10 border border-emerald/20" : "bg-black/20"
                            }`}
                    >
                        {/* Rank */}
                        <div className="col-span-1 flex items-center">
                            {getRankIcon(entry.rank)}
                        </div>

                        {/* Wallet Address */}
                        <div className="col-span-4 flex items-center">
                            <span className="font-mono text-sm">{truncateAddress(entry.address)}</span>
                        </div>

                        {/* Base Allocation */}
                        <div className="col-span-2 flex items-center justify-end">
                            <span className="text-white/60 text-sm">{entry.base_allocation.toLocaleString()}</span>
                        </div>

                        {/* Referral Count */}
                        <div className="col-span-2 flex items-center justify-end">
                            <span className="text-amber text-sm font-bold">{entry.referral_count}</span>
                        </div>

                        {/* Referral Bonus */}
                        <div className="col-span-2 flex items-center justify-end">
                            <span className="text-emerald text-sm font-bold">+{entry.referral_bonus.toLocaleString()}</span>
                        </div>

                        {/* Total Allocation */}
                        <div className="col-span-1 flex items-center justify-end">
                            <span className="text-lg font-black text-emerald">{(entry.total_allocation / 1000).toFixed(0)}k</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Showing Top {leaderboard.length} Wallets • Updated in Real-Time
                </p>
            </div>
        </div>
    );
}
