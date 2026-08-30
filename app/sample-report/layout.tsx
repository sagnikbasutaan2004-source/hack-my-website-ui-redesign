import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Security Report",
  description:
    "Explore a live interactive security report demonstrating the 0–100 AI Launch Score, 1-Click IDE remediation prompts, attack surface route graph, and executive PDF deliverables.",
  alternates: {
    canonical: "https://hackmywebsite.io/sample-report",
  },
  openGraph: {
    title: "Sample Security Assessment Report",
    description:
      "Live sample security report with 0–100 AI Launch Score, OWASP ZAP & Nuclei findings, and 1-click Cursor & Claude Code fix prompts.",
    url: "https://hackmywebsite.io/sample-report",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hack My Website Interactive Sample Report",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Security Assessment Report",
    description:
      "Live sample security report with 0–100 AI Launch Score, OWASP ZAP & Nuclei findings, and 1-click Cursor & Claude Code fix prompts.",
    images: ["/og-image.png"],
  },
};

export default function SampleReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
