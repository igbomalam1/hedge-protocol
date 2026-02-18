"use client";

import { motion } from "framer-motion";
import { Hexagon, Circle, Triangle } from "lucide-react";

const shapes = [
    { Icon: Hexagon, x: "10%", y: "20%", size: 24, delay: 0, duration: 8, color: "text-primary/10" },
    { Icon: Circle, x: "85%", y: "15%", size: 18, delay: 1, duration: 10, color: "text-accent/10" },
    { Icon: Triangle, x: "75%", y: "65%", size: 20, delay: 2, duration: 9, color: "text-primary/8" },
    { Icon: Hexagon, x: "15%", y: "70%", size: 16, delay: 3, duration: 11, color: "text-accent/8" },
    { Icon: Circle, x: "50%", y: "10%", size: 14, delay: 1.5, duration: 7, color: "text-primary/6" },
    { Icon: Triangle, x: "90%", y: "45%", size: 22, delay: 0.5, duration: 12, color: "text-accent/6" },
];

const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {shapes.map((s, i) => (
            <motion.div
                key={i}
                className="absolute"
                style={{ left: s.x, top: s.y }}
                animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
                transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            >
                <s.Icon className={`${s.color}`} size={s.size} />
            </motion.div>
        ))}
    </div>
);

export default FloatingElements;
