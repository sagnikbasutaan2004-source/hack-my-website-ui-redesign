"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  TerminalSquare,
  Network,
  History,
  RotateCcw,
  GitPullRequest,
  Briefcase,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Code2,
  Zap,
  ExternalLink,
  Layers,
} from "lucide-react";

export function PlatformCapabilitiesMatrix() {
  const pillars = [
    {
      id: "launch-score",
      icon: Sparkles,
      badge: "0–100 Metric",
      theme: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      title: "AI Launch Score (0–100)",
      tagline: "Instant production readiness evaluation",
      description:
        "Translates 200+ raw DAST, SAST, and CVE vulnerabilities into an intuitive 0–100 health metric divided into 4 clear readiness bands.",
      stat: "92 / 100",
      statLabel: "Launch Ready",
      statColor: "text-emerald-400",
      highlights: ["Objective risk grading", "Zero-noise score delta", "Go/No-go launch guidance"],
    },
    {
      id: "ide-dispatch",
      icon: TerminalSquare,
      badge: "Developer Tool",
      theme: "sky",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      title: "1-Click IDE & AI Dispatchers",
      tagline: "Fix vulnerabilities directly in code",
      description:
        "Deep-link directly into Cursor, VS Code, and Windsurf with exact line numbers, or copy prompts optimized for Claude Code & Antigravity.",
      stat: "1-Click",
      statLabel: "Cursor & Claude Ready",
      statColor: "text-sky-400",
      highlights: ["Direct editor file links", "Copy-paste AI fix prompts", "Replay cURL terminal commands"],
    },
    {
      id: "attack-surface",
      icon: Network,
      badge: "Perimeter Graph",
      theme: "amber",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      title: "Attack Surface & Route Graph",
      tagline: "Visual endpoint and route clustering",
      description:
        "Map your active perimeter across 4 functional hubs: Auth, APIs, Admin, and Public routes. Click any node to filter related vulnerabilities.",
      stat: "4 Hubs",
      statLabel: "Full Perimeter Map",
      statColor: "text-amber-400",
      highlights: ["Interactive node clusters", "Per-route severity badges", "Dynamic vulnerability filtering"],
    },
    {
      id: "audit-trail",
      icon: History,
      badge: "Continuous Audit",
      theme: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      title: "Multi-Scan Audit Trail",
      tagline: "Track security score progression over time",
      description:
        "Visual stepper timeline tracking cumulative lifetime score improvements (+N pts) and historical audit ledgers of fixed vs new findings.",
      stat: "+12 pts",
      statLabel: "Lifetime Security Delta",
      statColor: "text-emerald-400",
      highlights: ["Scan-by-scan score deltas", "Historical audit ledger", "Cumulative progress tracking"],
    },
    {
      id: "retest-loop",
      icon: RotateCcw,
      badge: "Live Verification",
      theme: "sky",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      title: "3-Second Targeted Retests",
      tagline: "Verify single fixes without full scan re-runs",
      description:
        "Deployed a fix for a specific vulnerability? Retest that single endpoint in seconds and automatically mark findings as Fixed.",
      stat: "3.2s",
      statLabel: "Targeted Retest Time",
      statColor: "text-sky-400",
      highlights: ["Single-finding verification", "Live telemetry response", "Risk acceptance audit logs"],
    },
    {
      id: "team-ticketing",
      icon: GitPullRequest,
      badge: "Sprint Workflow",
      theme: "purple",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      title: "GitHub, Linear & Jira Ticketing",
      tagline: "Turn findings into sprint issues instantly",
      description:
        "Bridge security directly into developer workflows. Generate pre-filled GitHub Issues and Linear Tasks with CVSS scores and code patches.",
      stat: "3 Tools",
      statLabel: "GitHub • Linear • Jira",
      statColor: "text-purple-400",
      highlights: ["Pre-filled issue templates", "Linear severity label sync", "Jira markdown export"],
    },
    {
      id: "executive-mode",
      icon: Briefcase,
      badge: "Board Brief",
      theme: "amber",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      title: "Executive Presentation Mode",
      tagline: "Founder & board-ready security summaries",
      description:
        "Toggle from technical deep-dive into clean Executive Presentation Mode with estimated engineering fix timelines and compliance maps.",
      stat: "Executive",
      statLabel: "Board & Investor Ready",
      statColor: "text-amber-400",
      highlights: ["1-Click simplified view", "Engineering fix timelines", "SOC 2 & ISO compliance maps"],
    },
    {
      id: "secure-sharing",
      icon: Share2,
      badge: "Client Sharing",
      theme: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      title: "Tokenized Secure Client Sharing",
      tagline: "Share read-only audit reports safely",
      description:
        "Generate tokenized, password-less read-only sharing links for external clients, with custom expiration (24h/7d/30d) and secret masking.",
      stat: "Masked",
      statLabel: "Expiring Tokenized Links",
      statColor: "text-emerald-400",
      highlights: ["Configurable link expiry", "Automatic secret redaction", "1-Click email report composer"],
    },
  ];

  return (
    <section
      id="platform-capabilities"
      aria-labelledby="platform-capabilities-heading"
      className="py-16 md:py-24 border-b border-slate-800/80 bg-[#06080E]/90 relative overflow-hidden"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete SecOps Ecosystem</span>
          </div>
          <h2
            id="platform-capabilities-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            8 Enterprise Pillars Built for Modern Web Engineering
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            From automated vulnerability discovery to instant AI-assisted patch generation and client-ready reporting — everything your team needs before shipping to production.
          </p>
        </div>

        {/* 8-Card Responsive Grid (4 cols on desktop, 2 cols on tablet, 1 col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-5 sm:p-6 flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all shadow-xl shadow-black/40 hover:-translate-y-0.5 group"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full border font-mono text-[10px] font-bold ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-[11px] font-mono text-emerald-400/90 font-medium">
                      {pillar.tagline}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Section: Stat Box & Bullets */}
                <div className="space-y-3.5 pt-3 border-t border-slate-800/80">
                  {/* Key Highlights */}
                  <ul className="space-y-1.5">
                    {pillar.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mini Stat Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-[10px] text-slate-400 truncate">{pillar.statLabel}</span>
                    <span className={`text-xs font-bold shrink-0 ${pillar.statColor}`}>{pillar.stat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="size-4 fill-neutral-950" />
            <span>Launch Free Security Scan</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/sample-report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-colors hover:border-slate-600"
          >
            <span>Explore Sample Report</span>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
