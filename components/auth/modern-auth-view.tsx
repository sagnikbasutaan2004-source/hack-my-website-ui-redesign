"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  ShieldCheck,
  Radar,
  LockKeyhole,
  KeyRound,
  FileCode2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Database,
  Globe,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { firebaseAuth, persistenceReady } from "@/lib/firebase";

// Orbit icon definition
interface OrbitItem {
  name: string;
  icon: React.ReactNode;
  ring: "inner" | "middle" | "outer";
  angle: number; // degrees
  color: string;
  badge: string;
}

const orbitItems: OrbitItem[] = [
  { name: "OWASP ZAP", icon: <Radar className="size-4" />, ring: "outer", angle: 0, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "DAST" },
  { name: "Nuclei CVEs", icon: <Flame className="size-4" />, ring: "outer", angle: 120, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "200+ CVEs" },
  { name: "Semgrep SAST", icon: <FileCode2 className="size-4" />, ring: "outer", angle: 240, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "Secrets" },
  { name: "DNS Gate", icon: <Globe className="size-4" />, ring: "middle", angle: 45, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "Safe Harbor" },
  { name: "AI Fix Prompts", icon: <Sparkles className="size-4" />, ring: "middle", angle: 165, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "Claude/Cursor" },
  { name: "Secrets Mask", icon: <KeyRound className="size-4" />, ring: "middle", angle: 285, color: "text-emerald-400 border-emerald-500/40 bg-slate-900/90", badge: "Scrubbed" },
];

const slides = [
  {
    title: "Multi-Engine DAST & CVE Audits",
    subtitle: "Run 200+ vulnerability checks across OWASP ZAP, Nuclei, and Semgrep in under 8 minutes without downtime.",
    tag: "Runtime Security",
  },
  {
    title: "Ephemeral GitHub Code & Secret Scans",
    subtitle: "Detect leaked Stripe, AWS, and database credentials in source maps and repositories with zero persistent code storage.",
    tag: "Zero-Storage Guarantee",
  },
  {
    title: "AI Launch Score & 1-Click Fix Prompts",
    subtitle: "Translate technical findings into an objective 0–100 score and copy-paste ready Cursor/Claude code patches.",
    tag: "Instant Remediation",
  },
];

export function ModernAuthView({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Sync mode when prop changes
  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  // Slideshow auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Listen for active auth session
  useEffect(() => {
    if (!firebaseAuth) return;
    persistenceReady
      .then(() => getRedirectResult(firebaseAuth!))
      .catch((err) => {
        console.error("Redirect sign-in error", err);
        setError(err instanceof Error ? err.message : "Google sign-in failed.");
      });

    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.push("/workspace");
      }
    });
  }, [router]);

  const handleEnterDemoWorkspace = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hmw_demo_token", "demo-token-active");
    }
    router.push("/workspace");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    if (!firebaseAuth) {
      handleEnterDemoWorkspace();
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        router.push("/workspace");
      } else {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
        await sendEmailVerification(credential.user);
        setNotice("Account created! Check your email inbox to verify your account, then access your workspace.");
        router.push("/workspace");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setNotice(null);
    setIsGoogleLoading(true);

    if (!firebaseAuth) {
      handleEnterDemoWorkspace();
      setIsGoogleLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await persistenceReady;
      try {
        await signInWithPopup(firebaseAuth, provider);
        router.push("/workspace");
      } catch (popupError: any) {
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/cancelled-popup-request" ||
          popupError.code === "auth/popup-closed-by-user"
        ) {
          await signInWithRedirect(firebaseAuth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setNotice(null);

    if (!firebaseAuth) {
      setError("Authentication service is initializing.");
      return;
    }
    if (!email) {
      setError("Please enter your email address in the field above first, then click Forgot password.");
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setNotice("Password reset instructions have been sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send password reset email.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-sans flex flex-col lg:flex-row antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: ANIMATED SECURITY ORBIT & CAPABILITY SHOWCASE (DESKTOP)     */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#0B0F19]/85 via-[#070A10]/75 to-[#04060A]/90 backdrop-blur-xl border-r border-slate-800/80 overflow-hidden">
        
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Hack My Website Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-[11px] font-mono text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Engines Active • v2.4</span>
          </div>
        </div>

        {/* Centerpiece: Animated Security Orbit System */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
          <div className="relative size-80 sm:size-96 flex items-center justify-center">
            
            {/* Outer Orbit Track */}
            <div className="absolute size-72 sm:size-84 rounded-full border border-dashed border-slate-700/60 animate-[spin_60s_linear_infinite]" />
            
            {/* Middle Orbit Track */}
            <div className="absolute size-52 sm:size-60 rounded-full border border-slate-800 animate-[spin_40s_linear_infinite_reverse]" />
            
            {/* Inner Ripple Rings */}
            <div className="absolute size-36 rounded-full border border-emerald-500/20 animate-ping opacity-30" />
            <div className="absolute size-28 rounded-full border border-emerald-500/40 bg-emerald-500/5 shadow-2xl shadow-emerald-500/20" />

            {/* Orbit Center Hub: Hack My Website Core */}
            <div className="relative z-20 size-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500 flex flex-col items-center justify-center text-center p-2 shadow-2xl shadow-emerald-500/30">
              <ShieldCheck className="size-8 text-emerald-400" />
              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider mt-0.5">
                HMW Core
              </span>
            </div>

            {/* Orbiting Satellite Nodes (Outer Ring) */}
            <div className="absolute inset-0 animate-[spin_50s_linear_infinite]">
              {orbitItems.filter(i => i.ring === "outer").map((item, idx) => (
                <div
                  key={item.name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${item.angle}deg) translate(145px) rotate(-${item.angle}deg)`,
                  }}
                >
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 backdrop-blur-md shadow-xl ${item.color}`}>
                    {item.icon}
                    <span className="text-[10px] font-mono font-bold text-white whitespace-nowrap">
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Orbiting Satellite Nodes (Middle Ring - Reverse) */}
            <div className="absolute inset-0 animate-[spin_35s_linear_infinite_reverse]">
              {orbitItems.filter(i => i.ring === "middle").map((item, idx) => (
                <div
                  key={item.name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${item.angle}deg) translate(100px) rotate(-${item.angle}deg)`,
                  }}
                >
                  <div className={`p-1.5 rounded-lg border flex items-center gap-1 backdrop-blur-md shadow-lg ${item.color}`}>
                    {item.icon}
                    <span className="text-[9px] font-mono font-bold text-slate-200 whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Dynamic Feature Carousel Below Orbit */}
          <div className="w-full max-w-md mt-6 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-emerald-400">
              <Sparkles className="size-3" />
              <span>{slides[activeSlide].tag}</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight min-h-[28px] transition-all">
              {slides[activeSlide].title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[40px] transition-all">
              {slides[activeSlide].subtitle}
            </p>

            {/* Carousel Navigation Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === idx ? "w-6 bg-emerald-400" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left Bottom Metrics Bar */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>200+ Automated Security Checks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>Non-Destructive Scanning Model</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: MODERN AUTH FORM & TABS                                     */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10">
        
        {/* Top Back Link & Mobile Logo */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="lg:hidden">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Center Auth Card */}
        <div className="w-full max-w-md mx-auto space-y-6">
          
          {/* Header & Tabs */}
          <div className="space-y-4 text-left">
            
            {/* Pill Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                  setNotice(null);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", "/login");
                  }
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  isLogin
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                  setNotice(null);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", "/signup");
                  }
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  !isLogin
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isLogin ? "Welcome Back to Workspace" : "Start Your Free Security Audit"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {isLogin
                  ? "Access your registered domains, active vulnerability scans, and client PDF reports."
                  : "Scan your website before launch. 1 free domain audit included every month."}
              </p>
            </div>

          </div>

          {/* Demo Sandbox Access */}
          <button
            type="button"
            onClick={handleEnterDemoWorkspace}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40 transition-all shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="size-4 text-emerald-400" />
            <span>Enter Demo Workspace (1-Click Sandbox)</span>
          </button>

          {/* Social Auth: 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full h-12 inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-slate-200 font-bold text-xs border border-slate-700/90 transition-all hover:border-slate-600 shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isGoogleLoading ? (
              <LoaderCircle className="size-4 animate-spin text-emerald-400" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute px-3 bg-[#050507] text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Or continue with email
            </span>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-10 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Notice / Success Message Box */}
            {notice && (
              <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <span>{notice}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  <span>Processing Request...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Workspace" : "Create Free Account"}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Safe Harbor Guarantee Footer */}
          <div className="pt-4 text-center text-[11px] text-slate-400 space-y-1">
            <p>
              By continuing, you agree to our{" "}
              <Link href="/terms-and-conditions" className="text-slate-300 underline hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-slate-300 underline hover:text-white">
                Privacy Policy
              </Link>.
            </p>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-slate-500 pt-8">
          <span>Operated by AIVI Intelligence Private Limited • ISO 27001 Aligned</span>
        </div>

      </div>

    </div>
  );
}
