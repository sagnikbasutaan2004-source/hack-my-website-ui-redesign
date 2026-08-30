import type { Metadata } from "next";

import { QueryProvider } from "@/components/query-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { CookieConsent } from "@/components/cookie-consent";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hackmywebsite.io"),
  title: {
    default: "Hack My Website | Website Security Scanner",
    template: "%s | Hack My Website",
  },
  description:
    "Automated web security scanner for modern websites and SaaS. 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
  keywords: [
    "website security scanner",
    "automated vulnerability scanner",
    "web application security audit",
    "DAST scanner",
    "OWASP top 10 scanner",
    "SaaS security scanner",
    "Next.js vulnerability scanner",
    "AI Launch Score",
    "Cursor security fix",
    "cybersecurity audit report",
    "API security testing",
  ],
  authors: [{ name: "Hack My Website Security Team" }],
  creator: "Hack My Website",
  publisher: "Hack My Website",
  verification: {
    google: "nxu49t1cHJY9EYdNrZ4d11sXdIGI6dtpjfJHg79TsGc",
  },
  alternates: {
    canonical: "https://hackmywebsite.io",
  },
  openGraph: {
    title: "Hack My Website | Automated Website Security Scanner",
    description:
      "Automated web security scanner for modern websites and SaaS. 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
    url: "https://hackmywebsite.io",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hack My Website Security Scanner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hack My Website | Automated Website Security Scanner",
    description:
      "Automated web security scanner for modern websites and SaaS. 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen bg-[#070A10] text-slate-100 selection:bg-emerald-500 selection:text-neutral-950">
        {/* Ambient Dark Gradient Background Layer */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#09221b]/30 via-[#070A10] to-[#04060c]" />

        <div className="relative z-10 min-h-screen flex flex-col">
          <AnalyticsProvider>
            <QueryProvider>{children}</QueryProvider>
            <CookieConsent />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "@id": "https://hackmywebsite.io/#website",
                    "name": "Hack My Website",
                    "url": "https://hackmywebsite.io",
                    "description": "Automated security scanner for modern websites, SaaS, and web applications.",
                    "publisher": {
                      "@id": "https://hackmywebsite.io/#organization"
                    }
                  },
                  {
                    "@type": "Organization",
                    "@id": "https://hackmywebsite.io/#organization",
                    "name": "Hack My Website",
                    "url": "https://hackmywebsite.io",
                    "logo": "https://hackmywebsite.io/logo.png",
                    "sameAs": ["https://github.com/aiviintelligence"]
                  },
                  {
                    "@type": "WebApplication",
                    "@id": "https://hackmywebsite.io/#software",
                    "name": "Hack My Website Scanner",
                    "applicationCategory": "SecurityApplication",
                    "operatingSystem": "All",
                    "description": "Automated security scanner for modern websites, SaaS, and web applications. 200+ checks across OWASP ZAP, Nuclei, and Semgrep with instant AI fix prompts.",
                    "url": "https://hackmywebsite.io",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "INR"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": "4.9",
                      "reviewCount": "128",
                      "bestRating": "5",
                      "worstRating": "1"
                    }
                  },
                  {
                    "@type": "FAQPage",
                    "@id": "https://hackmywebsite.io/#faq",
                    "mainEntity": [
                      {
                        "@type": "Question",
                        "name": "What is Hack My Website?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Hack My Website is an automated security scanner built for modern websites, SaaS platforms, and AI-coded applications. It runs 200+ checks across OWASP ZAP, Nuclei, and Semgrep to generate an AI Launch Score and instant code fix prompts for Cursor, Claude Code, and Windsurf."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "What is the AI Launch Score?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "The AI Launch Score is an objective 0–100 security health score that evaluates your website across 4 readiness bands: Launch Ready (85–100), Action Recommended (70–84), High Risk (50–69), and Launch Blocker (0–49)."
                        }
                      }
                    ]
                  }
                ]
              }),
            }}
          />
          </AnalyticsProvider>
        </div>
      </body>
    </html>
  );
}
