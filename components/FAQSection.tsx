"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import GlassCard from "./GlassCard";

const faqs = [
    {
        q: "How do I check if I'm eligible for the $HOGS airdrop?",
        a: "Simply connect your wallet and we'll scan your on-chain activity. Your eligibility is based on your on-chain score, which factors in transaction history, protocol interactions, and wallet age.",
    },
    {
        q: "What determines my on-chain score?",
        a: "Your score is calculated from multiple factors including transaction volume, number of unique protocols used, wallet age, NFT holdings, and DeFi participation across supported chains.",
    },
    {
        q: "How does the referral program work?",
        a: "Each eligible wallet receives a unique referral code. When someone claims their airdrop using your code, you earn 5,000 bonus $HOGS tokens. There's no limit to the number of referrals you can make.",
    },
    {
        q: "Is connecting my wallet safe?",
        a: "Absolutely. We use read-only wallet access to scan your on-chain activity. No signatures are required, no gas fees are charged, and we never request permission to move your funds.",
    },
    {
        q: "When does the airdrop end?",
        a: "The airdrop ends on March 15, 2026. After this date, unclaimed tokens will be redistributed to the ecosystem fund. We recommend securing your reward as early as possible.",
    },
    {
        q: "What can I do with $HOGS tokens?",
        a: "$HOGS tokens grant governance voting rights, staking rewards, and access to exclusive ecosystem features. Staking rewards are distributed from a dedicated 10% allocation of the total supply.",
    },
];

const FAQSection = () => (
    <section className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-center mb-12"
        >
            Frequently Asked Questions
        </motion.h2>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <GlassCard className="p-6">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-border">
                            <AccordionTrigger className="text-left font-medium text-sm sm:text-base hover:text-primary transition-colors">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </GlassCard>
        </motion.div>
    </section>
);

export default FAQSection;
