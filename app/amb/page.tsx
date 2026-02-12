"use client";

import { useState } from "react";
import { ArrowLeft, Send, Loader2, CheckCircle2, XCircle, Twitter, Mail, MessageSquare, Briefcase, Link as LinkIcon, Sparkles, Gift, TrendingUp, Heart, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AmbassadorPage() {
    const [formData, setFormData] = useState({
        xHandle: "",
        email: "",
        telegramHandle: "",
        reason: "",
        contribution: "",
        previousProjects: "",
        portfolioLinks: ""
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const response = await fetch("/api/ambassador/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            setStatus("success");
            // Reset form
            setFormData({
                xHandle: "",
                email: "",
                telegramHandle: "",
                reason: "",
                contribution: "",
                previousProjects: "",
                portfolioLinks: ""
            });
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <main className="min-h-screen bg-black relative overflow-hidden">
            {/* Green Grid Background - Same as Landing Page */}
            <div className="grid-background" />
            <div className="emerald-overlay" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-emerald transition-colors mb-12 text-sm font-bold uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-white">
                        Become An
                        <br />
                        <span className="text-emerald italic">Ambassador</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-white/60 text-base md:text-lg leading-relaxed">
                        Help us spread the word about The Hedgehogs Project and make a real impact in wildlife conservation.
                        We're looking for passionate individuals to join our ambassador program.
                    </p>
                </div>

                {/* Enhanced Success State - MODAL POPUP */}
                {status === "success" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setStatus("idle")} />

                        {/* Modal Content */}
                        <div className="relative glass-card p-8 md:p-12 border border-emerald/30 max-w-4xl max-h-[90vh] overflow-y-auto space-y-8">
                            {/* Close Button */}
                            <button
                                onClick={() => setStatus("idle")}
                                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>

                            {/* Success Header */}
                            <div className="text-center space-y-4">
                                <CheckCircle2 size={64} className="mx-auto text-emerald" />
                                <h3 className="text-3xl md:text-4xl font-black text-emerald">Application Submitted!</h3>
                                <p className="text-white/80 text-lg">Thank you for your interest in becoming a Hedgehogs Ambassador!</p>
                            </div>

                            {/* Ambassador Program Details */}
                            <div className="space-y-6">
                                <h4 className="text-xl font-bold text-white text-center">Ambassador Rewards Program</h4>

                                {/* Phase Cards */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    {/* Phase 1 */}
                                    <div className="bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30 rounded-2xl p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-emerald">Phase 1</span>
                                            <Sparkles size={16} className="text-amber" />
                                        </div>
                                        <div className="text-4xl font-black text-white">$200</div>
                                        <div className="text-sm text-white/60">worth in $HOGS tokens</div>
                                        <div className="text-xs font-bold text-emerald">WEEKLY REWARDS</div>
                                        <div className="text-xs text-white/40">Top performers & early adopters</div>
                                    </div>

                                    {/* Phase 2 */}
                                    <div className="bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 rounded-2xl p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-amber">Phase 2</span>
                                            <TrendingUp size={16} className="text-emerald" />
                                        </div>
                                        <div className="text-4xl font-black text-white">$100</div>
                                        <div className="text-sm text-white/60">worth in $HOGS tokens</div>
                                        <div className="text-xs font-bold text-amber">WEEKLY REWARDS</div>
                                        <div className="text-xs text-white/40">Active contributors</div>
                                    </div>

                                    {/* Phase 3 */}
                                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Phase 3</span>
                                            <Heart size={16} className="text-white/40" />
                                        </div>
                                        <div className="text-4xl font-black text-white">$50</div>
                                        <div className="text-sm text-white/60">worth in $HOGS tokens</div>
                                        <div className="text-xs font-bold text-white/60">WEEKLY REWARDS</div>
                                        <div className="text-xs text-white/40">Community supporters</div>
                                    </div>
                                </div>

                                {/* Program Info */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                                    <h5 className="text-sm font-bold text-white uppercase tracking-wider">What Happens Next?</h5>
                                    <ul className="space-y-2 text-sm text-white/70">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-emerald mt-0.5 flex-shrink-0" />
                                            <span>Our team will review your application within 48 hours</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-emerald mt-0.5 flex-shrink-0" />
                                            <span>Selected ambassadors will be assigned to Phase 1, 2, or 3 based on experience</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-emerald mt-0.5 flex-shrink-0" />
                                            <span>You'll receive onboarding materials and your first tasks</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-emerald mt-0.5 flex-shrink-0" />
                                            <span>Weekly rewards distributed every Monday in $HOGS tokens</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => {
                                    window.location.href = '/';
                                    setTimeout(() => window.dispatchEvent(new CustomEvent('open-eligibility')), 100);
                                }}
                                className="w-full py-5 bg-emerald text-white font-extrabold text-sm uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] border-2 border-amber"
                            >
                                <Zap size={20} fill="currentColor" />
                                Scan for Airdrop
                                <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-white/40 text-xs">
                                Check your wallet eligibility for additional $HOGS token rewards
                            </p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {status === "error" && (
                    <div className="glass-card p-6 border border-red-500/20 mb-8 animate-fade-up">
                        <div className="flex items-center gap-3 text-red-400">
                            <XCircle size={24} />
                            <p className="font-medium">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Application Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 border border-white/10 space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Mail size={24} className="text-emerald" />
                            Contact Information
                        </h2>

                        {/* X Handle */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                X (Twitter) Handle *
                            </label>
                            <div className="relative">
                                <Twitter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    name="xHandle"
                                    value={formData.xHandle}
                                    onChange={handleChange}
                                    required
                                    placeholder="@yourhandle"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Telegram Handle (Optional) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                Telegram Handle <span className="text-white/40 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                                <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    name="telegramHandle"
                                    value={formData.telegramHandle}
                                    onChange={handleChange}
                                    placeholder="@yourhandle"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* About You */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Sparkles size={24} className="text-emerald" />
                            About You
                        </h2>

                        {/* Reason for Joining */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                Why do you want to become an ambassador? *
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Tell us what motivates you to join our mission..."
                                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Contribution Plan */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                How will you contribute to The Hedgehogs Project? *
                            </label>
                            <textarea
                                name="contribution"
                                value={formData.contribution}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Describe your plans for promoting the project, engaging communities, creating content, etc..."
                                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Briefcase size={24} className="text-emerald" />
                            Experience
                        </h2>

                        {/* Previous Projects */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                Previous Projects <span className="text-white/40 text-xs">(Optional)</span>
                            </label>
                            <textarea
                                name="previousProjects"
                                value={formData.previousProjects}
                                onChange={handleChange}
                                rows={4}
                                placeholder="List any relevant projects you've worked on (crypto, conservation, community building, etc)..."
                                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Portfolio Links */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-white/80">
                                Portfolio / Work Examples <span className="text-white/40 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                                <LinkIcon size={18} className="absolute left-4 top-4 text-white/40" />
                                <textarea
                                    name="portfolioLinks"
                                    value={formData.portfolioLinks}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Share links to your work, social profiles, content, or any materials that showcase your skills..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-emerald focus:outline-none transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-5 bg-emerald text-white font-extrabold text-sm uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] border-2 border-amber disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === "submitting" ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Application
                                <Send size={20} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-white/40 text-xs">
                        By submitting this form, you agree to be contacted regarding the ambassador program.
                    </p>
                </form>
            </div>
        </main>
    );
}
