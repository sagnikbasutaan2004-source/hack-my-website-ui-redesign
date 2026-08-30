import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIT Campus Ambassador",
  description:
    "Apply to become a Hack My Website Campus Ambassador at Vellore Institute of Technology. Lead developer security on campus, earn tier rewards, and gain real-world SecOps experience.",
  alternates: {
    canonical: "https://hackmywebsite.io/vit-launch/ambassador",
  },
  openGraph: {
    title: "VIT Campus Ambassador & Internship Program",
    description:
      "Apply for the VIT Campus Ambassador program. Lead student developer security and earn real-world cybersecurity experience.",
    url: "https://hackmywebsite.io/vit-launch/ambassador",
    siteName: "Hack My Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIT Campus Ambassador Program",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIT Campus Ambassador & Internship Program",
    description:
      "Apply for the VIT Campus Ambassador program. Lead student developer security and earn real-world cybersecurity experience.",
    images: ["/og-image.png"],
  },
};

export default function VitAmbassadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
