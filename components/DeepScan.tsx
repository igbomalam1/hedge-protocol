"use client";

import { Shield, Lock, Eye } from "lucide-react";

export default function DeepScan() {
    return (
        <section id="scan" className="py-32 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="order-2 lg:order-1 relative group">
                        <div className="absolute -inset-4 bg-forest/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative glass-card overflow-hidden border-emerald/20 bg-gradient-to-br from-forest via-emerald/10 to-black aspect-[4/3] flex items-center justify-center">
                            <Shield size={120} className="text-emerald/20 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1 border border-forest/30 rounded-full text-[10px] font-bold tracking-[0.4em] text-forest light uppercase bg-forest/5 mb-8">
                            <Eye size={12} /> Habitat & Rescue Scan
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 italic text-white leading-tight">
                            The Engine <br />
                            <span className="hedgehog-gradient">of Conservation</span>
                        </h2>
                        <p className="text-lg text-white/40 mb-12 leading-relaxed font-medium">
                            Our proprietary on-chain scanning engine identifies habitat vulnerability and rescue needs in real-time, allowing for instant mobilization of resources.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "On-chain Transparency", desc: "Every donation and resource allocation is verifiable on the blockchain to ensure ethical use.", icon: <Lock className="text-amber" size={20} /> },
                                { title: "Habitat Analysis", desc: "AI-driven habitat scan filters through geological and ecological data to prioritize rescue missions.", icon: <Shield className="text-amber" size={20} /> }
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card p-6 border-white/5 hover:border-forest/20 transition-all duration-500">
                                    <div className="mb-4">{item.icon}</div>
                                    <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                                    <p className="text-[12px] text-white/30 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
