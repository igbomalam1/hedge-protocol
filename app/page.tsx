"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Users, Trophy, Shield, ArrowRight, Gift } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import ParticleField from "@/components/ParticleField";
import FloatingElements from "@/components/FloatingElements";
import CountdownTimer from "@/components/CountdownTimer";
import TokenomicsChart from "@/components/TokenomicsChart";
import FAQSection from "@/components/FAQSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EligibilityFlow from "@/components/EligibilityFlow";
import { useWeb3Manager } from "@/hooks/useWeb3Manager";

// Asset placeholders
const hedgehogMascot = "/placeholder-mascot.png"; // User needs to provide this or we use CSS shape
const hogsLogo = "/placeholder-logo.png";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const features = [
    { icon: Zap, title: "Instant Scan", desc: "Connect and scan your wallet in seconds to check eligibility." },
    { icon: Users, title: "Referral Boost", desc: "Earn 10% bonus for every friend who claims their airdrop." },
    { icon: Trophy, title: "Leaderboard", desc: "Compete for top spots and unlock exclusive tier rewards." },
    { icon: Shield, title: "Secure", desc: "Read-only wallet access. No signatures, no gas fees." },
];

export default function Home() {
    const router = useRouter();

    const openEligibility = () => {
        window.dispatchEvent(new CustomEvent('open-eligibility'));
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/20">
            {/* Particle background */}
            <ParticleField />
            <FloatingElements />

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
            </div>

            <Navbar />

            {/* Hero */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 sm:pt-40 pb-12 sm:pb-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                            Claim Your{" "}
                            <span className="text-gradient-hero">$HOGS</span>{" "}
                            Airdrop
                        </motion.h1>

                        <motion.p {...fadeUp(0.2)} className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg">
                            Connect your wallet, scan your on-chain activity, and get $HOGS based on your on-chain score. Refer friends to earn 5,000 more tokens per referral.
                        </motion.p>

                        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                            <GradientButton size="lg" onClick={openEligibility}>
                                Scan Wallet <ArrowRight className="w-4 h-4 ml-2 inline" />
                            </GradientButton>
                            <GradientButton size="lg" variant="accent" onClick={() => router.push("/ambassador")}>
                                <Gift className="w-4 h-4 mr-2 inline" /> Become Ambassador
                            </GradientButton>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-primary/10 blur-[60px]" />
                            {/* Mascot Placeholder */}
                            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 animate-pulse flex items-center justify-center border border-white/10 backdrop-blur-sm">
                                    <span className="text-4xl">🦔</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Countdown */}
                <motion.div {...fadeUp(0.5)} className="mt-8 sm:mt-12">
                    <CountdownTimer />
                </motion.div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16 sm:pb-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-display font-bold text-center mb-12"
                >
                    How It Works
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <motion.div key={f.title} {...fadeUp(i * 0.1)}>
                            <GlassCard hover className="p-6 h-full">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.desc}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tokenomics */}
            <TokenomicsChart />
            <FAQSection />

            <Footer />
            <EligibilityFlow />
        </div>
    );
}
