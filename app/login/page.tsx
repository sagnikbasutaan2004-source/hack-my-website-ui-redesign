import { ModernAuthView } from "@/components/auth/modern-auth-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Workspace",
  description:
    "Sign in to your Hack My Website workspace to run automated DAST, Nuclei CVE, and Semgrep security audits on your websites.",
  alternates: {
    canonical: "https://hackmywebsite.io/login",
  },
};

export default function LoginPage() {
  return <ModernAuthView initialMode="login" />;
}
