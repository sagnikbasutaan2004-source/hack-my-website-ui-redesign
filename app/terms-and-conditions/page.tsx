import Link from "next/link";
import { ShieldCheck, FileText, LockKeyhole } from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hack My Website",
  description:
    "Review the rules, responsibilities, liability limits, and conditions for scanning websites with Hack My Website.",
  alternates: {
    canonical: "https://hackmywebsite.io/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service & Usage Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Terms & Conditions
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              These terms govern access to Hack My Website, operated by <strong>AIVI Intelligence Private Limited</strong>.
            </p>
          </div>

          {/* Legal Document Container */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-8 text-left shadow-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            
            <LegalSection
              title="1. Authorized Use & Target Ownership"
              body="You may only register and scan web domains that you directly own or are explicitly authorized in writing to test. Scanning external infrastructure without authorization is strictly prohibited and constitutes a material breach of these terms."
            />

            <LegalSection
              title="2. Non-Destructive Scanning Model"
              body="Our scanning engines (OWASP ZAP, Nuclei, Semgrep) execute non-destructive, non-DoS vulnerability checks. While the scanner is designed to avoid downtime, customers are advised to run scans during maintenance windows or staging environments for mission-critical systems."
            />

            <LegalSection
              title="3. Ephemeral GitHub Code Audits"
              body="When connecting a GitHub repository for SAST and secret scanning, repository contents are processed ephemerally in memory solely for the duration of the scan. No source code files are permanently saved to our persistent storage."
            />

            <LegalSection
              title="4. Subscription Tiers & Razorpay Billing"
              body="Subscription plans (Free, Starter, Pro, Agency) are billed monthly. Paid plans can be managed or canceled at any time via the customer workspace portal. Quotas reset automatically at the beginning of each billing cycle."
            />

            <LegalSection
              title="5. Agency White-Label Distribution"
              body="Agency tier subscribers may distribute white-labeled PDF reports to third-party clients. The agency subscriber remains responsible for explaining the findings to their clients."
            />

            <LegalSection
              title="6. Limitation of Liability"
              body="Hack My Website provides automated security assessments to help identify vulnerabilities before production launch. Automated scanning does not guarantee total absence of security vulnerabilities and should complement standard code review practices."
            />

            <div className="pt-6 border-t border-slate-800/80 text-slate-400 text-xs flex items-center justify-between">
              <span>Last Updated: August 2026</span>
              <span className="text-emerald-400 font-semibold">AIVI Intelligence Private Limited</span>
            </div>

          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
      <p className="text-slate-300 leading-relaxed">{body}</p>
    </div>
  );
}
