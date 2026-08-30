"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  FileText,
  Lock,
  Shield,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface RiskAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  findingTitle: string;
  findingSeverity: string;
  findingId: string;
  onAcceptRisk: (findingId: string, reason: string, notes: string, expiresAt: string | null) => void;
}

const PRESET_REASONS = [
  "Compensating control in place (WAF / Edge rule)",
  "Internal / Non-production staging path",
  "Verified false positive for this architecture",
  "Accepted business risk for current launch milestone",
  "Third-party managed asset / upstream vendor dependency",
  "Other (custom reason)",
];

export function RiskAcceptanceModal({
  isOpen,
  onClose,
  findingTitle,
  findingSeverity,
  findingId,
  onAcceptRisk,
}: RiskAcceptanceModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [expirationOption, setExpirationOption] = useState<"30_days" | "90_days" | "permanent">("90_days");
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) return;

    let expiresAt: string | null = null;
    if (expirationOption === "30_days") {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString();
    } else if (expirationOption === "90_days") {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      expiresAt = d.toISOString();
    }

    onAcceptRisk(findingId, selectedReason, customNotes, expiresAt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              <ShieldAlert className="size-3 text-amber-400" />
              Governance & Compliance
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
              Accept Vulnerability Risk
            </h3>
            <p className="text-xs text-slate-400">
              Formal risk acceptance marks this finding as acknowledged for your security audit log.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Finding Summary Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase font-bold border-slate-700 text-slate-300">
              {findingSeverity}
            </Badge>
            <span className="text-xs font-bold text-slate-200 truncate">{findingTitle}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 block truncate">ID: {findingId}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Business / Technical Justification
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              {PRESET_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Additional Notes / Compensating Controls (Optional)
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Cloudflare WAF rule #482 blocks malicious requests matching this pattern."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          {/* Expiration Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Review Expiration Policy
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setExpirationOption("30_days")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  expirationOption === "30_days"
                    ? "bg-slate-800 border-emerald-500/50 text-emerald-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setExpirationOption("90_days")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  expirationOption === "90_days"
                    ? "bg-slate-800 border-emerald-500/50 text-emerald-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                90 Days (Quarterly)
              </button>
              <button
                type="button"
                onClick={() => setExpirationOption("permanent")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  expirationOption === "permanent"
                    ? "bg-slate-800 border-emerald-500/50 text-emerald-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Indefinite
              </button>
            </div>
          </div>

          {/* Acknowledgment Checkbox */}
          <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 size-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs text-slate-400 leading-relaxed font-sans">
              I acknowledge this security exception will be logged to the workspace audit history and visible to security auditors.
            </span>
          </label>

          {/* Submit / Cancel Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 rounded-xl font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!acknowledged}
              className="h-9 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shield className="size-3.5 mr-1.5" />
              Confirm Risk Acceptance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
