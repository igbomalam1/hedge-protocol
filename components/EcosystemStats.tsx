"use client";

export default function EcosystemStats() {
    return (
        <section className="py-32 bg-transparent">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 italic hedgehog-gradient">Mission Impact</h2>
                        <p className="text-lg text-white/50 mb-12 leading-relaxed font-medium">
                            HEDGEHOGS is a global collaborative effort to protect our natural small wildlife. Our impact is growing every hour.
                        </p>

                        <div className="space-y-12">
                            <div className="flex items-center gap-8">
                                <div className="text-5xl font-bold italic">$2.4M</div>
                                <div className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold leading-tight">Total Support<br />Allocated</div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-5xl font-bold italic">12.5K</div>
                                <div className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold leading-tight">Verified<br />Supporters</div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-5xl font-bold italic">4.2M</div>
                                <div className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold leading-tight">Habitat Logs<br />Processed</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        {/* activity Graph placeholder */}
                        <div className="glass-card aspect-[4/3] w-full p-10 border-white/10 flex flex-col justify-end gap-2 overflow-hidden shadow-2xl transition-all duration-700 hover:border-amber/30">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber/5 via-transparent to-transparent pointer-events-none" />
                            <div className="flex items-end justify-between gap-1.5 h-3/4 mb-4 relative z-10">
                                {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${h}%` }}
                                        className="flex-1 bg-gradient-to-t from-amber/40 to-amber/10 rounded-t-lg group-hover:from-amber/70 transition-all duration-1000"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] tracking-[0.2em] text-white/30 font-bold uppercase mt-4 relative z-10">
                                <span>JANUARY 2026</span>
                                <span>FEBRUARY 2026</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 glass-card px-8 py-4 border-amber/40 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                            <p className="text-[10px] font-bold text-amber tracking-[0.4em] uppercase">Scanner Status: ACTIVE</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
