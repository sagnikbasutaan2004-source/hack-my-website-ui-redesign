"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  FileText,
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Bot,
  ExternalLink,
  Code2,
  Terminal,
} from "lucide-react";

import { HeroMinimalistCanvas } from "@/components/hero-minimalist-canvas";

export function LandingHeroJetship() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [consoleStep, setConsoleStep] = useState(0);

  const scanSteps = [
    { label: "OWASP ZAP DAST", check: "Checking 48 active endpoint routes for authorization & XSS...", status: "PASSED" },
    { label: "Nuclei CVE Core", check: "Testing 200+ vulnerability & misconfiguration templates...", status: "1 HIGH RISKS DETECTED" },
    { label: "Semgrep SAST", check: "Scanning source files for exposed API keys & database credentials...", status: "PASSED" },
    { label: "AI Launch Score", check: "Aggregating findings into objective security score...", status: "SCORE: 88/100 (READY)" },
  ];

  // Real scan console typing step sequence (Functional Product Animation)
  useEffect(() => {
    const timer = setInterval(() => {
      setConsoleStep((prev) => (prev + 1) % scanSteps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [scanSteps.length]);

  const handleCopyPrompt = () => {
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <section className="relative pt-10 md:pt-16 pb-14 md:pb-20 border-b border-slate-800/80 bg-[#070A10] overflow-hidden">
      {/* Minimalist Interactive Canvas Backdrop */}
      <HeroMinimalistCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. CENTERED HERO HEADER WITH CLEAN UNIFORM TYPOGRAPHY                     */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          
          {/* Factual Real Status Line (Replaces decorative pill) */}
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="h-px w-8 bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-medium">
                OWASP ZAP &nbsp;●&nbsp; Nuclei v3.3 &nbsp;●&nbsp; Semgrep SAST &nbsp;●&nbsp; Playwright
              </span>
              <span className="text-slate-500 font-semibold">— All Active</span>
            </div>
            <span className="h-px w-8 bg-slate-800" />
          </div>

          {/* Clean, Uniform White Headline (No orange recolored words) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Find Security Vulnerabilities in Your Website with Actionable Fixes
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Automated security scanning for modern websites, SaaS, and web apps. 
            Run <strong className="text-white font-semibold">200+ checks</strong> across OWASP ZAP, Nuclei, and Semgrep, 
            verify domain ownership in seconds, and receive instant AI code fix prompts.
          </p>

          {/* Single Brand Green Accent Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Start Free Security Scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sample-report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold transition-all text-center"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Sample PDF Report</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. REAL FLAT PRODUCT BROWSER SCREENSHOT WITH FUNCTIONAL SCAN CONSOLE     */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mx-auto">
          
          {/* Grounded Browser Window Frame (No glowing background rings, no floating light halos) */}
          <div className="rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden space-y-4 p-5 sm:p-7 text-left">
            
            {/* Real Browser Address Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  <LockKeyhole className="size-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>https://app.verified-domain.com</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Verified DNS Ownership
                    </span>
                    <span>•</span>
                    <span>Live Audit Active</span>
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold self-start sm:self-auto">
                STATUS: AUDIT COMPLETED
              </span>
            </div>

            {/* Functional Scanning Console Simulation */}
            <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <Terminal className="size-3.5 text-emerald-400" /> Real-time Audit Console Execution
                </span>
                <span className="text-slate-500">200+ Checks Evaluated</span>
              </div>

              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-slate-300 space-y-1.5 transition-all">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">[{scanSteps[consoleStep].label}]</span>
                  <span className="text-slate-400 font-mono">{scanSteps[consoleStep].status}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {scanSteps[consoleStep].check}
                </p>
              </div>
            </div>

            {/* Metrics Row: Launch Score & Severity Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Score Dial Mini Card */}
              <div className="sm:col-span-5 p-4 rounded-xl bg-[#05070D] border border-slate-800 flex items-center gap-3.5">
                <div className="size-14 rounded-full border-4 border-emerald-500/80 flex flex-col items-center justify-center shrink-0 bg-emerald-500/5">
                  <span className="text-lg font-black font-mono text-white">88</span>
                  <span className="text-[8px] font-mono text-slate-400 uppercase -mt-1">/100</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">AI Launch Score</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Launch Ready</div>
                  <div className="text-[10px] text-slate-400">Production Hardened</div>
                </div>
              </div>

              {/* Severity Breakdown Badges (Using Color ONLY for Severity Status) */}
              <div className="sm:col-span-7 p-3.5 rounded-xl bg-[#05070D] border border-slate-800 grid grid-cols-4 gap-2 text-center">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-sm font-black font-mono text-slate-400">0</div>
                  <div className="text-[9px] font-mono text-slate-400">CRIT</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-amber-500/30">
                  <div className="text-sm font-black font-mono text-amber-400">1</div>
                  <div className="text-[9px] font-mono text-amber-300">HIGH</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-amber-500/30">
                  <div className="text-sm font-black font-mono text-amber-400">2</div>
                  <div className="text-[9px] font-mono text-amber-300">MED</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-sm font-black font-mono text-slate-400">5</div>
                  <div className="text-[9px] font-mono text-slate-400">LOW</div>
                </div>
              </div>

            </div>

            {/* Real Code Fix Directive Box */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span>Real Security Advisory & AI Fix Prompt</span>
                <span className="text-emerald-400 text-[10px]">1-Click Developer Directives</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#05070D] border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Missing Strict-Transport-Security (HSTS) Header
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Engine: Nuclei v3.3 • CVSS 5.3 • SSL/TLS Security
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold shrink-0">
                    HIGH
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-black/70 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Bot className="size-3.5 text-emerald-400" /> Cursor / Claude Remediation Directive
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-semibold"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="size-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block text-[11px] font-mono text-emerald-300 bg-black/40 p-2 rounded-lg border border-slate-800 truncate">
                    Add Strict-Transport-Security: max-age=63072000; includeSubDomains; preload in next.config.js headers().
                  </code>
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <Link
                href="/sample-report"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium"
              >
                <FileText className="size-3.5 text-emerald-400" />
                <span>Download Executive PDF Report</span>
              </Link>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">OWASP ZAP • Nuclei • Semgrep</span>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PROOF & METRICS BAR (Flat Plain Metrics)                               */}
        {/* ========================================================================= */}
        <div className="pt-6 pb-2 border-y border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">200+</div>
            <div className="text-xs text-slate-300 font-semibold">Automated Security Checks</div>
            <div className="text-[11px] text-slate-400 leading-snug">OWASP ZAP, Nuclei CVEs, and Semgrep SAST rules</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">3–8 Min</div>
            <div className="text-xs text-slate-300 font-semibold">Fast Audit Pipeline</div>
            <div className="text-[11px] text-slate-400 leading-snug">Rapid execution without slowing down deployments</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Non-Destructive</div>
            <div className="text-xs text-slate-300 font-semibold">Production Safe</div>
            <div className="text-[11px] text-slate-400 leading-snug">Safe for live environments with zero downtime risk</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">FIX → RETEST</div>
            <div className="text-xs text-slate-300 font-semibold">Verify the Fix</div>
            <div className="text-[11px] text-slate-400 leading-snug">Targeted retesting confirms vulnerabilities are genuinely resolved</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PLATFORM INTEGRATION STATUS LINE                                       */}
        {/* ========================================================================= */}
        <div className="pt-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="h-px w-12 bg-slate-800" />
            <span>Universal Security Scanning for Next.js, WordPress, Node.js, Laravel, and AI-Generated Apps</span>
            <span className="h-px w-12 bg-slate-800" />
          </div>
        </div>

      </div>
    </section>
  );
}
