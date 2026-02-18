"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Ambassador", path: "/ambassador" },
    { label: "Scan Wallet", path: "/scan" },
];

const MobileMenu = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="sm:hidden">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 glass-card border-t-0 rounded-t-none p-4 z-50"
                    >
                        <div className="flex flex-col gap-3">
                            {links.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        if (link.path === '/scan') {
                                            // If scan is clicked, we might want to trigger the overlay instead if on home?
                                            // For now, let's assume /scan is a route or we handle it via event
                                            window.dispatchEvent(new CustomEvent('open-eligibility'));
                                        } else {
                                            router.push(link.path);
                                        }
                                        setOpen(false);
                                    }}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left px-3 py-2 rounded-lg hover:bg-[hsl(var(--glass-hover))]"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileMenu;
