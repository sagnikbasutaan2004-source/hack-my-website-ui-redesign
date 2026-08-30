"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  Info,
  Lock,
  Percent,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ScoreCategory {
  key: string;
  label: string;
  max: number;
  score: number;
  deduction: number;
  findingsCount: number;
  description: string;
}

export interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  findings: Array<{
    id: string;
    title: string;
    severity: string;
    affected_url?: string | null;
    tool_source?: string | null;
  }>;
  onSelectFinding: (findingId: string) => void;
}

const CATEGORY_DEFINITIONS = [
  {
    key: "security_basics",
    label: "Security Basics & Headers",
    max: 25,
    description: "Core defense headers (CSP, HSTS, X-Frame-Options, X-Content-Type), SSL/TLS configuration, and subresource integrity.",
  },
  {
    key: "auth_session_safety",
    label: "Auth & Session Safety",
    max: 20,
    description: "Cookie security flags (HttpOnly, Secure, SameSite), token protection, and session exposure risks.",
  },
  {
    key: "secrets_api_exposure",
    label: "Secrets & API Exposure",
    max: 20,
    description: "Hardcoded API keys, private credentials, GraphQL introspection, and exposed sensitive endpoints.",
  },
  {
    key: "production_readiness",
    label: "Production Readiness",
    max: 15,
    description: "CORS wildcard misconfigurations, verbose stack traces, server banner disclosures, and debug endpoints.",
  },
  {
    key: "payment_user_data_risk",
    label: "Payment & User Data Risk",
    max: 10,
    description: "Checkout workflow safety, payment gateway script integrity, and customer data handling boundaries.",
  },
  {
    key: "scalability_reliability",
    label: "Scalability & Reliability",
    max: 10,
    description: "Rate limiting defenses, brute-force protections, and request timeout resilience under load.",
  },
];

export function ScoreBreakdownModal({
  isOpen,
  onClose,
  currentScore,
  findings,
  onSelectFinding,
}: ScoreBreakdownModalProps) {
  if (!isOpen) return null;

  // Severity penalty mapping
  const penaltyWeights: Record<string, number> = {
    critical: 14,
    high: 9,
    medium: 5,
    low: 2,
    info: 1,
  };

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;
  const lowCount = findings.filter((f) => f.severity === "low").length;

  // Compute deterministic forecasts
  const topBlockerPenalty = findings.length > 0 ? (penaltyWeights[findings[0].severity] ?? 5) : 0;
  const scoreAfterTopBlocker = Math.min(100, currentScore + topBlockerPenalty);

  const criticalHighDeductions = criticalCount * 14 + highCount * 9;
  const scoreAfterCriticalHigh = Math.min(100, currentScore + criticalHighDeductions);

  // Distribute estimated category scores
  const categoryScores: ScoreCategory[] = CATEGORY_DEFINITIONS.map((def) => {
    let categoryFindings = 0;
    let deduction = 0;

    if (def.key === "security_basics") {
      categoryFindings = findings.filter((f) => f.title.toLowerCase().includes("header") || f.title.toLowerCase().includes("csp") || f.title.toLowerCase().includes("hsts") || f.title.toLowerCase().includes("sri") || f.title.toLowerCase().includes("clickjacking")).length;
      deduction = Math.min(def.max, categoryFindings * 5);
    } else if (def.key === "auth_session_safety") {
      categoryFindings = findings.filter((f) => f.title.toLowerCase().includes("auth") || f.title.toLowerCase().includes("cookie") || f.title.toLowerCase().includes("session") || f.title.toLowerCase().includes("token")).length;
      deduction = Math.min(def.max, categoryFindings * 6);
    } else if (def.key === "secrets_api_exposure") {
      categoryFindings = findings.filter((f) => f.title.toLowerCase().includes("key") || f.title.toLowerCase().includes("secret") || f.title.toLowerCase().includes("graphql") || f.title.toLowerCase().includes("api")).length;
      deduction = Math.min(def.max, categoryFindings * 9);
    } else {
      categoryFindings = Math.floor(findings.length / 6);
      deduction = Math.min(def.max, categoryFindings * 3);
    }

    const score = Math.max(0, def.max - deduction);

    return {
      key: def.key,
      label: def.label,
      max: def.max,
      score,
      deduction,
      findingsCount: categoryFindings,
      description: def.description,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="size-3" />
              Deterministic Scoring Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              How Your Security Launch Score is Calculated
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The AI Launch Score begins at <strong className="text-white">100 / 100</strong> and applies deterministic risk deductions based on discovered vulnerabilities across 6 core security disciplines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Core Calculation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Baseline Start</span>
            <div className="text-2xl font-bold font-mono text-white">100 / 100</div>
            <p className="text-xs text-slate-400">Perfect benchmark before active security tests run.</p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">Active Deductions</span>
            <div className="text-2xl font-bold font-mono text-rose-400">-{Math.max(0, 100 - currentScore)} pts</div>
            <p className="text-xs text-slate-400">{findings.length} findings affecting security disciplines.</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Final Launch Score</span>
            <div className="text-2xl font-bold font-mono text-emerald-300">{currentScore} / 100</div>
            <p className="text-xs text-slate-400">
              {currentScore >= 85 ? "Production Ready" : "Remediation Required Before Launch"}
            </p>
          </div>
        </div>

        {/* 6 Category Breakdown Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Shield className="size-4 text-emerald-400" />
            6 Core Security Disciplines (100 Point Breakdown)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {categoryScores.map((cat) => {
              const percentage = Math.round((cat.score / cat.max) * 100);
              const isClean = cat.deduction === 0;

              return (
                <div
                  key={cat.key}
                  className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200">{cat.label}</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className={isClean ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                        {cat.score}
                      </span>
                      <span className="text-slate-600">/ {cat.max} pts</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 80 ? "bg-emerald-400" : percentage >= 50 ? "bg-amber-400" : "bg-rose-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{cat.description}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500 border-t border-slate-900">
                    <span>Penalty impact: {cat.deduction > 0 ? `-${cat.deduction} pts` : "None (Clean ✓)"}</span>
                    <span>{cat.findingsCount > 0 ? `${cat.findingsCount} finding(s)` : "0 findings"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deterministic Score Improvement Forecast */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#071311] to-[#0B0F19] p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-300">
                Score Improvement Forecast (Estimated Impact)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Target: 85+ (Launch Ready)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Fix Top Launch Blocker</span>
              <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>{currentScore}</span>
                <ArrowRight className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">{scoreAfterTopBlocker}</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-emerald-950/60 border-emerald-500/30 text-emerald-300">
                  +{topBlockerPenalty} pts
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Resolves highest severity risk item.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Fix Critical + High</span>
              <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>{currentScore}</span>
                <ArrowRight className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">{scoreAfterCriticalHigh}</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-emerald-950/60 border-emerald-500/30 text-emerald-300">
                  +{criticalHighDeductions} pts
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Clears all severe attack vectors.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Fix All Findings</span>
              <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>{currentScore}</span>
                <ArrowRight className="size-3.5 text-emerald-400" />
                <span className="text-emerald-300">100 / 100</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-emerald-950/80 border-emerald-400 text-emerald-300">
                  +{Math.max(0, 100 - currentScore)} pts
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise security baseline achieved.</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="h-9 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
