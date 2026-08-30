"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Eye,
  Globe,
  Link2,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanId: string;
  targetUrl: string;
  score: number;
}

export function ShareReportModal({
  isOpen,
  onClose,
  scanId,
  targetUrl,
  score,
}: ShareReportModalProps) {
  const [expiration, setExpiration] = useState<"24h" | "7d" | "30d" | "never">("7d");
  const [maskSecrets, setMaskSecrets] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://hackmywebsite.io";
  const shareUrl = `${origin}/dashboard/scan/${scanId}?share=read_only&exp=${expiration}&masked=${maskSecrets ? "1" : "0"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Security Assessment Report: ${targetUrl} (Score: ${score}/100)`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the live security assessment report for ${targetUrl} (Current Score: ${score}/100):\n\n${shareUrl}\n\nThis read-only link contains findings, evidence, and remediation steps.\n\nBest,\n`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 shadow-2xl space-y-6 text-slate-100 font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
              <Link2 className="size-3 text-emerald-400" />
              Secure Client Sharing
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
              Share Live Security Report
            </h3>
            <p className="text-xs text-slate-400">
              Generate a secure, tokenized read-only link for clients, executives, or developers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Target Domain Card */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-slate-400" />
            <span className="font-mono text-xs font-bold text-slate-200 truncate max-w-[240px]">
              {targetUrl}
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-[11px] border-slate-700 text-emerald-400">
            {score} / 100
          </Badge>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Expiration Policy */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Link Expiration Policy
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: "24h", label: "24 Hours" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "never", label: "Never" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExpiration(opt.id as typeof expiration)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    expiration === opt.id
                      ? "bg-slate-800 border-emerald-500/50 text-emerald-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Masking Toggle */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={maskSecrets}
              onChange={(e) => setMaskSecrets(e.target.checked)}
              className="mt-0.5 size-4 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Mask Internal Auth Tokens & Sensitive Strings
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Replaces secret payloads and session cookies with &lt;REDACTED&gt; placeholders for client viewing.
              </p>
            </div>
          </label>

          {/* Generated URL Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Generated Shareable URL
              </label>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Read-Only • Tokenized
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-300 break-all select-all leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                {shareUrl}
              </div>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCopy}
                className="w-full h-9 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer transition-all shadow-md"
              >
                {copied ? <Check className="h-4 w-4 mr-1.5 text-neutral-950" /> : <Copy className="h-4 w-4 mr-1.5 text-neutral-950" />}
                {copied ? "Copied Full Share URL to Clipboard!" : "Copy Full Share URL"}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Direct Share Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEmailShare}
            className="h-9 px-3.5 rounded-xl font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Email Report
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 rounded-xl font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
