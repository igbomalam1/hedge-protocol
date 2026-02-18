"use client";

import { useRouter } from "next/navigation";
import GradientButton from "./GradientButton";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openEligibility = () => {
        window.dispatchEvent(new CustomEvent('open-eligibility'));
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-transparent transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-border" : ""
            }`}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                <img src="/images/hedgehog_mascot.png" alt="Hedgehogs Finance" className="w-12 h-12 rounded-full" />
                {/* Text Removed as requested */}
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://t.me/hedgehogsfi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors hidden sm:flex"
                    aria-label="Telegram"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                </a>
                <a
                    href="https://x.com/hedgehogsxyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors hidden sm:flex"
                    aria-label="X (Twitter)"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <button onClick={() => router.push("/leaderboard")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                    Leaderboard
                </button>
                <button onClick={() => router.push("/ambassador")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                    Ambassador
                </button>
                <GradientButton size="sm" onClick={openEligibility} className="hidden sm:inline-flex">
                    Scan Wallet
                </GradientButton>
                <MobileMenu />
            </div>
        </nav>
    );
};

export default Navbar;
