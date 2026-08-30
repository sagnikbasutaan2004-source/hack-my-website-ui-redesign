"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Zap, Send, Trophy, Sparkles, Gift, Coins, Award, ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function VitAmbassadorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    regNumber: "",
    campus: "Vellore",
    resumeLink: "",
    whyJoin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission / network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
              <Trophy className="size-3.5" />
              <span>Campus Leadership & Rewards</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Apply as a VIT Campus Security Ambassador
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Lead cybersecurity awareness at your VIT campus (Vellore, Chennai, AP, Bhopal). Earn cash rewards, exclusive hacker swag, and fast-track engineering internships.
            </p>
          </div>

          {/* Milestone Rewards Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                <Gift className="size-3.5" />
                <span>10 Referrals</span>
              </div>
              <div className="text-sm font-bold text-white">Starter Hacker Pack</div>
              <div className="text-xs text-slate-400">6-Mo Pro Plan + Swags + Cap</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-amber-500/40 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                <Coins className="size-3.5" />
                <span>25 Referrals</span>
              </div>
              <div className="text-sm font-bold text-white">₹5,000 Cash Stipend</div>
              <div className="text-xs text-slate-400">Cash + 1-Yr Pro Plan + Mentorship</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-orange-500/40 space-y-1">
              <div className="flex items-center gap-2 text-orange-400 font-mono font-bold text-xs">
                <Award className="size-3.5" />
                <span>50 Referrals</span>
              </div>
              <div className="text-sm font-bold text-white">₹15,000 + Internship</div>
              <div className="text-xs text-slate-400">Cash Grand Reward + Fast-Track Interview</div>
            </div>
          </div>

          {/* Form / Confirmation Container */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl text-left">
            {submitted ? (
              <div className="text-center space-y-5 py-6">
                <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-white">Application Received!</h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Thank you for applying to the VIT Campus Ambassador program. Our team will review your application and reach out to you at <strong className="text-white font-mono">{formData.email}</strong> within 48 hours.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/workspace"
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                  >
                    Go to Workspace & Get Referral Code
                  </Link>
                  <Link
                    href="/vit-launch"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    Back to VIT Launch Page
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 pb-3 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-white">Ambassador Registration Form</h2>
                  <p className="text-xs text-slate-400">Sign up using your official VIT student credentials.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="text-xs font-bold text-slate-200">
                      Full Name *
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="vit-email" className="text-xs font-bold text-slate-200">
                      VIT Student Email *
                    </label>
                    <input
                      id="vit-email"
                      type="email"
                      required
                      pattern=".+@(.*vit\.ac\.in|.*vitstudent\.ac\.in)$"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. aditi.sharma2023@vitstudent.ac.in"
                      className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-number" className="text-xs font-bold text-slate-200">
                      Registration Number *
                    </label>
                    <input
                      id="reg-number"
                      type="text"
                      required
                      value={formData.regNumber}
                      onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                      placeholder="e.g. 23BCE10452"
                      className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="campus-select" className="text-xs font-bold text-slate-200">
                      VIT Campus *
                    </label>
                    <select
                      id="campus-select"
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                    >
                      <option value="Vellore">VIT Vellore (Main Campus)</option>
                      <option value="Chennai">VIT Chennai</option>
                      <option value="AP">VIT-AP (Amaravati)</option>
                      <option value="Bhopal">VIT Bhopal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="resume-link" className="text-xs font-bold text-slate-200">
                    LinkedIn / GitHub / Portfolio Link
                  </label>
                  <input
                    id="resume-link"
                    type="url"
                    value={formData.resumeLink}
                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                    placeholder="https://linkedin.com/in/yourname or https://github.com/yourname"
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="why-join" className="text-xs font-bold text-slate-200">
                    Why do you want to become a Campus Ambassador?
                  </label>
                  <textarea
                    id="why-join"
                    rows={3}
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    placeholder="Tell us about the tech clubs you are part of, your hackathon experience, or how you plan to introduce Hack My Website to your batchmates..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-relaxed text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="size-3.5 fill-neutral-950" />
                      <span>Submit Ambassador Application</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
