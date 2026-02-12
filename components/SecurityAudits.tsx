"use client";

import { ShieldCheck, FileText, Lock } from "lucide-react";

export default function SecurityAudits() {
    return (
        <section className="py-32 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-amber/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative glass-card overflow-hidden border-white/5 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1584553421349-3557471bed79?auto=format&fit=crop&q=80&w=1200" alt="Hedgehog Security Protocol" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1 border border-amber/30 rounded-full text-[10px] font-bold tracking-[0.4em] text-amber uppercase bg-amber/5 mb-8">
                            <ShieldCheck size={12} /> Mission Integrity
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 italic text-white leading-tight">
                            Verified by <br />
                            <span className="hedgehog-gradient">Global Conservation Allies</span>
                        </h2>
                        <p className="text-lg text-white/40 mb-12 leading-relaxed font-medium">
                            Security is our priority. HEDGEHOGS protocols undergo rigorous vetting to ensure that every contribution and rescue log is protected by industry-leading transparency.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Habitat Security", date: "Q4 2025", icon: <FileText className="text-amber" size={16} /> },
                                { title: "Rescue Verification", date: "Q1 2026", icon: <Lock className="text-amber" size={16} /> }
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card p-6 border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        {item.icon}
                                        <span className="text-[10px] font-bold text-amber tracking-widest">{item.date}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
