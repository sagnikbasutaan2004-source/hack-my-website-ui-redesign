"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Terminal,
  Code2,
  CheckCircle2,
  Globe,
  Lock,
} from "lucide-react";

export function LandingEvidenceProof() {
  const [activeProof, setActiveProof] = useState<"sri" | "csp" | "hsts">("sri");

  const proofData = {
    sri: {
      title: "Missing Subresource Integrity (SRI) on CDN Script",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      target: "https://demo-saas-platform.com",
      engine: "OWASP ZAP Runtime DAST",
      confidence: "High (100% Deterministic)",
      requestSnippet: `GET / HTTP/1.1\nHost: demo-saas-platform.com\nUser-Agent: Mozilla/5.0 (Security Scanner)`,
      responseSnippet: `HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\n\n<!-- Matched Script Element: -->\n<script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n[!] EVIDENCE: Script tag lacks 'integrity' hash and 'crossorigin' attribute.`,
    },
    csp: {
      title: "Permissive Content-Security-Policy Directives",
      severity: "MEDIUM",
      severityColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      target: "https://demo-saas-platform.com",
      engine: "Custom AI-Built Website Engine",
      confidence: "High (Deterministic Header Check)",
      requestSnippet: `HEAD / HTTP/1.1\nHost: demo-saas-platform.com`,
      responseSnippet: `HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Security-Policy: default-src * 'unsafe-inline';\n\n[!] EVIDENCE: Wildcard default-src allows arbitrary script/style execution. Missing object-src and base-uri restrictions.`,
    },
    hsts: {
      title: "Missing HTTP Strict Transport Security (HSTS)",
      severity: "LOW",
      severityColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      target: "https://demo-saas-platform.com",
      engine: "Nuclei v3.3 SSL/TLS Engine",
      confidence: "High (Deterministic Header Check)",
      requestSnippet: `GET / HTTP/1.1\nHost: demo-saas-platform.com`,
      responseSnippet: `HTTP/1.1 200 OK\nServer: Cloudflare\nConnection: keep-alive\n\n[!] EVIDENCE: Strict-Transport-Security header was not returned in HTTPS response. Allows potential SSL stripping.`,
    },
  };

  const current = proofData[activeProof];

  return (
    <section
      id="evidence-proof"
      aria-labelledby="evidence-proof-heading"
      className="py-16 md:py-24 border-b border-slate-800/60 bg-[#06080E]/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Verifiable Technical Evidence</span>
          </div>
          <h2
            id="evidence-proof-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Show Me the Proof
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Every finding is backed by technical evidence whenever the scanner can collect it. No vague claims. No security hallucinations.
          </p>
        </div>

        {/* Proof Inspector UI Box */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Finding Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveProof("sri")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeProof === "sri"
                  ? "bg-slate-900 border-emerald-500 text-white shadow-md"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Proof #1: Missing SRI
            </button>
            <button
              onClick={() => setActiveProof("csp")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeProof === "csp"
                  ? "bg-slate-900 border-emerald-500 text-white shadow-md"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Proof #2: Weak CSP
            </button>
            <button
              onClick={() => setActiveProof("hsts")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeProof === "hsts"
                  ? "bg-slate-900 border-emerald-500 text-white shadow-md"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Proof #3: Missing HSTS
            </button>
          </div>

          {/* Proof Details Panel */}
          <div className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${current.severityColor}`}>
                    {current.severity}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">{current.title}</span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Target: {current.target} • Engine: {current.engine}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold self-start sm:self-auto">
                {current.confidence}
              </span>
            </div>

            {/* Split Request & Response Snippet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#070A10] border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  HTTP Request Payload
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                  {current.requestSnippet}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#070A10] border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
                  HTTP Response & Evidence
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                  {current.responseSnippet}
                </pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
