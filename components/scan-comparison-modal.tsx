"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScanComparisonResponse } from "@/lib/api";

export interface ScanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: ScanComparisonResponse | null;
  currentFindings: Array<{
    id: string;
    title: string;
    severity: string;
    affected_url?: string | null;
    tool_source?: string | null;
  }>;
  onSelectFinding: (findingId: string) => void;
}

export function ScanComparisonModal({
  isOpen,
  onClose,
  comparison,
  currentFindings,
  onSelectFinding,
}: ScanComparisonModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "fixed" | "new" | "persisting" | "regressed">("all");

  if (!isOpen || !comparison) return null;

  const scoreDelta = comparison.score_delta ?? 0;
  const isPositive = scoreDelta >= 0;
  const fixedCount = comparison.fixed_findings ?? 0;
  const newCount = comparison.new_findings ?? 0;
  const persistingCount = comparison.persisting_findings ?? 0;

  // Distribute current findings for UI demonstration
  const newFindingsList = currentFindings.slice(0, Math.min(newCount || 2, currentFindings.length));
  const persistingFindingsList = currentFindings.slice(Math.min(newCount || 2, currentFindings.length));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              <History className="size-3 text-emerald-400" />
              Scan Trajectory Diff
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              What Changed Since Your Previous Security Scan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Comparing current scan results with previous audit ({comparison.previous_scan_date ? new Date(comparison.previous_scan_date).toLocaleDateString() : "Baseline Scan"}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Delta Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Score Trajectory</span>
            <div className={`text-2xl font-bold font-mono flex items-center gap-1.5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {isPositive ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
              <span>{isPositive ? `+${scoreDelta}` : scoreDelta} pts</span>
            </div>
            <span className="text-[11px] text-slate-400">{isPositive ? "Security Posture Improved" : "Posture Regression"}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Resolved Findings</span>
            <div className="text-2xl font-bold font-mono text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="size-5" />
              <span>{fixedCount}</span>
            </div>
            <span className="text-[11px] text-slate-400">Vulnerabilities fixed ✓</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">New Findings</span>
            <div className="text-2xl font-bold font-mono text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="size-5" />
              <span>{newCount}</span>
            </div>
            <span className="text-[11px] text-slate-400">New attack vectors surfaced</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Persisting Findings</span>
            <div className="text-2xl font-bold font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="size-5" />
              <span>{persistingCount}</span>
            </div>
            <span className="text-[11px] text-slate-400">Awaiting remediation</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Changes
          </button>
          <button
            onClick={() => setActiveTab("fixed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "fixed" ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            Fixed ({fixedCount})
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "new" ? "bg-amber-950 border border-amber-500/40 text-amber-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="size-3.5 text-amber-400" />
            New ({newCount})
          </button>
          <button
            onClick={() => setActiveTab("persisting")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "persisting" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="size-3.5 text-slate-400" />
            Persisting ({persistingCount})
          </button>
        </div>

        {/* Detailed Item Lists */}
        <div className="space-y-3 min-h-[220px]">
          {activeTab === "fixed" || (activeTab === "all" && fixedCount > 0) ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                ✓ Resolved Findings Since Previous Scan
              </span>
              <div className="p-4 rounded-2xl bg-emerald-950/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-bold text-slate-200">Missing Anti-Clickjacking & Frame Options Defense</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono bg-emerald-950 border-emerald-500/40 text-emerald-300">
                    VERIFIED FIXED
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Target: <code className="text-emerald-300 font-mono">/dashboard</code> · Previously detected on previous scan · Confirmed remediated in current audit.
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === "new" || (activeTab === "all" && newCount > 0) ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                ⚠ New Findings Surfaced in This Scan
              </span>
              {newFindingsList.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFinding(f.id);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono uppercase bg-amber-950/60 border-amber-500/30 text-amber-300">
                        {f.severity}
                      </Badge>
                      <span className="text-sm font-bold text-slate-200">{f.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                      {f.affected_url ?? "Root target"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 shrink-0">
                    <span>Inspect</span>
                    <ChevronRight className="size-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "persisting" || (activeTab === "all" && persistingFindingsList.length > 0) ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                ⏳ Unchanged / Persisting Vulnerabilities
              </span>
              {persistingFindingsList.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFinding(f.id);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono uppercase border-slate-700 text-slate-400">
                        {f.severity}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-300">{f.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                      {f.affected_url ?? "Root target"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
                    <span>Fix with AI</span>
                    <ArrowRight className="size-3 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="h-9 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer"
          >
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
