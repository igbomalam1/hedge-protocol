"use client";

import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import TrustSignals from "@/components/TrustSignals";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import EcosystemStats from "@/components/EcosystemStats";
import Navbar from "@/components/Navbar";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import FAQ from "@/components/FAQ";
import DeepScan from "@/components/DeepScan";
import EcosystemScale from "@/components/EcosystemScale";
import SecurityAudits from "@/components/SecurityAudits";
import SupportedBy from "@/components/SupportedBy";
import Incentives from "@/components/Incentives";
import ShelterBot from "@/components/ShelterBot";
import StakingEcosystem from "@/components/StakingEcosystem";
import Whitepaper from "@/components/Whitepaper";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { useWeb3Manager } from "@/hooks/useWeb3Manager";

const ShelterChat = dynamic(() => import('@/components/ShelterChat'), { ssr: false });
const ChatBubble = dynamic(() => import('@/components/ChatBubble'), { ssr: false });
const MajesticLoader = dynamic(() => import('@/components/MajesticLoader'), { ssr: false });
const EligibilityFlow = dynamic(() => import('@/components/EligibilityFlow'), { ssr: false });
const MissionSection = dynamic(() => import('@/components/MissionSection'), { ssr: false });

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-black">
                <MajesticLoader />
            </main>
        );
    }

    return (
        <>
            <HomeContent onOpenChat={() => setIsChatOpen(true)} />
            <ShelterChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <ChatBubble isOpen={isChatOpen} onClick={() => setIsChatOpen(true)} />
            <EligibilityFlow />
        </>
    );
}

function HomeContent({ onOpenChat }: { onOpenChat: () => void }) {
    const { account } = useWeb3Manager();
    const isConnected = !!account;

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.section-transition');
        sections.forEach(section => observer.observe(section));

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, [isConnected]);

    return (
        <main className="min-h-screen relative overflow-hidden bg-transparent selection:bg-forest selection:text-white">
            <MajesticLoader />
            {/* Decorative gradients */}
            <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-forest opacity-[0.05] rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-earth opacity-[0.05] rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000" />

            {/* Navbar doesn't need onConnect anymore as state is global */}
            <Navbar />

            <div className="relative z-10">
                <div className="space-y-0">
                    <Hero />

                    <div className="section-transition border-b border-white/5">
                        <MissionSection />
                    </div>


                    <div className="section-transition">
                        <ShelterBot onOpenChat={onOpenChat} />
                    </div>

                    <div className="section-transition border-t border-white/5 bg-white/[0.01]">
                        <StakingEcosystem />
                    </div>

                    <div className="section-transition">
                        <DeepScan />
                    </div>

                    <div className="section-transition">
                        <FeaturesGrid />
                    </div>

                    <div className="section-transition">
                        <Incentives />
                    </div>

                    <div className="section-transition">
                        <EcosystemScale />
                    </div>

                    <div className="section-transition">
                        <Tokenomics />
                    </div>

                    <div className="section-transition">
                        <SecurityAudits />
                    </div>

                    <div className="section-transition border-t border-white/5">
                        <Roadmap />
                    </div>

                    <div className="section-transition">
                        <HowItWorks />
                    </div>

                    <div className="section-transition">
                        <EcosystemStats />
                    </div>

                    <div className="section-transition">
                        <FAQ />
                    </div>
                </div>
            </div>

            <footer className="mt-20 p-16 border-t border-white/5 text-center text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase bg-transparent relative z-10">
                <p>© 2026 THE HEDGEHOGS PROJECT • $HOGS • Empowering Animal Welfare</p>
                <p className="mt-4 text-[8px] opacity-50">On-chain Rescue • Habitat Scan • Verified Compassion</p>
            </footer>
        </main>
    );
}


