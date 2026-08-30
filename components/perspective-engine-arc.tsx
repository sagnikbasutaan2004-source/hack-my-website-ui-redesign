"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Lock,
  Zap,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export interface EngineCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ElementType;
  accentColor: string; // Tailwind color token
  borderGlow: string;
  orbColor: string;
  details: {
    checks: string[];
    fixTime: string;
    engineType: string;
  };
}

export const defaultEngineCards: EngineCardData[] = [
  {
    id: "auth-guard",
    category: "API AUTHORIZATION",
    title: "BOLA & IDOR Probes",
    description:
      "Inspects route authorization checks and token scopes to stop privilege escalation & broken object-level access.",
    tag: "Auth Guard",
    icon: Lock,
    accentColor: "text-emerald-400",
    borderGlow: "border-emerald-500/50 shadow-emerald-500/20",
    orbColor: "bg-emerald-400 shadow-emerald-400/80",
    details: {
      checks: ["JWT signature tampering", "BOLA object ID enumeration", "Missing role validation"],
      fixTime: "< 4 minutes",
      engineType: "API Authorization Engine",
    },
  },
  {
    id: "dast-engine",
    category: "DAST RUNTIME",
    title: "SQLi & XSS Probes",
    description:
      "Real-time non-destructive payload injection tests against active endpoints, parameters, and form inputs.",
    tag: "OWASP Top 10",
    icon: Zap,
    accentColor: "text-amber-400",
    borderGlow: "border-amber-500/50 shadow-amber-500/20",
    orbColor: "bg-amber-400 shadow-amber-400/80",
    details: {
      checks: ["Reflected & DOM XSS", "Blind SQL injection", "Command injection risks"],
      fixTime: "< 6 minutes",
      engineType: "OWASP ZAP DAST Core",
    },
  },
  {
    id: "sast-engine",
    category: "SAST CODE ENGINE",
    title: "Semgrep AST Audit",
    description:
      "Static code analysis searching for hardcoded API keys, database secrets, AWS credentials, and unsafe logic.",
    tag: "Zero Secrets",
    icon: Code2,
    accentColor: "text-orange-400",
    borderGlow: "border-orange-500/50 shadow-orange-500/20",
    orbColor: "bg-orange-400 shadow-orange-400/80",
    details: {
      checks: ["Stripe & AWS secret leaks", "Insecure deserialization", "Unsanitized SQL queries"],
      fixTime: "< 2 minutes",
      engineType: "Semgrep SAST Engine",
    },
  },
  {
    id: "sbom-engine",
    category: "DEPENDENCY SBOM",
    title: "OSV & NVD Graph",
    description:
      "Scans lockfiles and dependencies for unpatched package vulnerabilities, malicious packages, and CVE graphs.",
    tag: "CVE Database",
    icon: Layers,
    accentColor: "text-purple-400",
    borderGlow: "border-purple-500/50 shadow-purple-500/20",
    orbColor: "bg-purple-400 shadow-purple-400/80",
    details: {
      checks: ["Outdated npm/pip packages", "Known CVE advisories", "Typosquatting package checks"],
      fixTime: "< 3 minutes",
      engineType: "OSV & Nuclei SBOM Parser",
    },
  },
  {
    id: "ai-remediation",
    category: "AI REMEDIATION",
    title: "Cursor & Claude Prompts",
    description:
      "Generates 1-click formatted prompt directives for Cursor, Claude Code, and Windsurf to patch code with zero regressions.",
    tag: "Instant Fix",
    icon: Sparkles,
    accentColor: "text-sky-400",
    borderGlow: "border-sky-500/50 shadow-sky-500/20",
    orbColor: "bg-sky-400 shadow-sky-400/80",
    details: {
      checks: ["Automated code patch diffs", "IDE directive generator", "Regression validation tests"],
      fixTime: "< 1 minute",
      engineType: "HMW AI Fix Compiler",
    },
  },
  {
    id: "infra-guard",
    category: "INFRASTRUCTURE GUARD",
    title: "DNS & SSL Sentinel",
    description:
      "Validates SSL certificate expiration, HSTS max-age, SPF/DMARC email records, and safe-harbor configurations.",
    tag: "Safe Harbor",
    icon: ShieldCheck,
    accentColor: "text-emerald-400",
    borderGlow: "border-emerald-500/50 shadow-emerald-500/20",
    orbColor: "bg-emerald-400 shadow-emerald-400/80",
    details: {
      checks: ["SSL/TLS lifespan & ciphers", "SPF & DMARC DNS policies", "Security.txt compliance"],
      fixTime: "< 5 minutes",
      engineType: "Infrastructure Sentinel",
    },
  },
];

export function PerspectiveEngineArc({
  cards = defaultEngineCards,
}: {
  cards?: EngineCardData[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Keyboard accessibility navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowRight") nextCard();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard]);

  // Pointer drag handling for human-like swipe physics
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (diff < -40) {
      nextCard();
    } else if (diff > 40) {
      prevCard();
    }
    setDragStartX(null);
  };

  const activeCard = cards[activeIndex];
  const ActiveIcon = activeCard.icon;

  return (
    <div className="w-full space-y-10 text-center select-none">
      {/* ========================================================================= */}
      {/* PERSPECTIVE CURVED CARDS DISPLAY CONTAINER WITH DISTINCT SPACING          */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[380px] sm:h-[420px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing touch-pan-x"
        style={{ perspective: "1100px" }}
      >
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          {cards.map((card, idx) => {
            const cardOffset = idx - activeIndex;
            const isActive = idx === activeIndex;

            // Spacing & Arc Geometry Math:
            // Explicit card spacing gap (240px spacing between centers on desktop, 180px on mobile)
            const spacingX = typeof window !== "undefined" && window.innerWidth < 640 ? 190 : 255;
            const translateX = cardOffset * spacingX;
            const rotateY = cardOffset * -12; // Mild curved arc angle
            const translateZ = -Math.abs(cardOffset) * 70; // Arc depth
            const scale = 1 - Math.min(Math.abs(cardOffset) * 0.09, 0.28);
            const opacity = 1 - Math.min(Math.abs(cardOffset) * 0.25, 0.7);
            const zIndex = 50 - Math.abs(cardOffset) * 10;

            const IconComp = card.icon;

            return (
              <motion.div
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  x: translateX,
                  rotateY: rotateY,
                  z: translateZ,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 26,
                  mass: 0.9,
                }}
                style={{
                  position: "absolute",
                  zIndex: zIndex,
                  transformStyle: "preserve-3d",
                }}
                className={`w-[240px] sm:w-[270px] h-[330px] sm:h-[360px] rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition-colors duration-300 border ${
                  isActive
                    ? `bg-gradient-to-b from-[#101726] via-[#0B0F19] to-[#070A12] ${card.borderGlow} shadow-2xl ring-1 ring-emerald-500/40`
                    : "bg-[#0A0D16]/90 border-slate-800/90 hover:border-slate-700/90 shadow-xl filter brightness-90"
                }`}
              >
                {/* Card Top Row: Category Header & Glowing Orb Indicator */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-extrabold tracking-wider uppercase ${card.accentColor}`}
                    >
                      {card.category}
                    </span>

                    {/* Glowing Orb Indicator (As shown in screenshot reference) */}
                    <div className="relative flex items-center justify-center">
                      {isActive && (
                        <span
                          className={`absolute size-4 rounded-full ${card.orbColor} animate-ping opacity-60`}
                        />
                      )}
                      <span
                        className={`size-3 rounded-full ${
                          isActive ? card.orbColor : "bg-slate-700/60"
                        } shadow-md`}
                      />
                    </div>
                  </div>

                  {/* Illuminated Icon Box */}
                  <div
                    className={`size-12 rounded-2xl border flex items-center justify-center shadow-lg transition-transform duration-300 ${
                      isActive ? "scale-105" : "scale-100"
                    } ${
                      isActive
                        ? "bg-slate-900/90 border-slate-700"
                        : "bg-slate-950/60 border-slate-800/80"
                    }`}
                  >
                    <IconComp className={`size-6 ${card.accentColor}`} />
                  </div>

                  {/* Card Title & Description */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Pill Badge */}
                <div className="pt-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wide border backdrop-blur-md ${
                      isActive
                        ? "bg-slate-900/90 text-slate-200 border-slate-700"
                        : "bg-slate-950/40 text-slate-500 border-slate-850"
                    }`}
                  >
                    <span>{card.tag}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Controls: Previous & Next Buttons */}
        <button
          type="button"
          onClick={prevCard}
          aria-label="Previous engine"
          className="absolute left-2 sm:left-6 z-50 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={nextCard}
          aria-label="Next engine"
          className="absolute right-2 sm:right-6 z-50 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DECK INDICATOR DOTS                                                       */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Select ${card.title}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? "w-8 bg-emerald-400 shadow-md shadow-emerald-400/40"
                : "w-2 bg-slate-800 hover:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE ENGINE SPOTLIGHT BREAKDOWN PANEL BELOW THE ARC                    */}
      {/* ========================================================================= */}
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800/90 bg-[#080C16]/90 backdrop-blur-xl p-6 sm:p-8 text-left space-y-5 shadow-2xl shadow-black/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400">
              <ActiveIcon className={`size-5 ${activeCard.accentColor}`} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Active Architecture Spotlight
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                {activeCard.title} — {activeCard.details.engineType}
              </h4>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold shrink-0">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span>Avg Scan Time: {activeCard.details.fixTime}</span>
          </div>
        </div>

        {/* Included Checks Pills */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Primary Vulnerability Probes Included
          </div>
          <div className="flex flex-wrap gap-2">
            {activeCard.details.checks.map((chk) => (
              <span
                key={chk}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5"
              >
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>{chk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Link */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Included in all automated scan runs with instant AI fix directive output.
          </p>

          <Link
            href="/sample-report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-mono font-bold transition-all"
          >
            <span>View Sample Report Output</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
