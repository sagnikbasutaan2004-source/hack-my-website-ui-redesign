"use client";

import React from "react";
import Link from "next/link";
import {
  Workflow,
  ArrowRight,
  ChevronRight,
  LockKeyhole,
  Radar,
  Activity,
  TerminalSquare,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export function LandingHowItWorksTeaser() {
  const steps = [
    { num: "01", name: "VERIFY", icon: LockKeyhole, color: "text-emerald-400" },
    { num: "02", name: "SCAN", icon: Radar, color: "text-sky-400" },
    { num: "03", name: "UNDERSTAND", icon: Activity, color: "text-amber-400" },
    { num: "04", name: "FIX", icon: TerminalSquare, color: "text-purple-400" },
    { num: "05", name: "RETEST", icon: RotateCcw, color: "text-orange-400" },
    { num: "06", name: "VERIFY", icon: CheckCircle2, color: "text-emerald-400" },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-teaser-heading"
      className="py-12 md:py-16 border-b border-slate-800/80 bg-[#06080E]/90 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Workflow className="size-3.5" />
              <span>The Complete Security Lifecycle</span>
            </div>
            <h2
              id="how-it-works-teaser-heading"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight"
            >
              How It Works: From Scan to Verified Fix
            </h2>
          </div>

          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all hover:scale-[1.02] self-start md:self-auto group shrink-0"
          >
            <span>Explore Complete 8-Step Guide</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Compact Connected 6-Stage Strip */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0A0E18] border border-slate-800 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-500 group-hover:text-white transition-colors">
                      {step.num}
                    </span>
                    <Icon className={`size-4 ${step.color}`} />
                  </div>

                  <div className="text-xs font-bold text-white tracking-tight">
                    {step.name}
                  </div>

                  {/* Connecting Arrow on Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-[#0E1322] border border-slate-700 items-center justify-center text-slate-500 pointer-events-none">
                      <ChevronRight className="size-3 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
