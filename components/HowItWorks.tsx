import { Pocket, Search, Gift } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Join the Mission",
            description: "Securely link your EOA and join the Hedgehog rescue community.",
            icon: <Pocket size={24} className="text-amber" />
        },
        {
            number: "02",
            title: "Verify Impact",
            description: "Our engine scans your rescue interactions and verified conservation efforts.",
            icon: <Search size={24} className="text-amber" />
        },
        {
            number: "03",
            title: "Receive $HOGS Rewards",
            description: "Receive utility tokens directly to your wallet for continued animal support.",
            icon: <Gift size={24} className="text-amber" />
        }
    ];

    return (
        <section className="py-32 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-center text-4xl md:text-5xl font-bold mb-20 italic hedgehog-gradient">The Path to Protection</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="mb-8 relative inline-block">
                                <div className="text-6xl font-bold text-white/5 tracking-tighter group-hover:text-amber/10 transition-colors duration-700">
                                    0{idx + 1}
                                </div>
                                <div className="absolute top-1/2 left-0 -translate-y-1/2 p-4 glass-card border-white/10 group-hover:border-amber/30 transition-all duration-500 shadow-2xl">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-amber transition-colors duration-500">{step.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors duration-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
