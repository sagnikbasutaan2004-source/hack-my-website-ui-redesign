"use client";

import React from "react";

interface ThreatIntelPanelProps {
  googleStatus?: string;
  sslExpiryDays?: number | null;
  hasSpf?: boolean;
  hasDmarc?: boolean;
  reputationStatus?: string;
}

export const ThreatIntelActivityPanel: React.FC<ThreatIntelPanelProps> = ({
  googleStatus = "safe",
  sslExpiryDays = 45,
  hasSpf = true,
  hasDmarc = true,
  reputationStatus = "clean",
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            Domain Threat Intelligence Activity Panel
          </h3>
          <p className="text-xs text-slate-400">
            Real-time 24-hour continuous domain trust & blacklist audit
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
          24h Monitor Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Google Safe Browsing Badge */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Google Safe Browsing</span>
          <span
            className={`font-semibold text-sm px-2.5 py-0.5 rounded ${
              googleStatus === "safe"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {googleStatus === "safe" ? "SAFE" : "BLACKLISTED"}
          </span>
        </div>

        {/* SSL Expiration Countdown */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">SSL Certificate</span>
          <span className="font-semibold text-sm text-cyan-300">
            {sslExpiryDays !== null ? `${sslExpiryDays} Days Remaining` : "N/A"}
          </span>
        </div>

        {/* DNS Posture */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">DNS Posture</span>
          <div className="flex gap-2 text-xs font-medium">
            <span className={hasSpf ? "text-emerald-400" : "text-amber-400"}>
              SPF {hasSpf ? "✓" : "✗"}
            </span>
            <span className={hasDmarc ? "text-emerald-400" : "text-amber-400"}>
              DMARC {hasDmarc ? "✓" : "✗"}
            </span>
          </div>
        </div>

        {/* Reputation Status */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Reputation Network</span>
          <span
            className={`font-semibold text-sm ${
              reputationStatus === "clean" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {reputationStatus === "clean" ? "Clean (Spamhaus/SURBL)" : "Listed"}
          </span>
        </div>
      </div>
    </div>
  );
};
