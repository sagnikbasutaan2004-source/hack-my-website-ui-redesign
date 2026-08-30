"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function LandingPrioritization() {
  const priorityItems = [
    {
      rank: "01",
      title: "Missing Anti-Clickjacking Protection",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      impact: "Prevents attackers from embedding sensitive checkout & settings in transparent overlays.",
      whyFirst: "High business risk. Takes under 15 minutes to configure on web server response headers.",
    },
    {
      rank: "02",
      title: "Weak Content Security Policy (CSP)",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      impact: "Restricts script-src, object-src, and frame-ancestors to prevent XSS and data exfiltration.",
      whyFirst: "Eliminates malicious script injections and unauthorized third-party telemetry calls.",
    },
    {
      rank: "03",
      title: "Missing Subresource Integrity (SRI)",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      impact: "Guarantees external CDN scripts (Razorpay, Google) haven't been tampered with upstream.",
      whyFirst: "Critical supply chain defense. Requires adding cryptographic SHA-384 hashes to script tags.",
    },
  ];

  return (
    <section
      id="prioritization"
      aria-labelledby="prioritization-heading"
      className="py-16 md:py-24 border-b border-slate-800/60 bg-[#05060A]/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Leverage Remediation</span>
          </div>
          <h2
            id="prioritization-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Know What to Fix First
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Not all security alerts carry equal weight. Hack My Website orders every finding by real-world exploitability and business risk, so your team solves highest-impact vulnerabilities first.
          </p>
        </div>

        {/* 3 Prioritized Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {priorityItems.map((item) => (
            <div
              key={item.rank}
              className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-400">
                    PRIORITY {item.rank}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${item.severityColor}`}>
                    {item.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.impact}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                <div className="text-slate-400 uppercase font-semibold">Why fix first</div>
                <div className="text-slate-300">{item.whyFirst}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/sample-report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-colors"
          >
            <span>View Complete 12-Finding Sample Report</span>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            <span>Scan Your Website Now</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
