"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  FileCode2,
  AlertTriangle,
  Bot,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Layers,
  Sparkles,
} from "lucide-react";

export function LandingRemediationLoop() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isRetesting, setIsRetesting] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const stages = [
    {
      id: "detected",
      title: "1. Finding Detected",
      short: "Detection",
      icon: ShieldAlert,
      tag: "DAST & SAST Alert",
      tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      id: "evidence",
      title: "2. Evidence Found",
      short: "Evidence",
      icon: FileCode2,
      tag: "Technical Proof",
      tagColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    },
    {
      id: "risk",
      title: "3. Risk Explained",
      short: "Impact",
      icon: AlertTriangle,
      tag: "Business Context",
      tagColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    },
    {
      id: "fix",
      title: "4. AI Fix Generated",
      short: "AI Fix",
      icon: Bot,
      tag: "Cursor & Claude Prompt",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "retest",
      title: "5. Targeted Retest",
      short: "Retest",
      icon: RotateCcw,
      tag: "3.2s Retest Loop",
      tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
    {
      id: "verified",
      title: "6. Verified Fixed",
      short: "Verified",
      icon: CheckCircle2,
      tag: "Resolved State",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `// Next.js headers config\nasync headers() {\n  return [{\n    source: '/:path*',\n    headers: [\n      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },\n      { key: 'Content-Security-Policy', value: "frame-ancestors 'self';" }\n    ]\n  }];\n}`
    );
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleTriggerRetest = () => {
    setIsRetesting(true);
    setTimeout(() => {
      setIsRetesting(false);
      setIsFixed(true);
      setCurrentStage(5);
    }, 1800);
  };

  return (
    <section
      id="remediation-loop"
      aria-labelledby="remediation-loop-heading"
      className="py-16 md:py-24 border-b border-slate-800/60 bg-[#05060A]/40 backdrop-blur-sm relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Verified Remediation Engine</span>
          </div>
          <h2
            id="remediation-loop-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Don't Just Find Vulnerabilities. Prove They're Fixed.
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Finding a security bug is only half the battle. Hack My Website proves the vulnerability with technical evidence, generates copy-paste AI fix prompts, and lets you retest the specific endpoint to confirm it's closed.
          </p>
        </div>

        {/* Interactive Interactive Walkthrough Container */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Top Stage Navigation Stepper */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pb-4 border-b border-slate-800/80">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = currentStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(idx)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-102"
                      : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                  <span className="text-[11px] font-bold tracking-tight truncate w-full">{stage.short}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Details based on currentStage */}
          <div className="rounded-2xl border border-slate-800/90 bg-[#070A10] p-5 sm:p-7 space-y-5 text-left">
            
            {/* Header bar of simulated finding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    MEDIUM SEVERITY
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    OWASP A05: Security Misconfiguration
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Missing Clickjacking Protection (X-Frame-Options)
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  isFixed || currentStage === 5
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {isFixed || currentStage === 5 ? "✓ VERIFIED FIXED" : "STATUS: OPEN"}
                </span>
              </div>
            </div>

            {/* Stage Content Renderers */}
            {currentStage === 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase">Automated Detection Output</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our custom DAST engine detected that target domain <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">https://example.com</code> does not return an <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">X-Frame-Options</code> or <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">frame-ancestors</code> directive on response headers.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                  Target URI: https://example.com/checkout • Scanner: Custom DAST Rule #10020 • Confidence: High
                </div>
              </div>
            )}

            {currentStage === 1 && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-sky-400 uppercase">Exact Technical Evidence</div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
{`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Server: Cloudflare
[!] MISSING: X-Frame-Options: SAMEORIGIN
[!] MISSING: Content-Security-Policy: frame-ancestors 'self';`}
                </pre>
                <p className="text-xs text-slate-400">
                  Zero guesswork: Every finding is paired with exact HTTP request and response evidence captured during scan execution.
                </p>
              </div>
            )}

            {currentStage === 2 && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-orange-400 uppercase">Business Risk & Impact Explanation</div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Why this matters:</strong> Without frame protection, attackers can embed your website inside an invisible iframe on a malicious domain, tricking authenticated users into clicking buttons or executing unauthorized transactions (UI redressing).
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Estimated Fix Time: &lt; 15 minutes • Risk Reduction: Prevents authenticated UI clickjacking
                  </p>
                </div>
              </div>
            )}

            {currentStage === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 uppercase">1-Click AI Fix Prompt (Cursor / Claude)</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`// Add to Next.js config headers:
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self';" }
    ]
  }];
}`}
                </pre>
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-purple-400 uppercase">Targeted Single-Endpoint Retest</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Once you deploy your code fix, there's no need to rerun a 5-minute full scan. Hit <strong>Retest Finding</strong> to verify that single URL in under 3.2 seconds.
                </p>
                <button
                  onClick={handleTriggerRetest}
                  disabled={isRetesting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`size-3.5 ${isRetesting ? "animate-spin" : ""}`} />
                  <span>{isRetesting ? "Retesting Endpoint..." : "Trigger 3.2s Retest"}</span>
                </button>
              </div>
            )}

            {currentStage === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span>Fix Verified & Validated</span>
                  </div>
                  <p className="text-slate-200">
                    Endpoint responded with <code className="font-mono text-emerald-300">X-Frame-Options: SAMEORIGIN</code>. Finding moved to <strong>Resolved</strong> and AI Launch Score increased by <strong>+4 points</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Stepper Progress Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span>Stage {currentStage + 1} of 6</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStage((prev) => Math.max(0, prev - 1))}
                  disabled={currentStage === 0}
                  className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStage((prev) => Math.min(5, prev + 1))}
                  disabled={currentStage === 5}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold cursor-pointer disabled:opacity-30"
                >
                  Next Stage
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
