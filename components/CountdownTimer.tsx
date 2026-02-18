"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import GlassCard from "./GlassCard";

const DEADLINE = new Date("2026-03-15T00:00:00Z");

const CountdownTimer = () => {
    // Suppress hydration mismatch by only rendering on client or initializing with dynamic check
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    function getTimeLeft() {
        const diff = Math.max(0, DEADLINE.getTime() - Date.now());
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    }

    useEffect(() => {
        setTimeLeft(getTimeLeft()); // Initialize on client
        const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!timeLeft) return null; // Prevent hydration mismatch

    const units = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    const isUrgent = timeLeft.days < 7;

    return (
        <GlassCard glow={isUrgent ? "accent" : "primary"} className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className={`w-5 h-5 ${isUrgent ? "text-accent" : "text-primary"}`} />
                <h3 className="font-display font-semibold text-lg">
                    {isUrgent ? "⚡ Airdrop Ending Soon!" : "Airdrop Ends In"}
                </h3>
            </div>
            <div className="flex justify-center gap-3 sm:gap-4">
                {units.map((u) => (
                    <div key={u.label} className="flex flex-col items-center">
                        <motion.div
                            key={u.value}
                            initial={{ scale: 1.1, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-display text-2xl sm:text-3xl font-bold ${isUrgent
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : "bg-primary/10 text-primary border border-primary/20"
                                }`}
                        >
                            {String(u.value).padStart(2, "0")}
                        </motion.div>
                        <span className="text-xs text-muted-foreground mt-1.5">{u.label}</span>
                    </div>
                ))}
            </div>
            {isUrgent && (
                <p className="text-sm text-accent mt-3 font-medium animate-pulse">
                    Less than 7 days remaining — secure your reward now!
                </p>
            )}
        </GlassCard>
    );
};

export default CountdownTimer;
