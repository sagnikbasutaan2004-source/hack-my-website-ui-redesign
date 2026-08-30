"use client";

import React from "react";

interface TrustBadgeProps {
  domainName?: string;
  securityScore?: number;
}

export const EmbeddableTrustBadge: React.FC<TrustBadgeProps> = ({
  domainName = "example.com",
  securityScore = 95,
}) => {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full shadow-md text-slate-100 font-sans text-xs">
      <span className="flex items-center gap-1.5 font-bold text-emerald-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.681-.056-1.35-.166-2A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v4a1 1 0 102 0V7z"
            clipRule="evenodd"
          />
        </svg>
        Security Verified
      </span>
      <span className="h-3 w-px bg-slate-700"></span>
      <span className="text-slate-400">{domainName}</span>
      <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
        {securityScore} / 100
      </span>
    </div>
  );
};
