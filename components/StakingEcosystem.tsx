"use client";

import { ArrowRightLeft, ShieldCheck, Coins, TrendingUp } from "lucide-react";

const steps = [
    {
        icon: <Coins className="text-forest-light" />,
        title: "Donate & Support",
        description: "Contribute $HOGS or major assets directly to fund rescue missions and habitat protection.",
        tokens: ["usdt.png", "ETH.png"]
    },
    {
        icon: <ArrowRightLeft className="text-forest-light" />,
        title: "Ecosystem Rewards",
        description: "Holders and contributors earn rewards for their commitment to animal welfare and shelter support.",
        tokens: ["lgns.jfif", "lgns.jfif"]
    },
    {
        icon: <ShieldCheck className="text-forest-light" />,
        title: "On-chain Verify",
        description: "Verify your contribution on the public ledger, ensuring every penny reaches the hedgehogs in need.",
        tokens: ["metamask.png", "trust wallet.jfif"]
    }
];

export default function StakingEcosystem() {
    return (
        <section id="rescue" className="py-32 bg-transparent relative">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold italic hedgehog-gradient mb-6">Rescue Operations</h2>
                    <p className="text-white/40 max-w-2xl mx-auto font-medium">
                        Help us build a safe future for hedgehogs. Donate, track your impact, and earn rewards for your compassion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="glass-card p-10 border-white/5 hover:border-forest/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={120} />
                            </div>

                            <div className="mb-8 w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:border-forest/40 group-hover:scale-110 transition-all duration-500">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 italic tracking-tight">{step.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed mb-10">{step.description}</p>

                            <div className="flex items-center gap-3 py-4 border-t border-white/5">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Accepted Assets</span>
                                <div className="flex -space-x-2">
                                    {step.tokens.map((token, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/5 overflow-hidden">
                                            <img src={`/images/crypto logo and wallets/${token}`} alt="Token" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA with Shelter Branding */}
                <div className="mt-20 glass-card p-1 p-[1px] bg-gradient-to-r from-transparent via-forest/20 to-transparent rounded-3xl">
                    <div className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-forest/40 shadow-[0_0_30px_rgba(45,90,39,0.1)]">
                                <img src="https://images.unsplash.com/photo-1584553421349-3557471bed79?q=80&w=400&auto=format&fit=crop" alt="Shelter Guide" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white italic">Ready to make an impact?</h4>
                                <p className="text-sm text-white/40">Our shelter guide is online to help you with your first donation.</p>
                            </div>
                        </div>
                        <button className="hedgehog-button px-10 py-5 rounded-2xl font-bold tracking-[0.2em] text-[12px] uppercase text-white active:scale-95 transition-all w-full md:w-auto">
                            Donate Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />
        </section>
    );
}
