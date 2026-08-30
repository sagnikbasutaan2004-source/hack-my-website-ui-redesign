"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Sparkles, Send } from "lucide-react";

import { joinWaitlist, type WaitlistPlan } from "@/lib/api";
import { trackEvent } from "@/components/analytics-provider";

const planOptions: Array<{ value: WaitlistPlan; label: string }> = [
  { value: "free", label: "Starter Plan — ₹1,999/mo (3 Scans + PDF Reports)" },
  { value: "pro", label: "Pro Plan — ₹2,999/mo (10 Scans + GitHub & API Fuzzing)" },
  { value: "agency", label: "Agency Retainer — ₹4,999/mo (Unlimited + White-Label)" },
  { value: "custom", label: "Enterprise Custom Rollout" },
  { value: "unsure", label: "Free Tier / General Inquiry" },
];

export function WaitlistForm({
  source = "website",
  compact = false,
}: {
  source?: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [interestedPlan, setInterestedPlan] = useState<WaitlistPlan>("pro");
  const [message, setMessage] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const resolvedSource = useMemo(() => {
    if (typeof window === "undefined") return source;
    const params = new URLSearchParams(window.location.search);
    return params.get("source") || params.get("utm_source") || source;
  }, [source]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setResultMessage(null);

    try {
      const result = await joinWaitlist({
        name,
        email,
        company: company || undefined,
        website: website || undefined,
        interested_plan: interestedPlan,
        source: resolvedSource,
        message: message || undefined,
        website_url: websiteUrl || undefined,
      });
      setStatus("success");
      setResultMessage(result.message);
      trackEvent("generate_lead", "Form", resolvedSource, undefined, {
        plan: interestedPlan,
        company: company || undefined,
        website: website || undefined,
      });
    } catch (error) {
      setStatus("error");
      setResultMessage(error instanceof Error ? error.message : "Could not submit inquiry.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 sm:p-8 text-left space-y-4 shadow-xl">
        <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Inquiry Received Successfully!</h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {resultMessage || "Thank you for reaching out. Our security engineering team will review your target scope and contact you within 4 business hours."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setResultMessage(null);
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
        >
          <span>Submit another inquiry</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 text-left shadow-2xl space-y-5"
    >
      <div className="space-y-1 pb-2 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold">
          <Sparkles className="size-3.5" />
          <span>Priority Security Channel</span>
        </div>
        <h3 className="text-lg font-bold text-white">Send Security & Support Request</h3>
        <p className="text-xs text-slate-400">Fill in your domain and requirements for rapid response.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Your Full Name"
          value={name}
          onChange={setName}
          placeholder="e.g. Alex Johnson"
          required
        />
        <Field
          label="Work Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="alex@company.com"
          required
        />
        <Field
          label="Company / Studio Name"
          value={company}
          onChange={setCompany}
          placeholder="e.g. Acme Tech"
        />
        <Field
          label="Target Website Domain"
          value={website}
          onChange={setWebsite}
          placeholder="https://app.yourdomain.com"
        />
      </div>

      {/* Plan Selection Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="plan-select" className="text-xs font-bold text-slate-200">
          Interested Plan or Retainer
        </label>
        <select
          id="plan-select"
          value={interestedPlan}
          onChange={(event) => setInterestedPlan(event.target.value as WaitlistPlan)}
          className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs font-medium text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        >
          {planOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900 text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!compact ? (
        <div className="space-y-1.5">
          <label htmlFor="message-input" className="text-xs font-bold text-slate-200">
            What Are You Trying to Scan or Protect?
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Describe your web stack, number of websites, or specific compliance questions (e.g. Next.js SaaS, 3 client domains, white-label PDF requirements)..."
            rows={3}
            maxLength={1200}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs leading-relaxed text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
      ) : null}

      {/* Honeypot field */}
      <input
        type="text"
        value={websiteUrl}
        onChange={(event) => setWebsiteUrl(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {status === "error" && resultMessage ? (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
          {resultMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="size-3.5 fill-neutral-950" />
            <span>Submit Security Inquiry</span>
            <ArrowRight className="size-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-200">
        {label} {required && <span className="text-emerald-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={type === "email" ? 320 : 160}
        className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-xs font-medium text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
      />
    </div>
  );
}
