"use client";

import React from "react";
import Link from "next/link";
import {
  LockKeyhole,
  Radar,
  Activity,
  TerminalSquare,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Workflow,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      stepNum: "Step 1",
      num: "01",
      title: "VERIFY",
      badge: "Authorization",
      icon: LockKeyhole,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/15 shadow-emerald-500/10",
      stepTag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10",
      cardBorder: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
      description: "Confirm you own or are authorized to scan the target via DNS TXT record or HTML meta tag.",
    },
    {
      stepNum: "Step 2",
      num: "02",
      title: "SCAN",
      badge: "200+ Checks",
      icon: Radar,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/15 shadow-sky-500/10",
      stepTag: "bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sky-500/10",
      cardBorder: "hover:border-sky-500/60 hover:shadow-sky-500/10",
      description: "Run automated security checks across OWASP ZAP (DAST), Nuclei (CVEs), and Semgrep (SAST).",
    },
    {
      stepNum: "Step 3",
      num: "03",
      title: "UNDERSTAND",
      badge: "AI Launch Score",
      icon: Activity,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/15 shadow-amber-500/10",
      stepTag: "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-amber-500/10",
      cardBorder: "hover:border-amber-500/60 hover:shadow-amber-500/10",
      description: "Inspect technical evidence, business impact, CVSS vectors, and your 0–100 AI Launch Score.",
    },
    {
      stepNum: "Step 4",
      num: "04",
      title: "FIX",
      badge: "AI Prompts",
      icon: TerminalSquare,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/15 shadow-purple-500/10",
      stepTag: "bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-purple-500/10",
      cardBorder: "hover:border-purple-500/60 hover:shadow-purple-500/10",
      description: "Copy IDE-ready remediation prompts formatted with exact code diffs for Cursor & Claude Code.",
    },
    {
      stepNum: "Step 5",
      num: "05",
      title: "RETEST",
      badge: "3-Sec Retest",
      icon: RotateCcw,
      color: "text-orange-400 border-orange-500/40 bg-orange-500/15 shadow-orange-500/10",
      stepTag: "bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-orange-500/10",
      cardBorder: "hover:border-orange-500/60 hover:shadow-orange-500/10",
      description: "Retest the single affected endpoint in seconds without waiting for a full multi-engine rescan.",
    },
    {
      stepNum: "Step 6",
      num: "06",
      title: "VERIFY",
      badge: "Verified Fixed",
      icon: CheckCircle2,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/15 shadow-emerald-500/10",
      stepTag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10",
      cardBorder: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
      description: "Confirm the vulnerability is resolved, update your audit ledger, and watch your Launch Score rise.",
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-16 md:py-24 border-b border-slate-800/80 bg-[#06080E]/90 relative overflow-hidden"
    >
      {/* Subtle background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 shadow-sm">
            <Workflow className="w-3.5 h-3.5" />
            <span>The Complete Security Lifecycle</span>
          </div>
          <h2
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            How It Works: From Scan to Verified Fix
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Finding vulnerabilities is only step one. Hack My Website gives engineering teams a complete, structured remediation loop to verify fixes before production release.
          </p>
        </div>

        {/* 6-Step Workflow Process Grid with Continuous Flow Connections */}
        <div className="relative">
          {/* Subtle connecting track line on desktop */}
          <div className="hidden lg:block absolute top-[44px] left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-emerald-500/20 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className={`rounded-2xl border border-slate-800/90 bg-[#0A0E18]/95 p-5 flex flex-col justify-between space-y-5 transition-all duration-200 shadow-xl group relative ${item.cardBorder}`}
                >
                  <div className="space-y-4">
                    {/* Top Bar: Icon + Number */}
                    <div className="flex items-center justify-between">
                      <div className={`size-10 rounded-xl flex items-center justify-center border shadow-md ${item.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="font-mono text-sm font-black text-slate-500 group-hover:text-white transition-colors">
                        {item.num}
                      </span>
                    </div>

                    {/* Title & Badge */}
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <div className="text-[11px] font-mono font-semibold text-slate-400">
                        {item.badge}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Highlighted Step Pill */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border tracking-wide uppercase ${item.stepTag}`}>
                      {item.stepNum}
                    </span>
                  </div>

                  {/* Connecting Arrow to Next Box on Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 size-7 rounded-full bg-[#0E1322] border border-slate-700 shadow-lg items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-colors pointer-events-none">
                      <ChevronRight className="size-4 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA to Full How It Works Guide */}
        <div className="text-center pt-2">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all hover:scale-[1.02] shadow-md group"
          >
            <span>See Complete How It Works Guide</span>
            <ArrowRight className="size-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
