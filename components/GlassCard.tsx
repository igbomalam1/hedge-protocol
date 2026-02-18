import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: "primary" | "accent" | "none";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hover = false, glow = "none", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    hover ? "glass-card-hover" : "glass-card",
                    glow === "primary" && "glow-primary",
                    glow === "accent" && "glow-accent",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export default GlassCard;
