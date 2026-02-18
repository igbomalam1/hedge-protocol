import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "accent" | "outline";
    size?: "sm" | "md" | "lg";
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const base = "relative font-display font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center";

        const variants = {
            primary:
                "bg-gradient-to-r from-emerald-600 to-emerald-500 text-primary-foreground hover:from-emerald-500 hover:to-emerald-400 hover:shadow-[0_0_30px_hsla(160,84%,39%,0.4)]",
            accent:
                "bg-gradient-to-r from-amber-600 to-amber-500 text-accent-foreground hover:from-amber-500 hover:to-amber-400 hover:shadow-[0_0_30px_hsla(43,96%,56%,0.4)]",
            outline:
                "border border-[hsla(0,0%,100%,0.15)] bg-transparent text-foreground hover:bg-[hsla(0,0%,100%,0.05)] hover:border-[hsla(0,0%,100%,0.25)]",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(base, variants[variant], sizes[size], className)}
                {...(props as any)}
            >
                {children}
            </motion.button>
        );
    }
);
GradientButton.displayName = "GradientButton";

export default GradientButton;
