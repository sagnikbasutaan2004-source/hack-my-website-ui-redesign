"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Calendar,
  Layers,
  FileCode2,
  Briefcase,
  TerminalSquare,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  Zap,
} from "lucide-react";

import { sampleReport, type SampleFinding } from "@/lib/sample-report";

export default function SampleReportPage() {
  const [activeTab, setActiveTab] = useState<"findings" | "executive" | "ide-prompts">("findings");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>("sample-01");

  const totalFindings = sampleReport.findings.length;

  const filteredFindings = sampleReport.findings.filter((f) => {
    if (severityFilter === "all") return true;
    return f.severity === severityFilter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedFindingId(expandedFindingId === id ? null : id);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "low":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "info":
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-700/40";
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased pb-24">
      {/* ========================================================================= */}
      {/* TOP UTILITY & REPORT HEADER                                               */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-50 bg-[#070A10]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all hover:border-slate-600"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300">OWASP ZAP &nbsp;●&nbsp; Nuclei v3.3 &nbsp;●&nbsp; Semgrep SAST &nbsp;—&nbsp; Live Sample Report</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="size-3.5 fill-neutral-950" />
              <span>Scan Your Website Free</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. REPORT HERO & AI LAUNCH SCORE HERO BANNER                              */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">
                  SAMPLE AUDIT
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {sampleReport.scanDate}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Globe className="size-7 text-emerald-400 shrink-0" />
                <span>{sampleReport.domain}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Automated security assessment conducted across OWASP ZAP (DAST), Nuclei v3.3 CVE engine, and Semgrep static analysis.
              </p>
            </div>

            {/* AI Launch Score Metric Card */}
            <div className="flex items-center gap-6 bg-[#070A10] border border-slate-800 rounded-2xl p-4 sm:p-6 shrink-0 shadow-inner">
              <div className="space-y-1 text-right sm:text-left">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  AI Launch Score
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-amber-400 tracking-tight">
                  {sampleReport.launchScore}
                  <span className="text-lg text-slate-500 font-normal">/100</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[11px] font-bold">
                  HIGH RISK
                </div>
              </div>

              <div className="h-16 w-px bg-slate-800 hidden sm:block" />

              <div className="space-y-1 hidden sm:block text-xs font-mono text-slate-400">
                <div>Status: <strong className="text-amber-400">Pre-Launch</strong></div>
                <div>Action: <strong className="text-slate-200">Fix 3 Mediums</strong></div>
                <div>PDF: <strong className="text-emerald-400">12 Pages Ready</strong></div>
              </div>
            </div>
          </div>

          {/* Severity 5-Column Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {[
              { label: "CRITICAL", count: sampleReport.severitySummary.critical, color: "border-rose-500/30 bg-rose-950/10 text-rose-400", filter: "critical" },
              { label: "HIGH", count: sampleReport.severitySummary.high, color: "border-orange-500/30 bg-orange-950/10 text-orange-400", filter: "high" },
              { label: "MEDIUM", count: sampleReport.severitySummary.medium, color: "border-amber-500/30 bg-amber-950/10 text-amber-400", filter: "medium" },
              { label: "LOW", count: sampleReport.severitySummary.low, color: "border-sky-500/30 bg-sky-950/10 text-sky-400", filter: "low" },
              { label: "INFO", count: sampleReport.severitySummary.info, color: "border-slate-700/40 bg-slate-900/30 text-slate-400", filter: "info" },
            ].map((sev) => (
              <button
                key={sev.label}
                onClick={() => setSeverityFilter(severityFilter === sev.filter ? "all" : sev.filter)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${sev.color} ${
                  severityFilter === sev.filter ? "ring-2 ring-emerald-400 scale-[1.02]" : "hover:border-slate-600"
                }`}
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80">
                  {sev.label}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-0.5">
                  {sev.count}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE TAB NAVIGATION                                             */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("findings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "findings"
                ? "bg-slate-900 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="size-3.5 text-emerald-400" />
            <span>Discovered Vulnerabilities ({totalFindings})</span>
          </button>

          <button
            onClick={() => setActiveTab("executive")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "executive"
                ? "bg-slate-900 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="size-3.5 text-amber-400" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("ide-prompts")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "ide-prompts"
                ? "bg-slate-900 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <TerminalSquare className="size-3.5 text-sky-400" />
            <span>IDE AI Fix Prompts</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DISCOVERED FINDINGS LIST                                           */}
        {/* ========================================================================= */}
        {activeTab === "findings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredFindings.length} of {totalFindings} findings</span>
              {severityFilter !== "all" && (
                <button
                  onClick={() => setSeverityFilter("all")}
                  className="text-emerald-400 hover:underline font-mono text-xs cursor-pointer"
                >
                  Clear filter ({severityFilter})
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {filteredFindings.map((finding) => {
                const isExpanded = expandedFindingId === finding.id;
                return (
                  <div
                    key={finding.id}
                    className="rounded-2xl border border-slate-800 bg-[#0A0E18] overflow-hidden transition-all shadow-md"
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      onClick={() => toggleExpand(finding.id)}
                      className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border shrink-0 ${getSeverityBadge(
                            finding.severity
                          )}`}
                        >
                          {finding.severity}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white hover:text-emerald-300 transition-colors">
                            {finding.title}
                          </h3>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {finding.owaspCategory} • {finding.toolSource}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                          {finding.confidence} Confidence
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content Details */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-slate-800/80 bg-[#070A10]/60 space-y-5 text-xs sm:text-sm">
                        {/* Summary & Impact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                            <div className="text-[11px] font-mono text-slate-400 uppercase">What this means</div>
                            <p className="text-slate-300 leading-relaxed">{finding.summary}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                            <div className="text-[11px] font-mono text-slate-400 uppercase">Business impact</div>
                            <p className="text-slate-300 leading-relaxed">{finding.businessImpact}</p>
                          </div>
                        </div>

                        {/* Evidence */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                            Evidence: {finding.evidenceTitle}
                          </div>
                          <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800/80 whitespace-pre-wrap">
                            {finding.evidenceSummary}
                          </pre>
                        </div>

                        {/* Fix Code / Prompt */}
                        {finding.cursorPrompt && (
                          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-sky-400 font-bold flex items-center gap-1.5">
                                <Code2 className="size-3.5" />
                                Cursor / Claude AI Fix Directive
                              </span>
                              <button
                                onClick={() => handleCopy(finding.id, finding.cursorPrompt || "")}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
                              >
                                {copiedId === finding.id ? (
                                  <>
                                    <Check className="size-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3" />
                                    <span>Copy Fix Prompt</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                              {finding.cursorPrompt}
                            </pre>
                          </div>
                        )}

                        {/* Remediation Steps */}
                        <div className="space-y-2 pt-1">
                          <div className="text-[11px] font-mono text-slate-400 uppercase">Recommended Remediation</div>
                          <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                            {finding.remediation.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXECUTIVE SUMMARY                                                  */}
        {/* ========================================================================= */}
        {activeTab === "executive" && (
          <div className="rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
                <Briefcase className="size-3.5" />
                <span>Executive Decision Brief</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High-Level Security Assessment for Founders & Stakeholders
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sampleReport.executiveSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 font-mono uppercase">What Matters Most</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {sampleReport.whatMattersMost.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-rose-400 font-mono uppercase">What to Fix First</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {sampleReport.fixFirst.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 font-mono uppercase">Quick Wins</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {sampleReport.quickWins.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: IDE AI FIX PROMPTS                                                 */}
        {/* ========================================================================= */}
        {activeTab === "ide-prompts" && (
          <div className="rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400">
                <TerminalSquare className="size-3.5" />
                <span>Developer Dispatchers</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                AI Coding Prompts Ready for Cursor, Claude Code & Windsurf
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Copy any formatted remediation prompt directly into your IDE chat to apply the security patch with 0 regressions.
              </p>
            </div>

            <div className="space-y-4">
              {sampleReport.findings
                .filter((f) => f.cursorPrompt)
                .map((finding) => (
                  <div
                    key={finding.id}
                    className="p-5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${getSeverityBadge(
                            finding.severity
                          )}`}
                        >
                          {finding.severity}
                        </span>
                        <span className="text-sm font-bold text-white">{finding.title}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(finding.id, finding.cursorPrompt || "")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
                      >
                        {copiedId === finding.id ? (
                          <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
                      {finding.cursorPrompt}
                    </pre>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0A0E18] to-slate-950 border border-slate-800 text-center space-y-5 shadow-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to scan your own website?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Verify domain ownership in under 60 seconds and receive your full interactive security report with prioritized fixes.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Free Security Scan</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
