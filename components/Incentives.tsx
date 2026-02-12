"use client";

import { TrendingUp, Coins, Gift, Zap } from "lucide-react";

export default function Incentives() {
    const incentives = [
        {
            title: "Hedgehog Hero Pool",
            description: "200,000,000 $HOGS (20% of supply) is allocated for the first phase of habitat protection. Distributed to active rescuers and donors.",
            icon: <Gift className="w-8 h-8 text-amber" />,
            benefit: "200M $HOGS Pool"
        },
        {
            title: "The Care Formula",
            description: "Your rewards = BaseDonation + RescueActivity + LoyaltyBonus. Our system automatically recognizes your commitment to hedgehog welfare.",
            icon: <Zap className="w-8 h-8 text-amber" />,
            benefit: "Compassion Multiplier"
        },
        {
            title: "Impact Weighting",
            description: "Direct support for critically endangered habitats provides up to 1.5x reward weight. Every action has a measurable impact.",
            icon: <Coins className="w-8 h-8 text-amber" />,
            benefit: "Up to 1.5x Weight"
        },
        {
            title: "Pure Shelter Ethics",
            description: "No private sales. No venture capital. No team unlocks at launch. The Hedgehog Project is built for the community and the animals.",
            icon: <TrendingUp className="w-8 h-8 text-amber" />,
            benefit: "100% Ethical"
        }
    ];

    return (
        <section id="rewards" className="py-32 bg-transparent relative">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] text-amber uppercase mb-4">Ecosystem Rewards</h2>
                        <h3 className="text-4xl md:text-5xl font-bold italic hedgehog-gradient leading-tight">
                            More Than Just a Token. <br /> A Lifeline for Nature.
                        </h3>
                    </div>
                    <p className="text-white/40 max-w-sm font-medium text-sm leading-relaxed">
                        We don't just value your contribution. We empower your impact. Participate in the Hedgehog ecosystem and see your $HOGS grow with the shelter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {incentives.map((item, idx) => (
                        <div key={idx} className="glass-card p-10 border-white/5 hover:border-amber/30 flex flex-col md:flex-row items-start gap-8 group">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-amber/10 group-hover:border-amber/40 transition-all duration-500 shadow-xl">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-amber transition-colors">{item.title}</h4>
                                    <span className="text-[9px] font-bold tracking-widest text-amber uppercase bg-amber/10 px-3 py-1 rounded-full border border-amber/20">
                                        {item.benefit}
                                    </span>
                                </div>
                                <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background decorative element */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-[#D4AF37] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        </section>
    );
}
