"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Activity,
  Terminal,
  RotateCcw,
  CheckCircle2,
  FileText,
  Zap,
  Maximize2,
  X,
  Copy,
  Check,
} from "lucide-react";

export interface InspectionCard {
  id: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  previewType: "gauge" | "matrix" | "retest" | "prompt" | "report";
  badge: string;
  stats: { label: string; value: string }[];
  details: string;
  codeSnippet?: string;
  imageSrc?: string;
}

const CAROUSEL_CARDS: InspectionCard[] = [
  {
    id: "launch-score-cockpit",
    tag: "MODULE 01",
    title: "AI Launch Score Cockpit",
    category: "0–100 Readiness Signal",
    description: "Translates 200+ technical vulnerability checks into an objective, go/no-go launch readiness index.",
    previewType: "gauge",
    badge: "92 / 100",
    stats: [
      { label: "DAST Runtime", value: "98%" },
      { label: "Secrets Leak", value: "100%" },
      { label: "OWASP Top 10", value: "95%" },
    ],
    details: "The AI Launch Score normalizes multi-engine vulnerability discoveries into 4 clear readiness bands (Launch Ready, Action Recommended, High Risk, Launch Blocker) so founders and lead engineers know immediately if code is safe to ship to production.",
    imageSrc: "/hero-bg-1.jpg",
  },
  {
    id: "multi-engine-matrix",
    tag: "MODULE 02",
    title: "Multi-Engine Threat Matrix",
    category: "DAST + SAST + CVEs",
    description: "Synchronized pipeline running OWASP ZAP, Nuclei v3.3, and Semgrep SAST across your target.",
    previewType: "matrix",
    badge: "214 Checks",
    stats: [
      { label: "Active DAST", value: "84 Checks" },
      { label: "CVE Probes", value: "112 Rules" },
      { label: "SAST Code Audit", value: "18 Scans" },
    ],
    details: "Single-engine scanners create false sense of security. Hack My Website runs ZAP active crawling for runtime XSS/SQLi, Nuclei v3.3 for zero-day threat templates, and Semgrep SAST for hardcoded API secret leaks in client bundles.",
    imageSrc: "/hero-bg-2.jpg",
  },
  {
    id: "targeted-retest-engine",
    tag: "MODULE 03",
    title: "3-Second Targeted Retest Engine",
    category: "Instant Verification Loop",
    description: "Verify fixed vulnerabilities instantly without waiting for a full 5-minute site re-scan.",
    previewType: "retest",
    badge: "3.2s Retest",
    stats: [
      { label: "Previous State", value: "HIGH RISK" },
      { label: "Current State", value: "VERIFIED SAFE" },
      { label: "Retest Latency", value: "3.2 Sec" },
    ],
    details: "Once developers commit a fix, hit Retest on the specific finding. Our system sends targeted HTTP probes or runs Semgrep pattern checks to prove remediation instantly.",
    codeSnippet: `// 3.2s Verification Probe
POST /api/retest HTTP/1.1
Host: api.hackmywebsite.io
Target-Finding-ID: HMW-VULN-8842
Result: 200 OK [Patch Verified - Zero Leaks Detected]`,
  },
  {
    id: "ai-ide-fix-prompts",
    tag: "MODULE 04",
    title: "Cursor & Claude AI Fix Prompts",
    category: "1-Click Remediation",
    description: "Formatted code remediation patches ready to copy directly into Cursor, Claude Code, or Windsurf.",
    previewType: "prompt",
    badge: "1-Click Copy",
    stats: [
      { label: "Format", value: "Markdown / Diff" },
      { label: "IDE Support", value: "Cursor, Claude" },
      { label: "Context", value: "File & Line Match" },
    ],
    details: "Instead of raw vulnerability names, developers get exact code patches with exact file paths and missing security headers configured for Next.js, Express, or Django.",
    codeSnippet: `// Cursor / Claude Code Fix Directive
# Target: next.config.ts
# Task: Add Strict Content-Security-Policy
export default {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{ key: 'Content-Security-Policy', value: "default-src 'self'" }]
    }];
  }
};`,
  },
  {
    id: "executive-pdf-deliverables",
    tag: "MODULE 05",
    title: "White-Label Executive Reports",
    category: "Client & Board Deliverables",
    description: "Board-ready PDF security assessment reports branded with your agency logo and compliance maps.",
    previewType: "report",
    badge: "PDF Export",
    stats: [
      { label: "Branding", value: "Custom Agency" },
      { label: "Compliance", value: "SOC 2, ISO, DPDP" },
      { label: "Format", value: "PDF & JSON" },
    ],
    details: "Digital agencies and security consultants can export white-label security deliverables with custom branding, executive summaries, compliance mappings, and technical evidence logs.",
    imageSrc: "/hero-bg-3.jpg",
  },
];

export function ProductInspectionWheel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedCard, setSelectedCard] = useState<InspectionCard | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Three.js ambient background light particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 15;

    // Particle field with brand green emerald tones
    const count = 70;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random() * 0.15 + 0.05;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.18,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Auto rotation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? CAROUSEL_CARDS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
  };

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="platform-inspection"
      aria-labelledby="platform-inspection-heading"
      className="relative py-20 md:py-28 overflow-hidden border-b border-slate-800/80 bg-[linear-gradient(180deg,_var(--tw-gradient-stops))] from-[#070c16] via-[#09171b] to-[#060a12]"
    >
      {/* Three.js Ambient Particle Light Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full pointer-events-none z-0 opacity-60"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="h-px w-8 bg-slate-700" />
            <span className="text-emerald-400 font-bold">Interactive Capabilities Suite</span>
            <span className="h-px w-8 bg-slate-700" />
          </div>

          <h2
            id="platform-inspection-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            Product Capability Inspection Suite
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Explore the core architectural modules powering automated scanning, proof of exploit, and verified remediation.
          </p>
        </div>

        {/* Carousel Spaced Showcase Cards Viewport */}
        <div className="relative py-8 min-h-[440px] flex items-center justify-center perspective-[1200px]">
          <div className="w-full max-w-5xl relative flex items-center justify-center">
            {CAROUSEL_CARDS.map((card, index) => {
              // Calculate relative offset from active card
              let offset = index - activeIndex;
              if (offset < -2) offset += CAROUSEL_CARDS.length;
              if (offset > 2) offset -= CAROUSEL_CARDS.length;

              const isCurrent = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;

              // Generous horizontal spacing gap between cards
              const translateX = offset * 280; // 280px spacing gap
              const scale = isCurrent ? 1 : isAdjacent ? 0.85 : 0.7;
              const opacity = isCurrent ? 1 : isAdjacent ? 0.55 : 0.2;
              const zIndex = isCurrent ? 30 : 20 - Math.abs(offset);
              const rotateY = offset * -12; // Subtle 3D tilt

              return (
                <motion.div
                  key={card.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    x: translateX,
                    scale: scale,
                    opacity: opacity,
                    rotateY: rotateY,
                    z: isCurrent ? 50 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                  }}
                  style={{ zIndex }}
                  className={`absolute w-[300px] sm:w-[360px] p-6 rounded-2xl border text-left cursor-pointer transition-colors shadow-2xl backdrop-blur-xl ${
                    isCurrent
                      ? "bg-[#0B101D] border-emerald-500 shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                      : "bg-[#070A12]/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">
                      {card.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-xs text-slate-400 font-mono">{card.category}</div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{card.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  {/* Card Visual Preview Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Module Telemetry</span>
                      <Activity className="size-3 text-emerald-400" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      {card.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="p-1.5 rounded bg-slate-900 border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 font-mono truncate">{stat.label}</div>
                          <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5 truncate">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Maximize2 className="size-3.5" />
                      <span>Inspect Module</span>
                    </button>
                    <span className="text-[10px] font-mono text-slate-500">
                      {index + 1} / {CAROUSEL_CARDS.length}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation & Auto-Play Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            aria-label="Previous capability module"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono font-bold transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="size-4 text-emerald-400" />
                <span>Pause Auto-Scroll</span>
              </>
            ) : (
              <>
                <Play className="size-4 text-emerald-400" />
                <span>Resume Auto-Scroll</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            aria-label="Next capability module"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Page Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {CAROUSEL_CARDS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-800 hover:bg-slate-700"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Detail Inspection Modal */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-[#0B101D] border border-slate-800 p-6 sm:p-8 space-y-6 text-left shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="size-4" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold">{selectedCard.tag}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedCard.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedCard.category}</p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{selectedCard.details}</p>

              {selectedCard.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="size-3.5 text-emerald-400" />
                      <span>Execution Output</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedCard.codeSnippet)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                      <span>{copied ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {selectedCard.codeSnippet}
                  </pre>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
