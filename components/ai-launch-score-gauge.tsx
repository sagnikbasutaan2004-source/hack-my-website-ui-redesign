"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

export interface DemoTargetAudit {
  domain: string;
  category: string;
  score: number;
  verdict: "PRODUCTION HARDENED" | "MINOR ADVISORIES" | "HIGH RISK" | "LAUNCH BLOCKER";
  verdictTone: "emerald" | "amber" | "rose";
  summary: string;
  metrics: {
    dast: number;
    secrets: number;
    headers: number;
    owasp: number;
  };
  prompt: string;
}

const DEMO_TARGETS: DemoTargetAudit[] = [
  {
    domain: "acme-ecommerce.com",
    category: "Next.js SaaS",
    score: 92,
    verdict: "PRODUCTION HARDENED",
    verdictTone: "emerald",
    summary: "Zero critical or high-severity vulnerabilities. Domain verified via DNS TXT. Session tokens and CORS headers configured correctly.",
    metrics: { dast: 98, secrets: 100, headers: 90, owasp: 95 },
    prompt: `// AI Fix Prompt for Cursor / Claude Code
# Target: acme-ecommerce.com
# Context: Final production hardening check
Validate that all API routes in /app/api enforce authentication middleware and strict CORS origin headers before live release.`,
  },
  {
    domain: "cloud-crm-portal.io",
    category: "Full-Stack App",
    score: 76,
    verdict: "MINOR ADVISORIES",
    verdictTone: "amber",
    summary: "Core auth layer is safe. Missing Content-Security-Policy (CSP) headers and exposed non-sensitive JavaScript sourcemaps detected.",
    metrics: { dast: 82, secrets: 100, headers: 65, owasp: 88 },
    prompt: `// AI Fix Prompt for Cursor / Claude Code
# Target: cloud-crm-portal.io
# Fix: Add strict security headers to next.config.ts
export default {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ]
    }];
  }
};`,
  },
  {
    domain: "ai-prompt-generator.app",
    category: "AI Agent App",
    score: 62,
    verdict: "HIGH RISK",
    verdictTone: "amber",
    summary: "Unprotected REST API endpoints and public Supabase anon keys found with permissive Row Level Security (RLS) policies.",
    metrics: { dast: 60, secrets: 70, headers: 75, owasp: 65 },
    prompt: `// AI Fix Prompt for Cursor / Claude Code
# Target: ai-prompt-generator.app
# Priority: Fix exposed API route & RLS policy
1. Add server-side auth verification in /app/api/generate/route.ts
2. Enable Row Level Security (RLS) on all Supabase tables:
   ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users can only access own prompts" ON prompts FOR ALL USING (auth.uid() = user_id);`,
  },
  {
    domain: "legacy-vibe-demo.site",
    category: "Prototype",
    score: 38,
    verdict: "LAUNCH BLOCKER",
    verdictTone: "rose",
    summary: "Critical vulnerabilities detected: Exposed production database credentials in client bundle and vulnerable to SQL Injection.",
    metrics: { dast: 30, secrets: 20, headers: 40, owasp: 45 },
    prompt: `// AI Fix Prompt for Cursor / Claude Code
# Target: legacy-vibe-demo.site
# CRITICAL LAUNCH BLOCKER: Fix SQL Injection & Leaked Secret
1. Replace raw string query concatenation in /lib/db.ts with parameterized ORM bindings.
2. Revoke and rotate DATABASE_URL secret immediately from cloud provider.
3. Remove NEXT_PUBLIC_ prefixes from sensitive backend environment variables.`,
  },
];

export function AILaunchScoreGauge({ initialScore = 92 }: { initialScore?: number }) {
  const [selectedTarget, setSelectedTarget] = useState<DemoTargetAudit>(DEMO_TARGETS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTarget.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getToneBadge = (tone: DemoTargetAudit["verdictTone"]) => {
    switch (tone) {
      case "emerald":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "amber":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "rose":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  const getGaugeColor = (score: number) => {
    if (score >= 85) return "#10B981"; // Emerald Green
    if (score >= 50) return "#F59E0B"; // Amber Warning
    return "#EF4444"; // Rose Critical Blocker
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (selectedTarget.score / 100) * circumference;

  return (
    <div className="rounded-2xl bg-[#0B0F19] border border-slate-800 p-6 sm:p-8 text-left shadow-2xl space-y-6">
      
      {/* Top Header Row with Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Activity className="size-3.5" />
            <span>Target Security Cockpit</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
            Simulate Target Domain Audits
          </h3>
        </div>

        {/* Live Status Badge */}
        <span
          className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide uppercase border ${getToneBadge(
            selectedTarget.verdictTone
          )} self-start sm:self-auto`}
        >
          {selectedTarget.verdict}
        </span>
      </div>

      {/* Domain Target Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DEMO_TARGETS.map((target) => {
          const isSelected = selectedTarget.domain === target.domain;
          return (
            <button
              key={target.domain}
              type="button"
              onClick={() => setSelectedTarget(target)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-slate-900 border-emerald-500 text-white shadow-lg"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="text-xs font-bold truncate">{target.domain}</div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-slate-500">{target.category}</span>
                <span
                  className={`font-mono font-bold ${
                    target.score >= 85
                      ? "text-emerald-400"
                      : target.score >= 50
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {target.score}/100
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Gauge & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
        
        {/* Circular Gauge Graphic (4 Cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="relative size-36 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#1E293B"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={getGaugeColor(selectedTarget.score)}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {selectedTarget.score}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider -mt-1">
                Score / 100
              </span>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-300 font-medium">
            AI Launch Score Metrics
          </div>
        </div>

        {/* 4-Vector Breakdown Bars (8 Cols) */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">DAST Runtime & API Endpoints</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedTarget.metrics.dast}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${selectedTarget.metrics.dast}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Secrets & Token Leak Audit</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedTarget.metrics.secrets}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${selectedTarget.metrics.secrets}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Security Headers & SSL Encryption</span>
              <span className="font-mono text-amber-400 font-bold">{selectedTarget.metrics.headers}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${selectedTarget.metrics.headers}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">OWASP Injection Resistance (SQLi/XSS)</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedTarget.metrics.owasp}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${selectedTarget.metrics.owasp}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Target Summary Narrative */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <strong className="text-white">Audit Assessment: </strong>
        {selectedTarget.summary}
      </div>

      {/* AI Remediation Code Patch */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-emerald-400" />
            <span>AI Fix Prompt for Cursor & Claude</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors text-[10px] font-bold"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3 text-slate-400" />
                <span>Copy Fix Prompt</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-32 p-2 rounded-lg bg-black/60 border border-slate-800/80">
          {selectedTarget.prompt}
        </pre>
      </div>

    </div>
  );
}
