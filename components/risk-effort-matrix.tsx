"use client";

import React, { useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Layers,
  Rocket,
  Shield,
  ShieldAlert,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FindingItem {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  affected_url?: string | null;
  business_impact?: string | null;
  tool_source?: string | null;
  owasp_category?: string | null;
}

export interface RiskEffortMatrixProps {
  findings: FindingItem[];
  onSelectFinding: (findingId: string) => void;
}

export type EffortLevel = "low" | "medium" | "high";

export function deriveRemediationEffort(title: string, severity: string): EffortLevel {
  const t = title.toLowerCase();
  // Low effort: configuration and header changes
  if (
    t.includes("header") ||
    t.includes("x-frame-options") ||
    t.includes("hsts") ||
    t.includes("content-type") ||
    t.includes("sri") ||
    t.includes("subresource") ||
    t.includes("cookie") ||
    t.includes("banner")
  ) {
    return "low";
  }
  // Medium effort: CORS, CSP, error handling
  if (t.includes("csp") || t.includes("cors") || t.includes("stack") || t.includes("error") || t.includes("graphql")) {
    return "medium";
  }
  // High effort: SQLi, Auth restructuring, XSS refactoring
  if (t.includes("sql") || t.includes("injection") || t.includes("auth") || t.includes("xss") || severity === "critical") {
    return "high";
  }
  return "medium";
}

export function RiskEffortMatrix({ findings, onSelectFinding }: RiskEffortMatrixProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<"quick_wins" | "major_milestones" | "low_hanging" | "backlog">("quick_wins");

  const categorizedFindings = useMemo(() => {
    const quickWins: FindingItem[] = [];
    const majorMilestones: FindingItem[] = [];
    const lowHanging: FindingItem[] = [];
    const backlog: FindingItem[] = [];

    findings.forEach((f) => {
      const effort = deriveRemediationEffort(f.title, f.severity);
      const isHighRisk = f.severity === "critical" || f.severity === "high" || f.severity === "medium";

      if (isHighRisk && (effort === "low" || effort === "medium")) {
        quickWins.push(f);
      } else if (isHighRisk && effort === "high") {
        majorMilestones.push(f);
      } else if (!isHighRisk && effort === "low") {
        lowHanging.push(f);
      } else {
        backlog.push(f);
      }
    });

    return { quickWins, majorMilestones, lowHanging, backlog };
  }, [findings]);

  const activeList = useMemo(() => {
    switch (selectedQuadrant) {
      case "quick_wins":
        return categorizedFindings.quickWins;
      case "major_milestones":
        return categorizedFindings.majorMilestones;
      case "low_hanging":
        return categorizedFindings.lowHanging;
      case "backlog":
        return categorizedFindings.backlog;
    }
  }, [selectedQuadrant, categorizedFindings]);

  // Top 3 Recommended Next Actions
  const topRecommendedActions = useMemo(() => {
    return [...categorizedFindings.quickWins, ...categorizedFindings.majorMilestones, ...findings].slice(0, 3);
  }, [categorizedFindings, findings]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <Zap className="size-3" />
            Remediation Prioritizer
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
            Risk × Effort Matrix & Recommended Next Actions
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Intelligently ranked remediation plan. Fix high-impact, low-effort vulnerabilities first to maximize your security score.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 shrink-0">
          {findings.length} Actionable Items
        </div>
      </div>

      {/* 1. Top 3 Ranked Recommended Actions Cards */}
      <div className="space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
          <Flame className="size-3.5 text-emerald-400" />
          Top Recommended Next Actions (Highest Score ROI)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {topRecommendedActions.map((finding, idx) => {
            const effort = deriveRemediationEffort(finding.title, finding.severity);
            const effortBadge =
              effort === "low"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                : effort === "medium"
                ? "bg-amber-950/80 text-amber-300 border-amber-500/30"
                : "bg-rose-950/80 text-rose-300 border-rose-500/30";

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding.id)}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all cursor-pointer space-y-3 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black text-slate-600">0{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`text-[10px] font-mono uppercase font-bold ${effortBadge}`}>
                        {effort} effort
                      </Badge>
                      <Badge
                        variant={
                          finding.severity === "critical"
                            ? "critical"
                            : finding.severity === "high"
                            ? "high"
                            : finding.severity === "medium"
                            ? "medium"
                            : finding.severity === "low"
                            ? "low"
                            : "outline"
                        }
                        className="font-mono text-[10px] uppercase font-bold"
                      >
                        {finding.severity}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {finding.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {finding.business_impact ?? "Immediate remediation recommended to protect production traffic."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span className="truncate text-slate-500 text-[11px] max-w-[150px]">{finding.affected_url ?? "Root"}</span>
                  <span className="inline-flex items-center gap-1 font-bold">
                    Fix with AI <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive 4-Quadrant Visual Matrix */}
      <div className="space-y-3 pt-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
          <Layers className="size-3.5 text-slate-400" />
          4-Quadrant Prioritization Explorer
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedQuadrant("quick_wins")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedQuadrant === "quick_wins"
                ? "border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
                : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400">Quick Wins</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {categorizedFindings.quickWins.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">High Risk / Low-Med Effort</span>
          </button>

          <button
            onClick={() => setSelectedQuadrant("major_milestones")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedQuadrant === "major_milestones"
                ? "border-orange-500/60 bg-orange-950/20 shadow-lg shadow-orange-500/10"
                : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-orange-400">Major Sprints</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {categorizedFindings.majorMilestones.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">High Risk / High Effort</span>
          </button>

          <button
            onClick={() => setSelectedQuadrant("low_hanging")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedQuadrant === "low_hanging"
                ? "border-sky-500/60 bg-sky-950/20 shadow-lg shadow-sky-500/10"
                : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-sky-400">Low-Hanging</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {categorizedFindings.lowHanging.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">Low Risk / Low Effort</span>
          </button>

          <button
            onClick={() => setSelectedQuadrant("backlog")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedQuadrant === "backlog"
                ? "border-slate-500/60 bg-slate-800/40 shadow-lg"
                : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-300">Backlog</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {categorizedFindings.backlog.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">Low Risk / High Effort</span>
          </button>
        </div>

        {/* Selected Quadrant Item List */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          {activeList.length > 0 ? (
            activeList.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFinding(f.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all cursor-pointer gap-4"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase font-bold border-slate-700 text-slate-300">
                      {f.severity}
                    </Badge>
                    <span className="text-xs font-bold text-slate-200 truncate">{f.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block truncate">
                    {f.affected_url ?? "Root target"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 shrink-0 font-bold">
                  <span>Remediate</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs font-mono text-slate-500">
              No findings in this quadrant. Great work!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
