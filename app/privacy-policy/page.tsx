import Link from "next/link";
import { ShieldCheck, LockKeyhole, Sparkles } from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Hack My Website",
  description:
    "Read our privacy policy to understand how Hack My Website collects, processes, and protects your account credentials and repository scan data.",
  alternates: {
    canonical: "https://hackmywebsite.io/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <LockKeyhole className="w-3.5 h-3.5" />
              <span>Data Protection & Privacy Policy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Privacy & Security Policy
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Operated by <strong>AIVI Intelligence Private Limited</strong>. This policy details how we handle scanned target domains, GitHub tokens, user credentials, and security findings.
            </p>
          </div>

          {/* Legal Document Container */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-8 text-left shadow-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            
            <LegalSection
              title="1. Information We Collect"
              body="We collect account identity information from Firebase authentication, domain origins you register, scan results produced by our multi-engine scanner (OWASP ZAP, Nuclei, Semgrep), and generated PDF report summaries. We do not inspect unrequested traffic or non-whitelisted assets."
            />

            <LegalSection
              title="2. Ephemeral In-Memory Code Analysis Guarantee"
              body="For GitHub repository scans, our background workers clone the specified repository branch ephemerally into volatile memory solely for static analysis (Semgrep). Absolutely no source code, repository files, or access tokens are permanently written to disk or retained in our databases; all cloned assets are completely purged immediately upon scan completion."
            />

            <LegalSection
              title="3. Mandatory Domain Authorization & Safe Harbor"
              body="Hack My Website is designed exclusively to audit domains verified and controlled by the customer. The platform strictly requires DNS TXT or .well-known token ownership verification before initiating any active DAST fuzzing or vulnerability testing."
            />

            <LegalSection
              title="4. Masking of Sensitive Detected Data"
              body="Our scanning engine automatically masks and scrubs raw detected secrets, leaked .env values, and production credentials before storing them in database records or rendering them in final report artifacts."
            />

            <LegalSection
              title="5. Data Retention & Account Deletion"
              body="Customers retain full ownership of their scan history and reports. Users can request immediate deletion of their account records and scan archives at any time by contacting support@hackmywebsite.io."
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
