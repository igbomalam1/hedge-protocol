"use client";

import { MessageSquare, Zap, Cpu, Bot } from "lucide-react";

export default function ShelterBot({ onOpenChat }: { onOpenChat: () => void }) {
    return (
        <section id="shelter-guide" className="py-32 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    <div className="relative group flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden rounded-[40px] glass-card border-emerald/20 shadow-[0_0_100px_rgba(5,150,105,0.15)] flex flex-col items-center justify-center bg-[#010603] group-hover:border-emerald/40 transition-all duration-700">
                            {/* Inner Glow Surround */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_100%)] animate-pulse" />

                            <div className="relative">
                                <Bot size={140} className="text-emerald animate-[float_4s_easeInOut_infinite] green-glow" />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-emerald/20 blur-xl rounded-full" />

                                {/* Small hedgehog accent */}
                                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full overflow-hidden border-2 border-emerald/30 shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1584553421349-3557471bed79?q=80&w=400&auto=format&fit=crop"
                                        alt="Hedgehog"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 text-center space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald">Shelter Core v2.4</p>
                                <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-medium">Neural Processing Layer Active</p>
                            </div>

                            {/* Floating Stats Tags */}
                            <div className="absolute top-8 right-8 glass-card py-3 px-5 border-emerald/20 animate-fade-up backdrop-blur-3xl">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">System: Optimized</span>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 glass-card py-3 px-5 border-white/5 animate-fade-up delay-300 backdrop-blur-3xl">
                                <span className="text-[8px] font-bold tracking-widest uppercase text-white/40">Efficiency: 99.8%</span>
                            </div>
                        </div>
                    </div>

                    {/* Content: Introducing the Shelter Guide */}
                    <div className="flex flex-col items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] mb-8">
                            <Bot size={12} className="text-forest-light" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Animal Welfare AI</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold italic hedgehog-gradient mb-8 leading-tight">
                            Meet Your Guide. <br /> Habitat Protection Assistant.
                        </h2>

                        <p className="text-lg text-white/50 mb-10 leading-relaxed font-medium">
                            Our AI guide isn't just a bot—it's the heart of The Hedgehog Project. Designed to help you navigate donations, track rescue missions, and maximize your impact on animal welfare.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-forest/30 transition-all group">
                                <MessageSquare className="w-5 h-5 text-forest-light mb-4" />
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Impact Audit</h4>
                                <p className="text-xs text-white/30 leading-relaxed">The guide can instantly audit the impact of your donations and predict $HOGS reward value.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-forest/30 transition-all group">
                                <Zap className="w-5 h-5 text-forest-light mb-4" />
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Rescue Track</h4>
                                <p className="text-xs text-white/30 leading-relaxed">Stay updated on active rescue operations and habitat preservation benchmarks.</p>
                            </div>
                        </div>

                        <button
                            onClick={onOpenChat}
                            className="px-10 py-5 rounded-2xl font-bold tracking-[0.2em] text-[12px] uppercase text-white bg-emerald hover:bg-emerald/80 shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
                        >
                            <Bot size={18} /> Chat with Guide
                        </button>
                    </div>

                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />
        </section>
    );
}
