import { ModernAuthView } from "@/components/auth/modern-auth-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account",
  description:
    "Sign up for Hack My Website and get 1 free automated security scan every month with AI Launch Score calculations.",
  alternates: {
    canonical: "https://hackmywebsite.io/signup",
  },
};

export default function SignupPage() {
  return <ModernAuthView initialMode="signup" />;
}
