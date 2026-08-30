"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  History,
  Lock,
  Rocket,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DomainHistoryItem } from "@/lib/api";

export interface SecurityPostureHistoryProps {
  historyItems: DomainHistoryItem[];
  currentScanId: string;
  targetUrl: string;
}

function getItemLaunchScore(item: DomainHistoryItem): number {
  if (item.launch_score !== undefined && item.launch_score !== null) {
    return item.launch_score;
  }
  if (item.unified_security_score !== undefined && item.unified_security_score !== null) {
    return item.unified_security_score;
  }
  if (item.trust_score !== undefined && item.trust_score !== null) {
    return item.trust_score;
  }
  if (item.risk_score !== undefined && item.risk_score !== null) {
    return Math.max(0, 100 - item.risk_score);
  }
  return 100;
}

export function SecurityPostureHistory({
  historyItems,
  currentScanId,
  targetUrl,
}: SecurityPostureHistoryProps) {
  if (!historyItems || historyItems.length === 0) {
    return null;
  }

  // Sort chronological for graph display (oldest to newest)
  const chronological = [...historyItems].reverse();

  // Metrics
  const totalScans = historyItems.length;
  const totalFixedAcrossHistory = historyItems.reduce((acc, item) => acc + (item.fixed_findings || 0) + (item.retest_fixed_findings || 0), 0);
  
  const earliestScore = chronological.length > 0 ? getItemLaunchScore(chronological[0]) : 0;
  const latestScore = chronological.length > 0 ? getItemLaunchScore(chronological[chronological.length - 1]) : 0;
  const lifetimeScoreDelta = latestScore - earliestScore;

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <History className="h-3.5 w-3.5" />
            Phase 5 • Posture & Audit Trail
          </div>
          <h3 className="text-lg font-bold font-mono text-white tracking-tight">
            Security Posture & Historical Audit Trail
          </h3>
          <p className="text-xs text-slate-400">
            Multi-scan security health progression and verified remediation timeline for <span className="font-mono text-slate-200">{targetUrl}</span>.
          </p>
        </div>

        {/* Lifetime Posture Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 uppercase text-[10px]">Lifetime Delta</span>
            <span className={`font-bold flex items-center gap-1 ${lifetimeScoreDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {lifetimeScoreDelta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {lifetimeScoreDelta >= 0 ? `+${lifetimeScoreDelta}` : lifetimeScoreDelta} pts
            </span>
          </div>
        </div>
      </div>

      {/* 3 Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
            Total Scans Completed
          </span>
          <div className="text-2xl font-bold text-white">{totalScans}</div>
          <p className="text-[11px] text-slate-400">Audited across continuous development milestones</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
            Cumulative Fixed Findings
          </span>
          <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <span>{totalFixedAcrossHistory}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">Vulnerabilities successfully remediated & verified</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
            Launch Verification Status
          </span>
          <div className="text-lg font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
            {latestScore >= 80 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Rocket className="h-4 w-4" /> Ready to Launch
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" /> Remediation Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Score gate threshold: 80 / 100 benchmark</p>
        </div>
      </div>

      {/* Visual Multi-Scan Score Stepper Timeline */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
          Score Progression Timeline
        </span>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
          <div className="flex items-center min-w-[550px] justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

            {chronological.map((item, index) => {
              const isCurrent = item.scan_id === currentScanId;
              const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `Scan #${index + 1}`;
              const score = getItemLaunchScore(item);

              return (
                <div key={item.scan_id} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm border-2 transition-all ${
                      isCurrent
                        ? "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-110"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {score}
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[11px] text-slate-300 font-bold block">
                      {dateStr}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      {isCurrent ? "(Current)" : `#${index + 1}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Audit Trail Ledger Table */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
          Scan Audit Ledger
        </span>
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3.5">Scan Date</th>
                <th className="p-3.5">Launch Score</th>
                <th className="p-3.5">Score Delta</th>
                <th className="p-3.5">Remediated</th>
                <th className="p-3.5">New Issues</th>
                <th className="p-3.5 text-right">Report Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#0B0F19]">
              {historyItems.map((item) => {
                const isCurrent = item.scan_id === currentScanId;
                const score = getItemLaunchScore(item);
                const delta = item.launch_score_delta !== undefined && item.launch_score_delta !== null
                  ? item.launch_score_delta
                  : (item.score_delta !== null && item.score_delta !== undefined ? -item.score_delta : null);
                const dateFormatted = item.created_at
                  ? new Date(item.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recorded Scan";

                return (
                  <tr
                    key={item.scan_id}
                    className={`hover:bg-slate-950/60 transition-colors ${
                      isCurrent ? "bg-emerald-950/20" : ""
                    }`}
                  >
                    <td className="p-3.5 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-200 font-medium">{dateFormatted}</span>
                      {isCurrent ? (
                        <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-400">
                          Viewing
                        </Badge>
                      ) : null}
                    </td>
                    <td className="p-3.5 font-bold text-slate-100">
                      {score} <span className="text-slate-600 font-normal">/ 100</span>
                    </td>
                    <td className="p-3.5">
                      {delta !== null && delta !== undefined ? (
                        <span className={`font-bold ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {delta >= 0 ? `+${delta}` : delta} pts
                        </span>
                      ) : (
                        <span className="text-slate-600">Baseline</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-400 font-bold">
                        {(item.fixed_findings || 0) + (item.retest_fixed_findings || 0)} resolved
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-amber-400 font-bold">
                        {item.new_findings || 0} surfaced
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {isCurrent ? (
                        <span className="text-slate-500 text-[11px] italic">Current Report</span>
                      ) : (
                        <Link
                          href={`/dashboard/scan/${item.scan_id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
