import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Trophy,
  Zap,
  Gift,
  Flame,
  Code2,
  GitPullRequest,
  GraduationCap,
  Star,
  ExternalLink,
  Laptop,
  Coins,
} from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIT Student Security",
  description:
    "Exclusive security scanner for Vellore Institute of Technology students. Automated audits for hackathons, Capstone projects, referral tier rewards, and Campus Ambassador internships.",
  alternates: {
    canonical: "https://hackmywebsite.io/vit-launch",
  },
  openGraph: {
    title: "VIT Student Security Program",
    description:
      "Exclusive security scanner for VIT students. Automated vulnerability audits for hackathons and student startups.",
    url: "https://hackmywebsite.io/vit-launch",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIT Security Scanner Program",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIT Student Security Program",
    description:
      "Exclusive security scanner for VIT students. Automated vulnerability audits for hackathons and student startups.",
    images: ["/og-image.png"],
  },
};

export default function VitLaunchPage() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* ========================================================================= */}
          {/* HERO SECTION — PROMOTIONAL & CATCHY                                       */}
          {/* ========================================================================= */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-emerald-400 shadow-lg">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>VIT Vellore, Chennai, AP & Bhopal Official Launch Campaign</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Secure Your AI-Built Projects <br className="hidden sm:inline" />
                <span className="text-emerald-400">Before Submitting to Hackathons</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Instant 3-minute automated vulnerability scanning for your Capstone projects, SaaS MVPs, and Devfolio submissions. 
                Sign in with your <strong className="text-white font-semibold">@vit.ac.in</strong> or <strong className="text-white font-semibold">@vitstudent.ac.in</strong> email for instant free access.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="size-4 fill-neutral-950" />
                <span>Verify & Get Free Student Scan</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/vit-launch/ambassador"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all hover:border-slate-600"
              >
                <Trophy className="size-4 text-amber-400" />
                <span>Apply as Campus Ambassador</span>
              </Link>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-y border-slate-800/80 py-6">
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-white font-mono">100% Free</div>
                <div className="text-xs text-slate-400">For VIT Student Builds</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-emerald-400 font-mono">3 Mins</div>
                <div className="text-xs text-slate-400">Fast Hackathon Scan</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-amber-400 font-mono">1-Click PR</div>
                <div className="text-xs text-slate-400">GitHub Auto-Patch Fixes</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-orange-400 font-mono">₹15,000+</div>
                <div className="text-xs text-slate-400">Ambassador Rewards Pool</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ADVANCED CYBER STUDENT CAPABILITIES                                       */}
          {/* ========================================================================= */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                <ShieldCheck className="size-3.5" />
                <span>Advanced Cyber Tools for Student Developers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Built to Win Hackathons & Stand Out in Placements
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Everything you need to turn your vibe-coded project into an enterprise-grade, secure software build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
              
              {/* Tool 1 */}
              <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <GitPullRequest className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">GitHub Auto-Patch PRs</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automatically opens ready-to-merge Pull Requests on your repo fixing SQLi, XSS, and broken auth logic before code submission.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-emerald-400 font-semibold">
                  Zero Manual Refactoring
                </div>
              </div>

              {/* Tool 2 */}
              <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <GraduationCap className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">AI Placement Interview Prep</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generates custom cybersecurity interview questions and explanations based on the vulnerabilities detected in your own project.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-amber-400 font-semibold">
                  Top Tech Interview Ready
                </div>
              </div>

              {/* Tool 3 */}
              <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Flame className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Hackathon Speed Audit</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rapid 3-minute DAST audit on your live Vercel / Netlify / Render URLs so you can attach a security certificate to your submission.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-orange-400 font-semibold">
                  Sub-3-Minute Pipeline
                </div>
              </div>

              {/* Tool 4 */}
              <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Award className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Verified Security Badge</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Embed an authentic "Security Hardened (AI Launch Score 90+)" markdown badge in your GitHub README and LinkedIn profile.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-emerald-400 font-semibold">
                  GitHub & LinkedIn Proof
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* CAMPUS AMBASSADOR PROGRAM & REFERRAL REWARD TIERS (10, 25, 50 REFERRALS)  */}
          {/* ========================================================================= */}
          <div id="ambassador-rewards" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B0F19] via-slate-950 to-[#070A10] border-2 border-emerald-500/40 text-left shadow-2xl space-y-10">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
                  <Trophy className="size-3.5" />
                  <span>Official Campus Ambassador & Referral Program</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Refer Classmates, Earn Cash & Fast-Track Internships
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Every VIT student gets a unique referral link inside their dashboard. Share it with your project teammates, club members, and batchmates to unlock milestone rewards.
                </p>
              </div>

              <Link
                href="/vit-launch/ambassador"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] shrink-0"
              >
                <span>Apply as VIT Ambassador</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* 3 Explicit Referral Reward Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tier 1: 10 Referrals */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold">
                      <Gift className="size-5 text-emerald-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                      10 REFERRALS
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">Starter Hacker Pack</h3>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    ₹1,999 Value
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Free 6 Months VIT Pro Access</strong> with unblurred PDF security reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Exclusive Hacker Swag Kit:</strong> Premium holographic stickers + Hacker cap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Featured Campus Profile</strong> on Hack My Website Hall of Fame</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  Target: 10 student signups
                </div>
              </div>

              {/* Tier 2: 25 Referrals (Featured) */}
              <div className="p-6 rounded-2xl bg-slate-950 border-2 border-amber-500 space-y-4 flex flex-col justify-between shadow-xl shadow-amber-500/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase tracking-wider">
                  Most Popular Milestone
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                      <Coins className="size-5" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                      25 REFERRALS
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">Cash Stipend & Pro Retainer</h3>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">
                    ₹5,000 Cash + 1-Yr Pro
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>₹5,000 Direct Cash Stipend</strong> or Amazon / Flipkart vouchers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>1-Year Free Pro Plan</strong> (₹5,988 value) for all your personal projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>1-on-1 Mentorship Session</strong> with cybersecurity engineering leaders</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-amber-400 font-semibold">
                  Target: 25 student signups
                </div>
              </div>

              {/* Tier 3: 50 Referrals (Ultimate) */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                      <Award className="size-5" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono font-bold text-xs">
                      50 REFERRALS
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">Elite Fellowship & Internship</h3>
                  <div className="text-2xl font-extrabold text-orange-400 font-mono">
                    ₹15,000 + Internship
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span><strong>₹15,000 Cash Grand Reward</strong> directly transferred to bank/UPI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span><strong>Fast-Track Internship Interview</strong> for Security & Full-Stack Engineering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span><strong>Official Certificate of Excellence</strong> from AIVI Intelligence Pvt Ltd</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-orange-400 font-semibold">
                  Target: 50 student signups
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* STUDENT PRICING TIERS                                                     */}
          {/* ========================================================================= */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Transparent Student Subscriptions
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Subsidized Plans for VIT Students
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* Plan 1: VIT Free */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0B0F19] border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">VIT Free</h3>
                    <p className="text-xs text-slate-400 mt-1">Perfect for course submissions & hackathon demos.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-white py-2 border-y border-slate-800">
                    ₹0 <span className="text-xs font-normal text-slate-400">/ forever</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>1 Verified Target Domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>3 Scans per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>2-page Summary PDF Report</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>OWASP ZAP runtime test</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/workspace"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors text-center"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Plan 2: VIT Pro */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0B0F19] border-2 border-emerald-500 flex flex-col justify-between space-y-6 shadow-2xl shadow-emerald-500/15 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[11px] uppercase tracking-wide">
                  Student Favorite
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">VIT Pro</h3>
                    <p className="text-xs text-slate-400 mt-1">For active student startup founders & freelance coders.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-white py-2 border-y border-slate-800">
                    ₹499 <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>3 Verified Target Domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>15 Scans per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>Full unblurred PDF report</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>Cursor / Claude code fix prompts</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/workspace"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 text-center"
                >
                  Claim Student Pro
                </Link>
              </div>

              {/* Plan 3: Campus Team */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0B0F19] border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Campus Team / Hackathon Pack</h3>
                    <p className="text-xs text-slate-400 mt-1">For college tech clubs and project teams.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-white py-2 border-y border-slate-800">
                    ₹1,299 <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>5 Team Website Targets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>Unlimited monthly scans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>Club white-label branding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>Dedicated Discord mentor support</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors text-center"
                >
                  Contact For Team Access
                </Link>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM CALL TO ACTION                                                     */}
          {/* ========================================================================= */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/40 text-center space-y-5 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Secure Your VIT Project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Verify your domain ownership in 30 seconds and generate your free 0–100 AI Launch Score before your next code evaluation.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <span>Launch Free Student Scan</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/vit-launch/ambassador"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                <span>Apply as Ambassador</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
