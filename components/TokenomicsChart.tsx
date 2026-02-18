"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "./GlassCard";

const data = [
    { name: "Airdrop", value: 30, color: "hsl(160, 84%, 39%)" },
    { name: "Liquidity Pool", value: 25, color: "hsl(160, 84%, 50%)" },
    { name: "Team & Advisors", value: 15, color: "hsl(43, 96%, 56%)" },
    { name: "Ecosystem Fund", value: 15, color: "hsl(43, 96%, 44%)" },
    { name: "Staking Rewards", value: 10, color: "hsl(160, 60%, 60%)" },
    { name: "Treasury", value: 5, color: "hsl(220, 15%, 40%)" },
];

const TokenomicsChart = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-[400px]" />; // Retain height to prevent huge shift

    return (
        <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-display font-bold text-center mb-12"
            >
                Tokenomics
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={120}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={1200}
                                >
                                    {data.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: "hsl(220, 15%, 8%)",
                                        border: "1px solid hsla(0,0%,100%,0.1)",
                                        borderRadius: "12px",
                                        color: "hsl(0, 0%, 95%)",
                                        fontSize: "13px",
                                    }}
                                    formatter={(value: any) => [`${value}%`, ""]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </GlassCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-3"
                >
                    {data.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <GlassCard hover className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                <span className="font-display font-bold text-gradient-primary">
                                    {item.value}%
                                </span>
                            </GlassCard>
                        </motion.div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-4 pl-1">
                        Total Supply: 1,000,000,000 $HOGS
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default TokenomicsChart;
