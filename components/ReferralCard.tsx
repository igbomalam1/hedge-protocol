"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Share2, Users, Gift } from "lucide-react";

interface ReferralCardProps {
    referralCode: string;
    walletAddress: string;
}

export default function ReferralCard({ referralCode, walletAddress }: ReferralCardProps) {
    const [copied, setCopied] = useState(false);
    const [referralStats, setReferralStats] = useState({
        count: 0,
        totalBonus: 0,
    });

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode}`;

    useEffect(() => {
        fetchReferralStats();
    }, [walletAddress]);

    const fetchReferralStats = async () => {
        try {
            const response = await fetch(`/api/referrals?address=${walletAddress}`);
            const data = await response.json();

            if (data.success) {
                setReferralStats({
                    count: data.count,
                    totalBonus: data.totalBonus,
                });
            }
        } catch (err) {
            console.error("Failed to fetch referral stats:", err);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const shareOnTwitter = () => {
        const text = `Join me in supporting hedgehog rescue! 🦔 Scan your wallet and earn $HOGS tokens while helping save hedgehogs. Use my referral link:`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="bg-gradient-to-br from-emerald/10 to-amber/10 border border-emerald/30 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Gift className="text-amber" size={28} />
                <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Refer & Earn</h3>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">5,000 $HOGS per referral</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-2xl p-4 border border-emerald/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-emerald" />
                        <span className="text-[9px] text-white/40 uppercase tracking-wider">Referrals</span>
                    </div>
                    <div className="text-3xl font-black text-emerald">{referralStats.count}</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-amber/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Gift size={16} className="text-amber" />
                        <span className="text-[9px] text-white/40 uppercase tracking-wider">Total Bonus</span>
                    </div>
                    <div className="text-3xl font-black text-amber">{referralStats.totalBonus.toLocaleString()}</div>
                </div>
            </div>

            {/* Referral Link */}
            <div>
                <label className="text-[10px] text-white/60 uppercase tracking-wider mb-2 block">Your Referral Link</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 bg-black/40 border border-emerald/20 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-emerald/50"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="px-6 bg-emerald hover:bg-emerald/80 rounded-xl transition-all flex items-center gap-2 border-2 border-amber"
                    >
                        {copied ? (
                            <>
                                <Check size={18} />
                                <span className="hidden md:inline text-sm font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                <span className="hidden md:inline text-sm font-bold">Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Share Button */}
            <button
                onClick={shareOnTwitter}
                className="w-full bg-gradient-to-r from-emerald to-emerald/80 hover:from-emerald/90 hover:to-emerald/70 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border-2 border-amber"
            >
                <Share2 size={20} />
                <span className="uppercase tracking-wider text-sm">Share on Twitter</span>
            </button>

            {/* Info */}
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 leading-relaxed">
                    <strong className="text-emerald">How it works:</strong> Share your referral link with friends. When they scan their wallet and qualify (with on-chain activity), you'll automatically receive <strong className="text-amber">5,000 $HOGS</strong> bonus! The more you refer, the higher you climb on the leaderboard. 🦔
                </p>
            </div>
        </div>
    );
}
