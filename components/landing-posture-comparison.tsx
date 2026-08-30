"use client";

import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  History,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export function LandingPostureComparison() {
  return (
    <section
      id="security-posture"
      aria-labelledby="security-posture-heading"
      className="py-16 md:py-24 border-b border-slate-800/60 bg-[#06080E]/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <History className="w-3.5 h-3.5" />
            <span>Continuous Audit Ledger</span>
          </div>
          <h2
            id="security-posture-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Your Security Posture Shouldn't Be a Snapshot
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Every deployment introduces changes. Hack My Website automatically tracks what changed between your scans, proving remediation progress to founders, clients, and compliance auditors.
          </p>
        </div>

        {/* Visual Scan Comparison Panel */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                <span>Multi-Scan Audit Trail & Progression</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Target: https://demo-saas-platform.com
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-[#070A10] border border-slate-800 rounded-2xl px-4 py-2 self-start sm:self-auto">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Score Delta</div>
                <div className="text-xl font-black font-mono text-emerald-400 flex items-center gap-1">
                  <span>+7 pts</span>
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-xs font-mono text-slate-300">
                <span>31 → <strong>38/100</strong></span>
              </div>
            </div>
          </div>

          {/* 4 Comparison Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1 text-left">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Fixed Findings</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">4</div>
              <div className="text-[11px] text-slate-400">Verified resolved</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1 text-left">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">New Surfaced</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">5</div>
              <div className="text-[11px] text-slate-400">Since last scan</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-left">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Active Findings</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-200">12</div>
              <div className="text-[11px] text-slate-400">Total in current audit</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-left">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Regressions</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">0</div>
              <div className="text-[11px] text-slate-400">Reopened issues</div>
            </div>
          </div>

          {/* Audit Ledger Snippet */}
          <div className="p-4 rounded-2xl bg-[#070A10] border border-slate-800 space-y-3 text-left">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Recent Changes in Audit Ledger</span>
              <span className="text-[10px] text-emerald-400">Scan #04 vs #03</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    FIXED
                  </span>
                  <span className="text-white font-medium">Strict-Transport-Security (HSTS) Enabled</span>
                </div>
                <span className="text-emerald-400 font-mono text-xs">+3 pts</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    FIXED
                  </span>
                  <span className="text-white font-medium">Missing Subresource Integrity (SRI) for Checkout.js</span>
                </div>
                <span className="text-emerald-400 font-mono text-xs">+4 pts</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    NEW
                  </span>
                  <span className="text-slate-300 font-medium">Unrestricted Permissions-Policy detected on /dashboard</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">-1 pt</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
