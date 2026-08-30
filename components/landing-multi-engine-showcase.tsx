"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar, ArrowRight, CheckCircle2, Terminal, Code2, ShieldCheck, Zap } from "lucide-react";

export function LandingMultiEngineShowcase() {
  const [selectedEngineId, setSelectedEngineId] = useState<string>("zap");

  const engines = [
    {
      id: "zap",
      name: "OWASP ZAP DAST",
      type: "Dynamic Runtime Scanning",
      checkCount: "48 Checks",
      duration: "3 mins",
      target: "Active Endpoints & Forms",
      findingExample: "Missing HSTS Header & Reflected Input",
      promptDirective: "Add Strict-Transport-Security header in Next.js response config.",
    },
    {
      id: "nuclei",
      name: "Nuclei v3.3 CVEs",
      type: "Vulnerability Templates",
      checkCount: "200+ Templates",
      duration: "2 mins",
      target: "Known CVE Advisories & Routes",
      findingExample: "Exposed .env configuration file",
      promptDirective: "Block access to .env and hidden files in NGINX / Vercel routing rules.",
    },
    {
      id: "semgrep",
      name: "Semgrep SAST",
      type: "Static Code & Secret Audit",
      checkCount: "120 Rules",
      duration: "1 min",
      target: "Source Code & Repository",
      findingExample: "Hardcoded Stripe Secret Key in API handler",
      promptDirective: "Move STRIPE_SECRET_KEY into process.env server-side environment variables.",
    },
    {
      id: "playwright",
      name: "Playwright Crawler",
      type: "DOM & Route Discovery",
      checkCount: "Full Surface Crawl",
      duration: "2 mins",
      target: "Client-Side Rendered Pages",
      findingExample: "Unauthenticated API route link in client bundle",
      promptDirective: "Add server-side auth check and protect client route hydration.",
    },
  ];

  const activeEngine = engines.find((e) => e.id === selectedEngineId) || engines[0];

  return (
    <section
      id="detection"
      aria-labelledby="multi-engine-heading"
      className="py-16 md:py-24 border-b border-slate-800/80 bg-[#0B0E17]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with Factual Status Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-px w-6 bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-medium">Engine Execution Matrix</span>
              </div>
            </div>
            <h2
              id="multi-engine-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            >
              Multi-Engine Detection Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Four specialized security engines run in parallel against your application. Hack My Website unifies their technical outputs into one actionable remediation workflow.
            </p>
          </div>

          <div>
            <Link
              href="/sample-report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-mono font-bold transition-all"
            >
              <span>View Sample Assessment Report</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Product Architecture Data Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#070A10] overflow-hidden shadow-2xl text-left">
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase text-[11px]">
                  <th className="py-3.5 px-5 font-bold">Engine</th>
                  <th className="py-3.5 px-5 font-bold">Detection Type</th>
                  <th className="py-3.5 px-5 font-bold">Check Count</th>
                  <th className="py-3.5 px-5 font-bold">Avg Duration</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {engines.map((eng) => {
                  const isSelected = eng.id === selectedEngineId;
                  return (
                    <tr
                      key={eng.id}
                      onClick={() => setSelectedEngineId(eng.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-slate-900/90 text-white" : "hover:bg-slate-900/50 text-slate-300"
                      }`}
                    >
                      <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                        <span className={`size-2 rounded-full ${isSelected ? "bg-emerald-500" : "bg-slate-600"}`} />
                        <span>{eng.name}</span>
                      </td>
                      <td className="py-4 px-5 text-slate-300">{eng.type}</td>
                      <td className="py-4 px-5 text-slate-400">{eng.checkCount}</td>
                      <td className="py-4 px-5 text-slate-400">{eng.duration}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          <CheckCircle2 className="size-3 text-emerald-400" />
                          <span>ACTIVE</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detailed Engine Technical Inspection Box */}
          <div className="p-6 border-t border-slate-800 bg-[#05070D] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                <Terminal className="size-4 text-emerald-400" />
                <span>Selected Engine Audit Output: {activeEngine.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Target: {activeEngine.target}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Real Finding Example</div>
                <div className="text-xs font-bold text-white">{activeEngine.findingExample}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Generated AI Fix Prompt Directive</div>
                <div className="text-xs font-mono text-emerald-300 truncate">{activeEngine.promptDirective}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
