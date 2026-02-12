"use client";

import { Network, Zap, Cpu } from "lucide-react";

export default function EcosystemScale() {
    return (
        <section className="py-32 bg-white/[0.01] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1 border border-amber/30 rounded-full text-[10px] font-bold tracking-[0.5em] text-amber uppercase bg-amber/5 mb-8">
                            <Network size={12} /> Global Support
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 italic text-white leading-tight">
                            Rescue Without <br />
                            <span className="hedgehog-gradient">Boundaries</span>
                        </h2>
                        <p className="text-lg text-white/40 mb-12 leading-relaxed font-medium">
                            Join over <span className="text-white/80">12,000 verified supporters</span> building the next generation of charity. $HOGS is more than a token; it's a commitment to wildlife preservation.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Habitat Analysis", desc: "Processing over 4.2M environmental data points per hour with precision across all rescue nodes.", icon: <Zap className="text-amber" size={18} /> },
                                { title: "Conservation Flow", desc: "Designed for rapid deployment of rescue resources as they are needed in the wild.", icon: <Cpu className="text-amber" size={18} /> }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl glass-card border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/30 transition-all duration-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-[12px] text-white/30 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-amber/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative glass-card overflow-hidden border-white/5 aspect-[4/3]">
                            <img src="https://images.unsplash.com/photo-1584553421349-3557471bed79?auto=format&fit=crop&q=80&w=1200" alt="Hedgehog Rescue Expansion" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
