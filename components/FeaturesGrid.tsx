"use client";

import { Box, Globe, ShieldCheck, Zap } from "lucide-react";

export default function FeaturesGrid() {
    const features = [
        {
            title: "Habitat Intelligence",
            description: "Deep-scanning environmental data and habitat vulnerability to identify urgent rescue needs.",
            icon: <Globe className="w-8 h-8 text-amber" />,
        },
        {
            title: "Rescue Coordination",
            description: "Automatically recognizes volunteer efforts and coordination across various animal shelters.",
            icon: <Box className="w-8 h-8 text-amber" />,
        },
        {
            title: "Ethical Contribution Index",
            description: "Advanced scoring formula that rewards genuine compassion and verified rescue interactions.",
            icon: <ShieldCheck className="w-8 h-8 text-amber" />,
        },
        {
            title: "On-Chain Transparency",
            description: "Verify every donation and rescue operation on the blockchain for total accountability.",
            icon: <Zap className="w-8 h-8 text-amber" />,
        },
    ];

    return (
        <section className="py-32 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 italic hedgehog-gradient">Nature Protection Analysis</h2>
                    <p className="text-white/40 max-w-xl mx-auto font-medium">
                        The Hedgehog Project goes beyond simple donations. We analyze habitat needs to ensure maximum rescue impact.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="glass-card p-10 border-white/5 hover:border-amber/30 hover:bg-amber/5 transition-all duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber opacity-0 group-hover:opacity-[0.05] rounded-full blur-2xl transition-opacity duration-700" />
                            <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5 inline-block group-hover:scale-110 group-hover:border-amber/30 transition-all duration-500 shadow-xl relative z-10">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-amber transition-colors relative z-10">{feature.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors relative z-10">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
