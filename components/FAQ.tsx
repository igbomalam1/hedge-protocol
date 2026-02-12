"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const checklist = [
        {
            q: "How is the reward value calculated?",
            a: "Rewards are derived from your verified rescue impact, habitat contributions, and community involvement. Our system uses on-chain data to measure the quality of your impact on nature protection."
        },
        {
            q: "Which animals does the project support?",
            a: "While our name reflects our love for hedgehogs, our mission encompasses habitat protection for various garden wildlife. We partner with multiple shelters to ensure broad ecological impact."
        },
        {
            q: "How do I verify a rescue operation?",
            a: "Authenticated rescue nodes and verified shelter partners upload mission data to the blockchain. You can then verify these operations via our habitat scan to see the direct results of your support."
        },
        {
            q: "Is my donation secure?",
            a: "Yes. Every donation is tracked on the blockchain, and funds are governed by auditable smart contracts. We prioritize transparency above all else to ensure your contributions reach the animals in need."
        }
    ];

    return (
        <section id="faq" className="py-32 bg-white/[0.02] border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16 text-center italic hedgehog-gradient">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {checklist.map((item, idx) => (
                        <div key={idx} className="glass-card border-white/5 overflow-hidden transition-all duration-500 hover:border-amber/20 group">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 md:p-8 text-left hover:bg-white/[0.03] transition-all duration-300"
                            >
                                <span className={`text-base md:text-xl font-bold tracking-tight transition-colors duration-300 ${openIndex === idx ? 'text-amber' : 'text-white/80 group-hover:text-white'}`}>
                                    {item.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 shrink-0 ml-4 ${openIndex === idx ? 'bg-amber border-amber rotate-180' : 'bg-transparent'}`}>
                                    {openIndex === idx ? <ChevronUp size={16} className="text-black" /> : <ChevronDown size={16} className="text-white/40" />}
                                </div>
                            </button>

                            <div className={`transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="p-5 md:p-8 pt-0 text-white/50 leading-relaxed font-medium text-sm md:text-lg border-t border-white/5 mt-2">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
