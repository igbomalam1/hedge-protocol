"use client";

import { useState, useEffect } from "react";
import ConnectButton from "./ConnectButton";
import { Menu, X, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navLinks = [
        { name: "Mission", href: "/#mission" },
        { name: "Impact", href: "/#impact" },
        { name: "Habitat Scan", href: "/#scan" },
        { name: "Tokenomics", href: "/#tokenomics" },
        { name: "Rewards", href: "/#rewards" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b ${scrolled ? "bg-black/80 backdrop-blur-xl border-white/10 py-4" : "bg-transparent border-transparent py-8"
            }`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-forest flex items-center justify-center green-glow border leaf-border group-hover:scale-105 transition-all">
                        <div className="text-2xl">🦔</div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xl md:text-3xl font-bold tracking-tighter text-white font-outfit uppercase leading-none">
                            HEDGEHOGS
                        </span>
                        <span className="text-[10px] text-emerald tracking-[0.4em] font-bold uppercase mt-1">
                            Rescue Mission
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                if (link.href.startsWith('/#')) {
                                    const id = link.href.split('#')[1];
                                    if (pathname === '/') {
                                        e.preventDefault();
                                        scrollToSection(id);
                                    }
                                }
                            }}
                            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-emerald transition-all hover:tracking-[0.4em]"
                        >
                        </Link>
                    ))}
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-eligibility'))}
                        className="px-8 py-3 bg-emerald hover:bg-emerald/80 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all green-glow border-2 border-amber"
                    >
                        Check Eligibility
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-white/60 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-white/5 transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? "h-screen border-t border-white/5 opacity-100" : "h-0 border-t-0 opacity-0"
                }`}>
                <div className="p-8 flex flex-col gap-8 text-center pt-20">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                setIsMobileMenuOpen(false);
                                if (link.href.startsWith('/#')) {
                                    const id = link.href.split('#')[1];
                                    if (pathname === '/') {
                                        e.preventDefault();
                                        scrollToSection(id);
                                    }
                                }
                            }}
                            className="text-lg font-bold uppercase tracking-[0.4em] text-white/60 hover:text-emerald"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.dispatchEvent(new CustomEvent('open-eligibility'));
                            }}
                            className="w-full py-5 bg-emerald text-white font-bold text-sm uppercase tracking-[0.3em] rounded-2xl green-glow border-2 border-amber"
                        >
                            Check Eligibility
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
