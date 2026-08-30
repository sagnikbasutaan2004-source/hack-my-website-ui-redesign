import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Radar,
  Activity,
  TerminalSquare,
  Zap,
  ServerCrash,
  FileCode2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Users,
  Code2,
  FileText,
  Briefcase,
} from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { AILaunchScoreGauge } from "@/components/ai-launch-score-gauge";
import { LandingSampleReportPreview } from "@/components/landing-sample-report-preview";
import { LandingRemediationLoop } from "@/components/landing-remediation-loop";
import { LandingPostureComparison } from "@/components/landing-posture-comparison";
import { LandingEvidenceProof } from "@/components/landing-evidence-proof";
import { LandingPrioritization } from "@/components/landing-prioritization";

export const metadata: Metadata = {
  title: "How It Works & Scanner Workflow",
  description:
    "See how Hack My Website scans websites, explains vulnerabilities, provides actionable AI remediation, and verifies fixes with 3.2-second targeted retesting.",
  alternates: {
    canonical: "https://hackmywebsite.io/how-it-works",
  },
  openGraph: {
    title: "How It Works | Automated Security Scanning & Remediation",
    description:
      "A complete security workflow from automated vulnerability discovery to verified fix. See evidence, get AI fix prompts for Cursor/Claude, and track posture over time.",
    url: "https://hackmywebsite.io/how-it-works",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "How Hack My Website Works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | Automated Security Scanning & Remediation",
    description:
      "A complete security workflow from automated vulnerability discovery to verified fix. See evidence, get AI fix prompts for Cursor/Claude, and track posture over time.",
    images: ["/og-image.png"],
  },
};

export default function HowItWorksPage() {
  const workflowSteps = [
    { num: "01", name: "VERIFY", subtitle: "Authorization", href: "#step-01-verify" },
    { num: "02", name: "SCAN", subtitle: "Multi-Engine", href: "#step-02-scan" },
    { num: "03", name: "UNDERSTAND", subtitle: "Evidence & Risk", href: "#step-03-understand" },
    { num: "04", name: "PRIORITIZE", subtitle: "High Leverage", href: "#step-04-prioritize" },
    { num: "05", name: "FIX", subtitle: "AI IDE Prompts", href: "#step-05-fix" },
    { num: "06", name: "RETEST", subtitle: "3.2s Retest", href: "#step-06-retest" },
    { num: "07", name: "VERIFY", subtitle: "Verified Fixed", href: "#step-07-verify" },
    { num: "08", name: "TRACK", subtitle: "Posture History", href: "#step-08-track" },
  ];

  return (
    <div className="min-h-screen text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      {/* Global Header */}
      <LandingHeader />

      <main id="main-content" className="space-y-0">
        
        {/* ========================================================================= */}
        {/* SECTION 01: PAGE HERO (#070A10)                                           */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 border-b border-slate-800/80 bg-[#070A10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-px w-8 bg-slate-800" />
              <span className="text-emerald-400 font-bold">Complete Security Engineering Workflow</span>
              <span className="h-px w-8 bg-slate-800" />
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                From Scan to Verified Code Fix
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Hack My Website doesn't stop at finding vulnerabilities. It proves the evidence, explains the risk, gives your developers an actionable AI fix prompt, and lets you retest the finding in seconds.
              </p>
            </div>

            {/* Single Brand Green CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
              >
                <Zap className="size-4 fill-neutral-950" />
                <span>Scan My Website</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/sample-report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold transition-colors"
              >
                <FileText className="size-4 text-slate-400" />
                <span>View Sample Report</span>
                <ExternalLink className="size-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Compact Visual Workflow Strip */}
            <div className="pt-8 max-w-5xl mx-auto">
              <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F19] border border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
                <span className="text-emerald-400 font-bold">01 VERIFY</span>
                <ChevronRight className="size-3.5 text-slate-600 hidden sm:block" />
                <span className="text-slate-300 font-bold">02 SCAN</span>
                <ChevronRight className="size-3.5 text-slate-600 hidden sm:block" />
                <span className="text-slate-300 font-bold">03 UNDERSTAND</span>
                <ChevronRight className="size-3.5 text-slate-600 hidden sm:block" />
                <span className="text-slate-300 font-bold">04 FIX</span>
                <ChevronRight className="size-3.5 text-slate-600 hidden sm:block" />
                <span className="text-slate-300 font-bold">05 RETEST</span>
                <ChevronRight className="size-3.5 text-slate-600 hidden sm:block" />
                <span className="text-emerald-400 font-bold">06 VERIFIED SAFE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02: THE CONNECTED LIFECYCLE (#0C101A)                              */}
        {/* ========================================================================= */}
        <section id="workflow" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#0C101A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="h-px w-8 bg-slate-700" />
                <span>Connected Lifecycle</span>
                <span className="h-px w-8 bg-slate-700" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                One Security Workflow. From Detection to Proof.
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Click any stage in the security journey to jump directly to its technical breakdown.
              </p>
            </div>

            {/* 8-Stage Interactive Connected Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {workflowSteps.map((step) => (
                <a
                  key={step.num}
                  href={step.href}
                  className="p-4 rounded-xl border border-slate-800 bg-[#070A10] hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-400 group-hover:text-white">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      ●
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                      {step.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {step.subtitle}
                    </div>
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 03: STEP 01: VERIFY (#0B0E17)                                     */}
        {/* ========================================================================= */}
        <section id="step-01-verify" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#0B0E17]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="h-px w-6 bg-slate-800" />
                  <span className="text-emerald-400 font-bold">Stage 01 • Authorization</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Security Starts with Permission
                </h2>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Before scanning, Hack My Website strictly verifies that you own or are authorized to test the target. This ensures enterprise safe-harbor compliance, eliminates spoofed target abuse, and keeps our security scans 100% legal.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200"><strong>DNS TXT Record:</strong> Add a temporary TXT token to your domain root (checked in 30 seconds).</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200"><strong>HTML Meta Tag / File:</strong> Upload a verification token to <code className="text-emerald-400 font-mono">/.well-known/hackmywebsite.txt</code>.</span>
                  </div>
                </div>
              </div>

              {/* Visual Domain Verification Flat Frame */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-[#070A10] p-6 sm:p-8 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <LockKeyhole className="size-4 text-emerald-400" />
                      <span className="text-sm font-bold text-white">Domain Ownership Verification</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      REQUIRED
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono text-[11px]">Target Domain</label>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white font-bold">
                        https://demo-saas-platform.com
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono text-[11px]">Required DNS TXT Record</label>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-400 text-xs overflow-x-auto">
                        hmw-verify=9f8c2b1e4d3a776c8890
                      </pre>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">DNS record propagated</span>
                    <span className="px-3 py-1 rounded bg-emerald-500 text-neutral-950 font-bold text-xs font-mono">
                      ✓ Target Authorized
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 04: STEP 02: SCAN (#0E131F)                                       */}
        {/* ========================================================================= */}
        <section id="step-02-scan" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#0E131F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="h-px w-8 bg-slate-700" />
                <span className="text-emerald-400 font-bold">Stage 02 • Automated Multi-Engine Scanning</span>
                <span className="h-px w-8 bg-slate-700" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Scan Your Website From Multiple Angles
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Single-engine tools miss context. Hack My Website runs a synchronized multi-engine pipeline to catch vulnerabilities across runtime, external network, and source code layers.
              </p>
            </div>

            {/* 3 Engines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Engine 1 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#070A10] border border-slate-800 space-y-4 shadow-xl">
                <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Zap className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Engine 01 • Runtime DAST</span>
                  <h3 className="text-lg font-bold text-white">OWASP ZAP Core</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Crawls your web app like an attacker. Detects XSS, SQLi, CSRF, insecure headers, and auth bypasses in active sessions.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Activity className="size-3.5 text-emerald-400" />
                  <span>Dynamic runtime crawling</span>
                </div>
              </div>

              {/* Engine 2 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#070A10] border border-slate-800 space-y-4 shadow-xl">
                <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <ServerCrash className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Engine 02 • Threat Templates</span>
                  <h3 className="text-lg font-bold text-white">Nuclei v3.3 Framework</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tests against 200+ community CVE templates for known zero-days, exposed panels, misconfigured cloud storage, and leaked secrets.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5 text-emerald-400" />
                  <span>200+ CVE vulnerability probes</span>
                </div>
              </div>

              {/* Engine 3 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#070A10] border border-slate-800 space-y-4 shadow-xl">
                <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <FileCode2 className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Engine 03 • Static Code SAST</span>
                  <h3 className="text-lg font-bold text-white">Semgrep Engine</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Audits your source code repository for leaked API keys, hardcoded credentials, dangerous regexes, and vulnerable package calls.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="size-3.5 text-emerald-400" />
                  <span>Repo-level code pattern auditing</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 05: EVIDENCE PROOF */}
        <LandingEvidenceProof />

        {/* SECTION 06: PRIORITIZATION */}
        <LandingPrioritization />

        {/* SECTION 07: REMEDIATION LOOP */}
        <LandingRemediationLoop />

        {/* SECTION 08: POSTURE COMPARISON */}
        <LandingPostureComparison />

        {/* SECTION 09: SAMPLE REPORT PREVIEW */}
        <LandingSampleReportPreview />

        {/* ========================================================================= */}
        {/* SECTION 10: TARGET PERSONAS (#070A10)                                      */}
        {/* ========================================================================= */}
        <section id="who-it-is-for" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#070A10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="h-px w-8 bg-slate-800" />
                <span>Target Personas</span>
                <span className="h-px w-8 bg-slate-800" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Built for Modern Product Teams
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Whether you are launching a startup, shipping daily commits, or delivering client deliverables, Hack My Website fits your workflow.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-3">
                <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Users className="size-5" />
                </div>
                <h3 className="text-base font-bold text-white">Founders & Solo Devs</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Know whether your website is ready to launch without hiring an expensive penetration tester.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-3">
                <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Code2 className="size-5" />
                </div>
                <h3 className="text-base font-bold text-white">Engineering Teams</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Find the root cause, get instant AI IDE fix prompts for Cursor, and verify the patch with 3.2s targeted retests.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-3">
                <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Briefcase className="size-5" />
                </div>
                <h3 className="text-base font-bold text-white">Digital Agencies</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Scan client websites and generate white-label PDF security audit deliverables branded with your agency logo.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 border-b border-slate-800/80 bg-[#0C101A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Find it. Fix it. Prove it's fixed.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Scan your website, understand the risk, fix vulnerabilities with 1-click AI IDE prompts, and verify the result in seconds.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
              >
                <Zap className="size-4 fill-neutral-950" />
                <span>Scan My Website</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <LandingFooter />
    </div>
  );
}
