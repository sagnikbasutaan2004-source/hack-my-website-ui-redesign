import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Radar,
  LockKeyhole,
  CheckCircle2,
  FileCode2,
  Globe,
  RefreshCw,
  Flame,
} from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Scoring Methodology",
  description:
    "Explore how Hack My Website calculates the 0–100 AI Launch Score across OWASP ZAP runtime DAST, Nuclei CVE templates, Semgrep SAST, and DNS ownership signals.",
  alternates: {
    canonical: "https://hackmywebsite.io/methodology",
  },
  openGraph: {
    title: "Security Methodology & AI Launch Score Matrix",
    description:
      "Scientific vulnerability scoring matrix combining OWASP ZAP, Nuclei CVE templates, Semgrep SAST, and DNS verification.",
    url: "https://hackmywebsite.io/methodology",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Security Methodology Matrix",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Methodology & AI Launch Score Matrix",
    description:
      "Scientific vulnerability scoring matrix combining OWASP ZAP, Nuclei CVE templates, Semgrep SAST, and DNS verification.",
    images: ["/og-image.png"],
  },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="py-12 md:py-20 bg-[#070A10]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* HEADER SECTION */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-px w-8 bg-slate-800" />
              <span className="text-emerald-400 font-bold">Scientific Threat Modeling & Scoring Matrix</span>
              <span className="h-px w-8 bg-slate-800" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              AI Launch Score (0–100) Methodology
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              The AI Launch Score is an objective, mathematical security index designed to evaluate the launch-readiness of modern websites, SaaS applications, and AI tools. It synthesizes <strong>200+ automated multi-engine checks</strong> across weighted security dimensions.
            </p>
          </div>

          {/* 6 DIMENSIONS OF LAUNCH READINESS (#0C101A) */}
          <section className="p-8 sm:p-12 rounded-2xl bg-[#0C101A] border border-slate-800 space-y-10 text-left shadow-2xl">
            <div className="space-y-2 border-b border-slate-800 pb-6">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Multi-Engine Weighted Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The 6 Dimensions of Launch Readiness
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                Unlike simple linting tools, Hack My Website evaluates both dynamic runtime attack surfaces and static code posture. Each dimension carries an explicit mathematical weight representing its exploitability in production.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Dimension 1 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Radar className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      35% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">1. Runtime DAST & Fuzzing</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    OWASP ZAP active crawler fuzzing HTTP endpoints, query parameters, auth cookies, and dynamic injection points.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>SQLi, XSS, SSRF, IDOR Checks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Session Token & Auth Header Fuzzing</span>
                  </div>
                </div>
              </div>

              {/* Dimension 2 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Flame className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      20% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">2. Known CVEs & Exploits</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nuclei v3.3 template engine matching 200+ known CVEs, exposed backup databases, misconfigured Next.js routes, and unauthenticated panels.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Exposed .git, .env & Swagger Docs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Server-Side CVE Signature Matching</span>
                  </div>
                </div>
              </div>

              {/* Dimension 3 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <FileCode2 className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      20% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">3. Code SAST & Leaked Secrets</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Semgrep static analysis scanning source maps, frontend client bundles, and GitHub repositories for hardcoded API keys and tokens.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Stripe, AWS, OpenAI, Firebase Keys</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Frontend Source Map Leak Auditing</span>
                  </div>
                </div>
              </div>

              {/* Dimension 4 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Globe className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      10% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">4. Security Headers & TLS</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Browser posture validation covering HSTS preload, Content-Security-Policy (CSP), CORS wildcard rules, and secure cookie parameters.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Strict-Transport-Security & Preload</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>X-Frame-Options & CSP Directives</span>
                  </div>
                </div>
              </div>

              {/* Dimension 5 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <LockKeyhole className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      10% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">5. DNS Ownership Proof</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cryptographic DNS TXT or well-known token verification proving legal asset control, preventing unauthorized scanning.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Safe Harbor & Asset Authorization</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Automated Root/Apex Token Lookup</span>
                  </div>
                </div>
              </div>

              {/* Dimension 6 */}
              <div className="p-6 rounded-xl bg-[#070A10] border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <RefreshCw className="size-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      5% WEIGHT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">6. Remediation & Patch Velocity</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Continuous posture monitoring rewarding teams that resolve reported vulnerabilities and trigger verification re-scans.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>30-Day Patch Velocity Verification</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Historical Regression Prevention</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* DEDUCTIONS MATRIX (#0B0E17) */}
          <section className="p-8 sm:p-12 rounded-2xl bg-[#0B0E17] border border-slate-800 space-y-8 text-left shadow-2xl">
            <div className="space-y-2 border-b border-slate-800 pb-6">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Mathematical Deduction Model
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Severity Penalties & Mathematical Guardrails
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                Every scanned domain begins at a baseline of <strong>100 points</strong>. Deductions are subtracted deterministically according to CVSS 3.1 severity scores.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-start">
              
              {/* Penalty Table (7 Cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  CVSS 3.1 Severity Penalty Scale
                </div>

                <div className="space-y-3 font-mono">
                  
                  <div className="p-4 rounded-xl bg-[#070A10] border border-rose-500/40 flex items-center justify-between shadow-md">
                    <div className="space-y-0.5 font-sans">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="size-2 rounded-full bg-rose-500" />
                        <span>Critical Severity Finding</span>
                      </div>
                      <p className="text-[11px] text-slate-400">SQL Injection, Unauth RCE, Hardcoded DB Credentials</p>
                    </div>
                    <div className="text-base font-black text-rose-400 font-mono pl-4">
                      -15 PTS
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070A10] border border-amber-500/40 flex items-center justify-between shadow-md">
                    <div className="space-y-0.5 font-sans">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>High Severity Finding</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Stored XSS, Broken Object Auth (IDOR), Leaked Stripe Key</p>
                    </div>
                    <div className="text-base font-black text-amber-400 font-mono pl-4">
                      -8 PTS
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070A10] border border-amber-500/30 flex items-center justify-between shadow-md">
                    <div className="space-y-0.5 font-sans">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>Medium Severity Finding</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Missing CSP, Permissive CORS Wildcard, Open Redirect</p>
                    </div>
                    <div className="text-base font-black text-amber-400 font-mono pl-4">
                      -3 PTS
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070A10] border border-slate-800 flex items-center justify-between shadow-md">
                    <div className="space-y-0.5 font-sans">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="size-2 rounded-full bg-slate-500" />
                        <span>Low / Informational Advisory</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Missing Referrer-Policy, Verbose Server Headers</p>
                    </div>
                    <div className="text-base font-black text-slate-400 font-mono pl-4">
                      -1 PT
                    </div>
                  </div>

                </div>
              </div>

              {/* Guardrails (5 Cols) */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-[#070A10] border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="size-5 text-emerald-400" />
                  <span>Mathematical Guardrails</span>
                </div>
                
                <p className="text-slate-300 leading-relaxed">
                  To prevent duplicate warnings from masking actual code security, <strong>deductions within each vector are strictly capped at that vector's maximum assigned weight</strong>.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 font-sans">
                    Positive Bonus Incentives
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Cryptographic DNS Ownership Verified</span>
                    <span className="text-emerald-400 font-mono font-bold">+5 PTS</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>30-Day Patch Re-test Complete</span>
                    <span className="text-emerald-400 font-mono font-bold">+5 PTS</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed pt-1 font-mono">
                  Formula: <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">Score = clamp(0, 100 - Penalties + Bonuses, 100)</code>
                </div>
              </div>

            </div>
          </section>

          {/* BOTTOM CONVERSION CTA */}
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0C101A] border border-slate-800 text-center space-y-5 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Measure Your Website's Launch Readiness?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Verify your domain origin in 30 seconds and generate an objective 0–100 AI Launch Score with instant code fix prompts.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
              >
                <span>Verify Domain & Get Launch Score</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
