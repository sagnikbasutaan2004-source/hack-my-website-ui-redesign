"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function LandingFaqCta() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What does Hack My Website scan?",
      answer:
        "Hack My Website scans your target website or API across 200+ automated vulnerability checks combining runtime DAST (OWASP ZAP), CVE exploit templates (Nuclei), static code analysis (Semgrep), and custom SaaS misconfiguration engines.",
    },
    {
      question: "How long does a security scan take?",
      answer:
        "Standard vulnerability scans complete in 3 to 8 minutes, crawling active routes, verifying security headers, checking SSL/TLS parameters, and auditing API endpoints without human bottleneck.",
    },
    {
      question: "Is scanning destructive or will it cause downtime?",
      answer:
        "All automated checks are 100% non-destructive and safe for production environments. We never perform high-volume DDoS attacks or destructive database writes.",
    },
    {
      question: "How does domain verification work?",
      answer:
        "To prevent unauthorized testing and guarantee safe harbor compliance, you must verify domain ownership via a DNS TXT record or by placing a verification file at /.well-known/hackmywebsite.txt before any scan can run.",
    },
    {
      question: "What is the AI Launch Score?",
      answer:
        "The AI Launch Score is an objective 0–100 health metric that normalizes raw technical vulnerabilities into 4 clear readiness bands: Launch Ready (85–100), Action Recommended (70–84), High Risk (50–69), and Launch Blocker (0–49).",
    },
    {
      question: "Can I retest a single vulnerability after deploying a fix?",
      answer:
        "Yes! Once you deploy a fix, you can use our 3-Second Targeted Retest feature to verify that specific finding without waiting for a 5-minute full scan re-run.",
    },
    {
      question: "Can agencies white-label reports for clients?",
      answer:
        "Yes. The Agency tier enables full white-labeling, allowing you to add your agency logo, primary brand colors, client target profiles, and generate board-ready PDF deliverables.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#070A10]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* FAQ Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="h-px w-8 bg-slate-800" />
            <span>Frequently Asked Questions</span>
            <span className="h-px w-8 bg-slate-800" />
          </div>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Clear Answers for Engineering Teams
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Everything you need to know about our scanning methodology, domain authorization, and remediation workflows.
          </p>
        </div>

        {/* FAQ Plain Text List */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#0B0F19] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#05070D]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final CTA Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0B0F19] border border-slate-800 text-center space-y-5 shadow-2xl">
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="h-px w-8 bg-slate-800" />
            <span className="text-emerald-400 font-bold">Ready to Harden Your Web Perimeter?</span>
            <span className="h-px w-8 bg-slate-800" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find it. Fix it. Prove it's fixed.
          </h3>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Scan your website, understand the risk, fix vulnerabilities with 1-click AI IDE prompts, and verify the result in seconds.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="size-4 fill-neutral-950" />
              <span>Start Free Security Scan</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/sample-report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold transition-colors"
            >
              <FileText className="size-4 text-slate-400" />
              <span>View Sample PDF Report</span>
              <ExternalLink className="size-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
