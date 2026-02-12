"use client";

import { FileText, Download, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function WhitepaperPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-amber selection:text-black">
            <Navbar />

            <div className="pt-24 md:pt-32 pb-20 max-w-5xl mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="mb-20 animate-fade-up">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber hover:gap-4 transition-all mb-12 group">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold italic hedgehog-gradient mb-6">White Paper</h1>
                            <p className="text-white/40 uppercase tracking-[0.4em] font-bold text-[8px] md:text-[10px]">Version 1.0 • February 2026</p>
                        </div>
                        <button className="hedgehog-button px-10 py-5 rounded-2xl font-bold tracking-[0.2em] text-[12px] uppercase text-white flex items-center gap-3">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-32">

                    {/* Executive Summary */}
                    <section className="animate-fade-up delay-100">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                            <div className="md:w-1/3">
                                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber border-l-2 border-amber pl-6 py-2">01 Executive Summary</h2>
                            </div>
                            <div className="md:w-2/3 space-y-8">
                                <p className="text-xl sm:text-2xl md:text-3xl font-light italic text-white/90 leading-tight">
                                    "In a world where urban expansion threatens the natural world, we're building a bridge between on-chain wealth and real-world conservation. Protecting hedgehogs, one block at a time."
                                </p>
                                <p className="text-white/50 leading-relaxed text-lg">
                                    We are the first platform that turns decentralized incentives into tangible rescue operations. Connect your wallet to support the mission. Let <span className="text-amber font-bold">Shelter Guide — our intelligent habitat assistant</span> — monitor, scan, and distribute rewards based on your contributions to the $HOGS ecosystem.
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-8">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] uppercase text-white/30 font-bold mb-2">Total Supply</p>
                                        <p className="text-xl font-bold text-white">1,000,000,000</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] uppercase text-white/30 font-bold mb-2">Rescue Pool</p>
                                        <p className="text-xl font-bold text-white">200M $HOGS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* The Problem & Solution */}
                    <section className="animate-fade-up">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                            <div className="md:w-1/3">
                                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber border-l-2 border-amber pl-6 py-2">02 The Solution</h2>
                            </div>
                            <div className="md:w-2/3 space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">HEDGEHOGS rewards real-world impact.</h3>
                                    <p className="text-white/50 leading-relaxed text-lg">
                                        Every contribution, every donation, and every stake helps preserve vital habitats. Shelter Guide turns your support into automated rescue funding + $HOGS rewards.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber/20 transition-all">
                                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Habitat Monitor</h4>
                                        <p className="text-sm text-white/40 leading-relaxed">Shelter Guide scans habitat health via real-time data integration, auto-allocating resources where they're needed most.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber/20 transition-all">
                                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Transparent Rescue</h4>
                                        <p className="text-sm text-white/40 leading-relaxed">All operations are tracked on-chain. Shelter Guide ensures that 100% of allocated rescue funds reach authorized shelters.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Reward Formula - The Tech */}
                    <section className="animate-fade-up">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                            <div className="md:w-1/3">
                                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber border-l-2 border-amber pl-6 py-2">03 Impact Formula</h2>
                            </div>
                            <div className="md:w-2/3 space-y-12">
                                <div className="p-1 p-[1px] bg-gradient-to-r from-amber/40 via-transparent to-amber/40 rounded-[40px]">
                                    <div className="bg-black/90 backdrop-blur-xl p-10 md:p-16 rounded-[40px] border border-white/5 text-center">
                                        <p className="text-xs font-bold text-amber uppercase tracking-[0.5em] mb-10">Contribution Impact Points (CIP)</p>
                                        <div className="text-xl sm:text-3xl md:text-5xl font-mono font-bold text-white tracking-tighter mb-12 break-words">
                                            CIP = BaseContribution + <br /> RescueBonus + <br /> HabitatLoyalty
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/5 pt-12">
                                            <div>
                                                <p className="text-amber font-bold text-[10px] uppercase mb-4 tracking-widest">BaseContribution</p>
                                                <p className="text-xs text-white/40 leading-relaxed">Σ (Amount × Mission Weight × Days Staked). Boosts: $HOGS (1.5x).</p>
                                            </div>
                                            <div>
                                                <p className="text-amber font-bold text-[10px] uppercase mb-4 tracking-widest">RescueBonus</p>
                                                <p className="text-xs text-white/40 leading-relaxed">Bonus points for supporting urgent rescue dispatches and emergency habitat care.</p>
                                            </div>
                                            <div>
                                                <p className="text-amber font-bold text-[10px] uppercase mb-4 tracking-widest">HabitatLoyalty</p>
                                                <p className="text-xs text-white/40 leading-relaxed">Multiplier for consistent support over multiple rescue cycles.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/40 text-center text-sm italic">"Your $HOGS Reward = (Your CIP ÷ Total Mission CIP) × Weekly Distribution"</p>
                            </div>
                        </div>
                    </section>

                    {/* Tokenomics */}
                    <section className="animate-fade-up">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                            <div className="md:w-1/3">
                                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber border-l-2 border-amber pl-6 py-2">04 Tokenomics</h2>
                            </div>
                            <div className="md:w-2/3">
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: "Rescue Mission Pool", value: "20%", supply: "200,000,000" },
                                        { label: "Conservation Ecosystem", value: "25%", supply: "250,000,000" },
                                        { label: "Community Advocacy", value: "20%", supply: "200,000,000" },
                                        { label: "Shelter Partnerships", value: "20%", supply: "200,000,000" },
                                        { label: "Core Contributors", value: "15%", supply: "150,000,000" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <span className="text-sm font-bold text-white/90">{item.label}</span>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-amber block">{item.value}</span>
                                                <span className="text-[10px] font-mono text-white/20 uppercase">{item.supply} HOGS</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-6 rounded-2xl bg-amber/5 border border-amber/20 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white tracking-widest uppercase">Mission Integrity Status</span>
                                    <span className="text-xs font-bold text-amber uppercase tracking-widest">100% Transparent</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Steps */}
                    <section className="animate-fade-up pb-32">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                            <div className="md:w-1/3">
                                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber border-l-2 border-amber pl-6 py-2">05 The Roadmap</h2>
                            </div>
                            <div className="md:w-2/3 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-[23px]" />
                                <div className="space-y-16">
                                    {[
                                        { q: "Phase 1", title: "Habitat Scanning Live", desc: "Initial Rescue Pool (200M) begins. Shelter Guide v1 live with habitat monitoring." },
                                        { q: "Phase 2", title: "Global Shelter Network", desc: "Expansion to international rescue partners. DAO governance for rescue priorities." },
                                        { q: "Phase 3", title: "Nature Conservation NFTs", desc: "Visual tracking of adopted habitats. Verified impact badges for top contributors." }
                                    ].map((milestone, idx) => (
                                        <div key={idx} className="relative pl-16">
                                            <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center z-10">
                                                <div className="w-3 h-3 rounded-full bg-amber animate-pulse" />
                                            </div>
                                            <p className="text-amber font-bold text-[10px] uppercase tracking-widest mb-2">{milestone.q}</p>
                                            <h4 className="text-xl font-bold text-white mb-4">{milestone.title}</h4>
                                            <p className="text-sm text-white/40 leading-relaxed">{milestone.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            <footer className="py-20 border-t border-white/5 bg-black text-center relative z-10">
                <div className="flex flex-col items-center gap-6">
                    <img src="/images/hedgehog_mascot_logo.png" className="w-12 h-12 rounded-xl mb-4" />
                    <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase max-w-sm">
                        Protecting hedgehog habitats, one block at a time.
                    </p>
                    <Link href="/" className="hedgehog-button px-10 py-5 rounded-2xl font-bold tracking-[0.2em] text-[12px] uppercase text-white mt-8">
                        Join the Mission
                    </Link>
                </div>
            </footer>
        </main>
    );
}
