import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { AILaunchScoreGauge } from "@/components/ai-launch-score-gauge";
import { LandingHeroJetship } from "@/components/landing-hero-jetship";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { LandingMultiEngineShowcase } from "@/components/landing-multi-engine-showcase";
import { LandingFaqCta } from "@/components/landing-faq-cta";
import { ProductInspectionWheel } from "@/components/product-inspection-wheel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hack My Website | Website Security Scanner",
  description:
    "Automated web security scanner for modern websites, web apps, and SaaS platforms. Run 200+ checks across OWASP ZAP (DAST), Nuclei (CVEs), and Semgrep (SAST). Receive an objective 0–100 AI Launch Score and 1-click IDE fix prompts for Cursor, Claude Code, and Windsurf.",
  alternates: {
    canonical: "https://hackmywebsite.io",
  },
  openGraph: {
    title: "Hack My Website | Automated Website Security Scanner",
    description:
      "Automated web security scanner for modern websites, web apps, and SaaS. Run 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
    url: "https://hackmywebsite.io",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hack My Website Security Scanner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hack My Website | Automated Website Security Scanner",
    description:
      "Automated web security scanner for modern websites, web apps, and SaaS. Run 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
    images: ["/og-image.png"],
  },
};

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    cadence: "per month",
    description: "Instant security scanning to identify vulnerability risks with blurred dashboard findings.",
    items: [
      "1 website target",
      "1 scan per month",
      "2-page executive PDF summary",
      "Blurred vulnerability details preview",
      "Domain ownership verification required",
    ],
    ctaText: "Start Free Scan",
    href: "/workspace",
    featured: false,
  },
  {
    name: "Starter",
    price: "₹1,999",
    cadence: "per month",
    description: "For solo founders who want full unblurred security reports and PDF exports.",
    items: [
      "1 website target",
      "3 scans per month",
      "Full unblurred PDF security report",
      "AI Launch Score evaluation",
      "Cursor / Claude Code fix prompts",
    ],
    ctaText: "Get Starter Plan",
    href: "/workspace?tab=billing&plan=starter",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹2,999",
    cadence: "per month",
    description: "The most practical tier for growing startups with GitHub integration and API fuzzing.",
    items: [
      "3 website targets",
      "10 scans per month",
      "GitHub repo SAST/DAST checks",
      "API & GraphQL fuzzing",
      "Priority scan queue processing",
    ],
    ctaText: "Get Pro Plan",
    href: "/workspace?tab=billing&plan=pro",
    featured: true,
    badgeText: "Most Practical",
  },
  {
    name: "Agency",
    price: "₹4,999",
    cadence: "per month",
    description: "For agencies and development studios requiring white-label reports and compliance maps.",
    items: [
      "10 website targets",
      "Unlimited monthly scans",
      "White-label PDF report branding",
      "Compliance mapping (SOC 2, ISO, HIPAA, DPDP)",
      "Dedicated agency support channel",
    ],
    ctaText: "Get Agency Plan",
    href: "/workspace?tab=billing&plan=agency",
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      {/* Enterprise Header Navigation */}
      <LandingHeader />

      <main id="main-content">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (DARK RADIAL EMERALD-SLATE GRADIENT)                      */}
        {/* ========================================================================= */}
        <LandingHeroJetship />

        {/* ========================================================================= */}
        {/* 2. AI LAUNCH SCORE SPOTLIGHT (DARK RADIAL TOP GRADIENT)                   */}
        {/* ========================================================================= */}
        <section
          id="launch-score"
          aria-labelledby="launch-score-heading"
          className="py-16 md:py-24 border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0e2920] via-[#090e18] to-[#04060c]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Narrative & Readiness Zones */}
              <div className="lg:col-span-5 space-y-5 text-left">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="h-px w-6 bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-300 font-medium">Actionable Security Signal</span>
                  </div>
                </div>

                <h2 id="launch-score-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  The AI Launch Score (0–100)
                </h2>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Know exactly what is lowering your security score. Our proprietary scoring engine translates 200+ technical checks into 4 distinct readiness bands with clear go/no-go guidance.
                </p>

                {/* Interactive Readiness Thresholds (Strictly Status Colors) */}
                <div className="space-y-2.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#070A10]/90 border border-emerald-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <div className="text-white font-bold">Launch Ready (85–100 pts)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Zero high/critical blockers • Safe for live users</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                      SAFE
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070A10]/90 border border-amber-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <div className="text-white font-bold">Action Recommended (70–84 pts)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Missing CSP headers or sourcemap warnings</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                      REVIEW
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070A10]/90 border border-amber-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <div className="text-white font-bold">High Risk (50–69 pts)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Unprotected API routes or permissive RLS policies</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                      RISK
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070A10]/90 border border-rose-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-rose-500 shrink-0" />
                      <div>
                        <div className="text-white font-bold">Launch Blocker (0–49 pts)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Critical SQL injection or leaked database credentials</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold border border-rose-500/20">
                      BLOCKER
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>See how the score connects to fixes and retests</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Security Cockpit Gauge */}
              <div className="lg:col-span-7">
                <AILaunchScoreGauge initialScore={92} />
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CAPABILITY INSPECTION SUITE (SPACED CAROUSEL SHOWCASE)          */}
        {/* ========================================================================= */}
        <ProductInspectionWheel />

        {/* ========================================================================= */}
        {/* 4. MULTI-ENGINE ARCHITECTURE (RADIAL BOTTOM-RIGHT GRADIENT)                */}
        {/* ========================================================================= */}
        <div className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#0d261e] via-[#080d17] to-[#04060b]">
          <LandingMultiEngineShowcase />
        </div>

        {/* ========================================================================= */}
        {/* 5. PREDICTABLE PRICING SECTION (135DEG SLATE-EMERALD GRADIENT)            */}
        {/* ========================================================================= */}
        <section
          id="pricing"
          aria-labelledby="pricing-heading"
          className="py-16 md:py-24 border-b border-slate-800/80 bg-[linear-gradient(135deg,_var(--tw-gradient-stops))] from-[#091524] via-[#0b261e] to-[#050810]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="h-px w-8 bg-slate-700" />
                <span>Transparent Subscription Tiers</span>
                <span className="h-px w-8 bg-slate-700" />
              </div>
              <h2 id="pricing-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Predictable Pricing for Founders & Agencies
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Choose a plan to run unblurred scans, get AI remediation prompts, and unlock white-label client security deliverables.
              </p>
            </div>

            {/* Semantic Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch text-left">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all backdrop-blur-md ${
                    plan.featured
                      ? "bg-[#070A10]/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10"
                      : "bg-[#070A10]/90 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.badgeText && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-emerald-500 text-neutral-950 font-bold text-[10px] tracking-wide uppercase font-mono shadow-md">
                      {plan.badgeText}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[36px] leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="py-3 border-y border-slate-800 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-white tracking-tight">{plan.price}</span>
                      <span className="text-xs text-slate-400">{plan.cadence}</span>
                    </div>

                    <ul aria-label={`${plan.name} plan features`} className="space-y-2.5 text-xs text-slate-300">
                      {plan.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800">
                    <Link
                      href={plan.href}
                      className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all text-center ${
                        plan.featured
                          ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20 hover:scale-[1.01]"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FREQUENTLY ASKED QUESTIONS & FINAL CTA (TOP-RIGHT RADIAL GRADIENT)     */}
        {/* ========================================================================= */}
        <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0f2d25] via-[#090e18] to-[#04060b]">
          <LandingFaqCta />
        </div>

      </main>

      {/* Enterprise Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
