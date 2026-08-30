import React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface FeatureGradientCardProps {
  badgeText: string;
  badgeDotColor: string; // e.g. "bg-emerald-400", "bg-amber-400", "bg-orange-400"
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  theme?: "emerald" | "amber" | "orange" | "slate";
  icon: LucideIcon;
  stats?: { label: string; value: string };
}

export function FeatureGradientCard({
  badgeText,
  badgeDotColor,
  title,
  description,
  ctaText,
  ctaHref,
  theme = "slate",
  icon: Icon,
  stats,
}: FeatureGradientCardProps) {
  const themeStyles = {
    emerald: {
      gradient: "from-emerald-950/30 via-[#0B0F19] to-[#070A10]",
      border: "border-emerald-500/30 hover:border-emerald-500/70 hover:shadow-emerald-500/10",
      badgeBorder: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      ctaText: "text-emerald-400 hover:text-emerald-300",
      ambientGlow: "bg-emerald-500/10",
    },
    amber: {
      gradient: "from-amber-950/30 via-[#0B0F19] to-[#070A10]",
      border: "border-amber-500/30 hover:border-amber-500/70 hover:shadow-amber-500/10",
      badgeBorder: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      ctaText: "text-amber-400 hover:text-amber-300",
      ambientGlow: "bg-amber-500/10",
    },
    orange: {
      gradient: "from-orange-950/30 via-[#0B0F19] to-[#070A10]",
      border: "border-orange-500/30 hover:border-orange-500/70 hover:shadow-orange-500/10",
      badgeBorder: "border-orange-500/30 bg-orange-500/10 text-orange-400",
      iconBg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
      ctaText: "text-orange-400 hover:text-orange-300",
      ambientGlow: "bg-orange-500/10",
    },
    slate: {
      gradient: "from-slate-900/50 via-[#0B0F19] to-[#070A10]",
      border: "border-slate-800 hover:border-slate-700 hover:shadow-slate-700/10",
      badgeBorder: "border-slate-700 bg-slate-800/60 text-slate-300",
      iconBg: "bg-slate-800 border-slate-700 text-slate-300",
      ctaText: "text-slate-300 hover:text-white",
      ambientGlow: "bg-slate-500/5",
    },
  }[theme];

  return (
    <div
      className={`group relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-7 sm:p-8 bg-gradient-to-br ${themeStyles.gradient} border ${themeStyles.border} shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left`}
    >
      {/* Subtle Ambient Decorative Glow */}
      <div
        className={`absolute -right-16 -bottom-16 w-48 h-48 rounded-full ${themeStyles.ambientGlow} blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-50`}
      />

      {/* Top Header Row: Badge + Icon */}
      <div className="z-10 flex items-center justify-between gap-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${themeStyles.badgeBorder} backdrop-blur-md`}
        >
          <span className={`size-2 rounded-full ${badgeDotColor}`} />
          <span>{badgeText}</span>
        </div>

        <div
          className={`size-10 rounded-xl flex items-center justify-center border ${themeStyles.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}
        >
          <Icon className="size-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="z-10 mt-6 space-y-3 flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
          {description}
        </p>

        {/* Optional Stats Highlight */}
        {stats && (
          <div className="pt-2">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 inline-flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">{stats.label}:</span>
              <span className="text-white font-bold">{stats.value}</span>
            </div>
          </div>
        )}
      </div>

      {/* Call To Action Footer Link */}
      <div className="z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          href={ctaHref}
          className={`group/link inline-flex items-center gap-2 text-xs font-bold ${themeStyles.ctaText} transition-colors`}
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
