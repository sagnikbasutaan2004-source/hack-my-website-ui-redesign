"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Code2,
  Briefcase,
  Layers,
  Sparkles,
  Check,
  Copy,
  TerminalSquare,
  Network,
  Globe,
  AlertTriangle,
} from "lucide-react";

export function LandingSampleReportPreview() {
  const [activeTab, setActiveTab] = useState<"findings" | "executive" | "prompts">("findings");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleFindings = [
    {
      id: "prev-01",
      title: "Missing Clickjacking Protection",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      owasp: "A05: Security Misconfiguration",
      impact: "Allows attackers to embed pages in malicious iframes to hijack clicks.",
      prompt: "Add X-Frame-Options: SAMEORIGIN and CSP frame-ancestors 'self' to all HTTP response headers.",
    },
    {
      id: "prev-02",
      title: "Missing Subresource Integrity (SRI)",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      owasp: "A08: Software Integrity Failures",
      impact: "Third-party CDN scripts execute without cryptographic hash verification.",
      prompt: "Add integrity='sha384-...' and crossorigin='anonymous' to all external CDN script tags.",
    },
    {
      id: "prev-03",
      title: "Weak Content Security Policy (CSP)",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      owasp: "A05: Security Misconfiguration",
      impact: "Lacks explicit object-src and base-uri rules, increasing XSS exploitability.",
      prompt: "Configure strict CSP with object-src 'none', base-uri 'self', and trusted script domains.",
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="sample-report-preview"
      aria-labelledby="sample-report-preview-heading"
      className="py-16 md:py-24 border-b border-slate-800/60 bg-[#05060A]/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Deliverable Preview</span>
          </div>
          <h2
            id="sample-report-preview-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Experience the Executive & Developer Report
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Every scan generates a complete interactive dashboard with 0–100 Launch Scores, 1-click IDE prompts, and board-ready PDF exports.
          </p>
        </div>

        {/* Interactive Dashboard Mockup Card */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-[#0A0E18]/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Header of the mock */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Globe className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span>https://demo-saas-platform.com</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  12 Total Findings • Public + SAST Scan
                </div>
              </div>
            </div>

            {/* Launch Score pill */}
            <div className="flex items-center gap-3 bg-[#070A10] border border-slate-800 rounded-xl px-4 py-2 self-start sm:self-auto">
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Launch Score</div>
                <div className="text-xl font-extrabold font-mono text-amber-400">42/100</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                HIGH RISK
              </span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <button
              onClick={() => setActiveTab("findings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTab === "findings"
                  ? "bg-slate-900 border-emerald-500/60 text-white"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="size-3.5 text-emerald-400" />
              <span>Discovered Findings (Preview)</span>
            </button>

            <button
              onClick={() => setActiveTab("executive")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTab === "executive"
                  ? "bg-slate-900 border-emerald-500/60 text-white"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="size-3.5 text-amber-400" />
              <span>👔 Executive Brief</span>
            </button>

            <button
              onClick={() => setActiveTab("prompts")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTab === "prompts"
                  ? "bg-slate-900 border-emerald-500/60 text-white"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <TerminalSquare className="size-3.5 text-sky-400" />
              <span>IDE Fix Prompts</span>
            </button>
          </div>

          {/* Tab 1: Findings Preview */}
          {activeTab === "findings" && (
            <div className="space-y-3">
              {sampleFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl bg-[#070A10] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${finding.severityColor}`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-sm font-bold text-white">{finding.title}</span>
                    </div>
                    <p className="text-xs text-slate-400">{finding.impact}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {finding.owasp}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Executive Mode Preview */}
          {activeTab === "executive" && (
            <div className="p-5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-4 text-xs sm:text-sm">
              <div className="text-slate-300 leading-relaxed">
                <strong>Executive Summary:</strong> The target demonstrates strong infrastructure fundamentals but carries 3 medium-priority client-side configuration vulnerabilities. Resolving clickjacking headers and adding SRI hashes will elevate the domain to <strong>Launch Ready (85+/100)</strong> within an estimated remediation cycle of <strong>&lt; 1 Engineering Day</strong>.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-emerald-400 text-xs font-mono">SOC 2 / ISO Readiness</div>
                  <div className="text-xs text-slate-300 mt-1">Headers & script integrity required for security posture compliance.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-amber-400 text-xs font-mono">Estimated Fix Timeline</div>
                  <div className="text-xs text-slate-300 mt-1">&lt; 1 Engineering Day (Copy-paste remediation directives available).</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: IDE Fix Prompts */}
          {activeTab === "prompts" && (
            <div className="space-y-3">
              {sampleFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl bg-[#070A10] border border-slate-800/90 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{finding.title}</span>
                    <button
                      onClick={() => handleCopy(finding.id, finding.prompt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      {copiedId === finding.id ? (
                        <>
                          <Check className="size-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                    {finding.prompt}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Link Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Ready to view the complete 29-page assessment deliverable?
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/sample-report"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-colors hover:border-slate-600"
              >
                <span>Open Full Sample Report</span>
                <ExternalLink className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
              >
                <span>Scan Your Website</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
