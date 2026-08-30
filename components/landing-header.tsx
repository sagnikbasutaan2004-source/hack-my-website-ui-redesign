"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for elevation
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "AI Launch Score", href: "/#launch-score" },
    { label: "Detections", href: "/#detection" },
    { label: "Sample Report", href: "/sample-report" },
    { label: "Methodology", href: "/methodology" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-200">
      
      {/* Top Campaign Announcement Bar */}
      <Link
        href="/vit-launch"
        className="block bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 text-center text-[11px] sm:text-xs font-mono font-bold tracking-tight transition-colors shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="size-3.5 fill-neutral-950 shrink-0" />
          <span className="truncate">VELLORE INSTITUTE OF TECHNOLOGY SPECIAL CAMPUS LAUNCH IS LIVE! CLAIM STUDENT OFFER</span>
          <ArrowRight className="size-3.5 stroke-[2.5] shrink-0" />
        </div>
      </Link>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-200 ${
          scrolled
            ? "bg-[#070A10]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl shadow-black/60"
            : "bg-[#070A10]/80 backdrop-blur-lg border-b border-slate-800/50"
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg p-1 transition-transform hover:scale-[1.01]"
        >
          <img
            src="/logo.png"
            alt="Hack My Website Logo"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Direct Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-3">
          
          <Link
            href="/workspace"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all hover:border-slate-600"
          >
            <span>Workspace</span>
          </Link>

          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <span>Start Free Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>
      </div>

      {/* Mobile Sliding Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090D16] border-b border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl hover:bg-slate-800/60 text-xs font-semibold text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              href="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-center text-xs flex items-center justify-center gap-2"
            >
              <span>Start Free Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
