import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Mail, ShieldCheck, Building2 } from "lucide-react";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { WaitlistForm } from "@/components/waitlist-form";
import { HeroMinimalistCanvas } from "@/components/hero-minimalist-canvas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Agency Support",
  description:
    "Get in touch with the Hack My Website engineering team for custom agency volume, white-label PDF retainers, or dedicated multi-target security setups.",
  alternates: {
    canonical: "https://hackmywebsite.io/contact",
  },
  openGraph: {
    title: "Contact & Agency Support",
    description:
      "Get in touch with the Hack My Website engineering team for custom agency volume, white-label PDF retainers, or dedicated security setups.",
    url: "https://hackmywebsite.io/contact",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Hack My Website",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Agency Support",
    description:
      "Get in touch with the Hack My Website engineering team for custom agency volume, white-label PDF retainers, or dedicated security setups.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      <LandingHeader />

      <main className="bg-[#070A10]">
        {/* HERO SECTION WITH MINIMALIST CANVAS & RADIAL GRADIENT */}
        <section className="relative py-12 md:py-16 border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0e2920] via-[#090e18] to-[#04060c] overflow-hidden">
          <HeroMinimalistCanvas />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-px w-8 bg-slate-800" />
              <span className="text-emerald-400 font-bold">Direct Security & Agency Support</span>
              <span className="h-px w-8 bg-slate-800" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Contact Hack My Website
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Have questions regarding custom scanning quotas, agency white-label reports, or specific framework vulnerability rules? Our engineering team is here to assist.
            </p>
          </div>

          {/* Contact & Inquiry Grid */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl text-left">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              
              {/* Left Column: Information */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Enterprise Communication
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    How Can We Help Your Team?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Tell us what you are building, how many domains you need to audit, and whether you require custom white-label reports or CI/CD webhook integrations.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Building2 className="size-4 text-emerald-400" />
                    <span>Corporate Headquarters</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-mono">
                    AIVI Intelligence Private Limited<br />
                    Security Engineering & Research Labs<br />
                    support@hackmywebsite.io
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                    Average response time: &lt; 4 business hours.
                  </div>
                </div>
              </div>

              {/* Right Column: Channels & Form */}
              <div className="lg:col-span-7 space-y-5">
                <WaitlistForm source="contact" />

                <div className="grid gap-3 pt-2">
                  <ContactCard
                    icon={<Mail className="size-4" />}
                    title="Direct Engineering Email"
                    body="Best for API questions, custom volume discounts, and billing support."
                    href="mailto:support@hackmywebsite.io?subject=Security%20Inquiry%20-%20Hack%20My%20Website"
                    cta="support@hackmywebsite.io"
                  />

                  <ContactCard
                    icon={<ShieldCheck className="size-4" />}
                    title="Agency White-Label Retainers"
                    body="Custom white-label PDF branding for digital agencies and developer studios."
                    href="mailto:support@hackmywebsite.io?subject=Agency%20Retainer%20Inquiry"
                    cta="Request Agency Rollout"
                  />
                </div>
              </div>

            </div>
          </div>

          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function ContactCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-left"
    >
      <div className="size-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
          {title}
        </div>
        <div className="text-xs text-slate-400 leading-relaxed">{body}</div>
        <div className="pt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <span>{cta}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
