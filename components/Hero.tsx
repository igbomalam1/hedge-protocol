"use client";

import { ArrowRight, Zap, Globe, Shield, Heart } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden bg-transparent">
            {/* High-Fidelity Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-8 text-center space-y-12">
                {/* Main Heading */}
                <div className="space-y-6">
                    <h1 className="reveal-text text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-white font-outfit">
                        Saving Habitats<br />
                        <span className="text-emerald italic">One Block</span> At A Time
                    </h1>
                    <p className="animate-fade-up delay-100 max-w-lg mx-auto text-white/40 text-sm md:text-lg leading-relaxed font-medium">
                        The Hedgehogs Project leverages decentralized technology to fund, monitor, and protect vulnerable wildlife habitats across the globe.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="animate-fade-up delay-200 flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-eligibility'))}
                        className="group relative px-12 py-5 bg-emerald text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:scale-105 transition-all green-glow flex items-center gap-3 border-2 border-amber"
                    >
                        Check Eligibility <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => window.location.href = '/amb'}
                        className="px-12 py-5 border-2 border-amber text-white font-bold text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3"
                    >
                        Become Ambassador <Zap size={16} className="text-emerald" />
                    </button>
                </div>
            </div>

            {/* Aesthetic Side Badges */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-20">
                <Globe size={24} />
                <Shield size={24} />
                <Heart size={24} />
            </div>
        </section>
    );
}
