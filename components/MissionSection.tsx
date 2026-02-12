"use client";

import { Activity, Shield, Heart, Globe, Zap, Users, Leaf, ArrowUpRight } from "lucide-react";

export default function MissionSection() {
    return (
        <section id="mission" className="py-32 bg-transparent relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-forest/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald/5 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <h4 className="text-emerald text-[10px] font-bold uppercase tracking-[0.4em] animate-fade-up">Our Core Purpose</h4>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white animate-fade-up delay-100 italic">
                        The Global Rescue Mission
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto animate-fade-up delay-200">
                        Bridging the gap between on-chain incentives and real-world wildlife conservation through proof-of-impact protocols.
                    </p>
                </div>

                {/* Hedgehog Hero Image */}
                <div className="mb-16 relative group overflow-hidden rounded-[40px] aspect-[21/9] border border-emerald/20">
                    <img
                        src="https://images.unsplash.com/photo-1584553421349-3557471bed79?q=80&w=2670&auto=format&fit=crop"
                        alt="Hedgehog in natural habitat"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald mb-2">Our Mission</p>
                        <p className="text-xl md:text-2xl font-bold text-white">Every hedgehog deserves a safe habitat and a fighting chance at survival.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Mission Pillar 1 */}
                    <div className="glass-card p-10 space-y-6 hover:translate-y-[-10px] transition-all group animate-fade-up delay-100">
                        <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center border border-forest/20 group-hover:bg-forest/20 transition-all">
                            <Leaf size={32} className="text-forest-light" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Habitat Security</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            We identify and secure endangered hedgehog habitats using geospatial data and local conservation partners. Every $HOGS contribution directly funds land leases and protection services.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Metric: Hectares Protected</span>
                            <ArrowUpRight size={14} className="text-emerald" />
                        </div>
                    </div>

                    {/* Mission Pillar 2 */}
                    <div className="glass-card p-10 space-y-6 hover:translate-y-[-10px] transition-all group animate-fade-up delay-200 border-emerald/20 bg-emerald/[0.02]">
                        <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center border border-emerald/20 group-hover:bg-emerald/20 transition-all">
                            <Activity size={32} className="text-emerald" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Rescue Logistics</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Deploying rapid-response teams and specialized medical kits for hedgehogs in high-stress urban environments. Our protocol ensures 100% transparent funding for every rescue operation.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Metric: Success Rate</span>
                            <ArrowUpRight size={14} className="text-emerald" />
                        </div>
                    </div>

                    {/* Mission Pillar 3 */}
                    <div className="glass-card p-10 space-y-6 hover:translate-y-[-10px] transition-all group animate-fade-up delay-300">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                            <Globe size={32} className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Conservation AI</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Shelter Guide monitors biodiversity levels and habitat health 24/7, optimizing resource allocation based on real-time ecological data and community-driven verification.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Metric: Habitat Health Index</span>
                            <ArrowUpRight size={14} className="text-emerald" />
                        </div>
                    </div>
                </div>

                {/* Team/Impact Banner */}
                <div className="mt-20 glass-card p-12 border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 animate-fade-up delay-400">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-white/10 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=rescue${i}`} alt="Specialist" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white uppercase tracking-wider">Join 2,400+ Conservationists</p>
                            <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium">Protecting the wild together</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-eligibility'))}
                        className="px-10 py-4 bg-emerald text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-emerald/80 transition-all shadow-xl border-2 border-amber"
                    >
                        Check Impact Eligibility
                    </button>
                </div>
            </div>
        </section>
    );
}
