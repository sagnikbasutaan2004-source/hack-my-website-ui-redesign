import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#05070B]/75 backdrop-blur-md text-slate-400 text-xs border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 text-left">
          
          {/* Column 1: Brand & Status (Span 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Hack My Website Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Automated security scanning and AI-powered vulnerability remediation platform for modern websites, web apps, and SaaS.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All 3 Engines Operational • v2.4</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform & Engines (Span 3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Platform & Engines</div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/#features" className="hover:text-emerald-400 transition-colors">
                  OWASP ZAP (Runtime DAST)
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-emerald-400 transition-colors">
                  Nuclei v3.3 (200+ CVEs)
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-emerald-400 transition-colors">
                  Semgrep (Code SAST Audit)
                </Link>
              </li>
              <li>
                <Link href="/#launch-score" className="hover:text-emerald-400 transition-colors">
                  AI Launch Score (0–100)
                </Link>
              </li>
              <li>
                <Link href="/sample-report" className="hover:text-emerald-400 transition-colors">
                  Executive PDF Sample
                </Link>
              </li>
              <li>
                <Link href="/#verification" className="hover:text-emerald-400 transition-colors">
                  DNS Ownership Gate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Methodology (Span 3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Methodology & Guides</div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/methodology" className="hover:text-emerald-400 transition-colors">
                  AI Launch Score Methodology
                </Link>
              </li>
              <li>
                <Link href="/methodology#zap-dast" className="hover:text-emerald-400 transition-colors">
                  DAST Fuzzing Standards
                </Link>
              </li>
              <li>
                <Link href="/methodology#semgrep-sast" className="hover:text-emerald-400 transition-colors">
                  Secrets Leak Defense
                </Link>
              </li>
              <li>
                <Link href="/vit-launch" className="hover:text-emerald-400 transition-colors">
                  VIT Launch Program
                </Link>
              </li>
              <li>
                <Link href="/vit-launch/ambassador" className="hover:text-emerald-400 transition-colors">
                  Campus Ambassador
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Agency Custom Retainers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Trust (Span 2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Trust & Legal</div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#verification" className="hover:text-emerald-400 transition-colors">
                  Safe Harbor Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Security Disclosures
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Compliance & Copyright Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>
              © {new Date().getFullYear()} Hack My Website. All rights reserved. A Product of{" "}
              <a
                href="https://aiviintelligence.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
              >
                AIVI Intelligence
              </a>
              .
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Safe Harbor Compliant</span>
            <span>•</span>
            <span>Non-Destructive Scanning</span>
            <span>•</span>
            <span>Strict DNS Authorization</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
