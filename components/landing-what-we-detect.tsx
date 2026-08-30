"use client";

import React from "react";
import {
  ShieldAlert,
  Globe,
  FileCode2,
  ServerCrash,
  PackageCheck,
  Bot,
  Radar,
  Zap,
  Share2,
  Code2,
  Layout,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";

export function LandingWhatWeDetect() {
  const categories = [
    {
      id: "appsec",
      title: "Application Security",
      badge: "OWASP Top 10",
      icon: ShieldAlert,
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      description: "SQL Injection, Cross-Site Scripting (XSS), broken session management, and Insecure Direct Object References (IDOR).",
      examples: ["SQLi & ORM Flaws", "DOM & Stored XSS", "Session Fixation", "IDOR Access Gaps"],
    },
    {
      id: "config",
      title: "Security Configuration",
      badge: "HTTP & Headers",
      icon: Globe,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description: "Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), CORS allowlists, and cookie protection flags.",
      examples: ["HSTS & TLS Preload", "CSP Frame-Ancestors", "CORS Wildcards", "Secure/HttpOnly Flags"],
    },
    {
      id: "secrets",
      title: "Secrets & Exposure",
      badge: "SAST & Leaks",
      icon: FileCode2,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      description: "Publicly accessible production .env files, database credentials, Stripe/AWS tokens, and client JavaScript sourcemaps.",
      examples: [".env Credential Leaks", "Cloud API Keys", "Public Sourcemaps", "Backup File Artifacts"],
    },
    {
      id: "api",
      title: "API & GraphQL Security",
      badge: "Endpoints",
      icon: ServerCrash,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      description: "Unauthenticated backend mutations, public GraphQL introspection consoles, and missing rate limit defenses.",
      examples: ["GraphQL Introspection", "Auth Bypass on APIs", "Missing Rate Limits", "Object Injection"],
    },
    {
      id: "clientside",
      title: "Client-Side Security",
      badge: "Integrity",
      icon: PackageCheck,
      color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      description: "Subresource Integrity (SRI) for CDN scripts, outdated frontend NPM dependencies, and prototype pollution risks.",
      examples: ["Missing SRI Hashes", "Outdated NPM Packages", "Prototype Pollution", "MIME-Type Sniffing"],
    },
    {
      id: "modernweb",
      title: "Modern Web & AI App Risks",
      badge: "Full-Stack SaaS",
      icon: Bot,
      color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
      description: "AI-generated codebase flaws, insecure Supabase/Firebase rules, unauthenticated debug paths, and exposed route handlers.",
      examples: ["Permissive DB RLS", "Public Debug Routes", "Insecure AI Defaults", "Next.js Route Leaks"],
    },
  ];

  const engines = [
    {
      name: "OWASP ZAP",
      tag: "DAST",
      tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Zap,
      iconColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      description: "Dynamic Application Security Testing to find runtime vulnerabilities.",
    },
    {
      name: "Nuclei v3.3",
      tag: "TEMPLATES",
      tagColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: Share2,
      iconColor: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      description: "200+ curated CVE & misconfiguration templates for broad coverage.",
    },
    {
      name: "Semgrep SAST",
      tag: "SAST",
      tagColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      icon: Code2,
      iconColor: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      description: "Static code analysis & secret leak detection in your source code.",
    },
    {
      name: "Playwright Crawler",
      tag: "CRAWLER",
      tagColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      icon: Layout,
      iconColor: "text-orange-400 border-orange-500/40 bg-orange-500/10",
      description: "Headless browser surface & DOM discovery for deeper visibility.",
    },
    {
      name: "Custom Security Checks",
      tag: "AI-POWERED",
      tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: ShieldCheck,
      iconColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      description: "AI-built SaaS & architecture rules tuned for modern web applications.",
    },
  ];

  return (
    <section
      id="detection"
      aria-labelledby="detection-heading"
      className="py-16 md:py-24 border-b border-slate-800/80 bg-[#05060A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Comprehensive Vulnerability Coverage</span>
          </div>
          <h2
            id="detection-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            What We Detect Across 200+ Automated Checks
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Consolidated, non-destructive vulnerability coverage designed for modern full-stack web applications, APIs, and SaaS platforms.
          </p>
        </div>

        {/* 6 High-Level Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`size-10 rounded-xl flex items-center justify-center border ${cat.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-400">
                    {cat.examples.map((item, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="size-1 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MULTI-ENGINE DETECTION ARCHITECTURE HERO CARD                              */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-10 shadow-2xl space-y-8 text-left">
          
          {/* Top Header Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Radar className="size-4" />
                <span>Multi-Engine Detection Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Multi-Engine Detection.<br />
                One <span className="text-emerald-400">Actionable</span> Report.
              </h3>
            </div>

            {/* Right Header with Left Vertical Border */}
            <div className="lg:col-span-6 lg:border-l lg:border-slate-800/80 lg:pl-8">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Multiple security engines collect technical evidence across your application. Hack My Website turns the results into one prioritized remediation workflow.
              </p>
            </div>
          </div>

          {/* 5 Engine Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {engines.map((eng) => {
              const EngineIcon = eng.icon;
              return (
                <div
                  key={eng.name}
                  className="rounded-2xl border border-slate-800/90 bg-[#070A12] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Title & Pill */}
                    <div className="flex items-start gap-3">
                      <div className={`size-11 rounded-xl flex items-center justify-center border shrink-0 ${eng.iconColor}`}>
                        <EngineIcon className="size-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                          {eng.name}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide uppercase border ${eng.tagColor}`}>
                          {eng.tag}
                        </span>
                      </div>
                    </div>

                    {/* Engine Description */}
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {eng.description}
                    </p>
                  </div>

                  {/* Bottom Active Status Badge */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
