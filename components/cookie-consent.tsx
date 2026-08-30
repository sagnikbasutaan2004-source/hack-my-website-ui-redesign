"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "granted");
    setShowBanner(false);
    // Dispatch custom event to notify AnalyticsProvider
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "denied");
    setShowBanner(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 z-[9999] mx-auto max-w-xl rounded-2xl border border-primary/25 bg-[#0a0a0a]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:right-6 sm:left-auto">
      <div className="flex items-start gap-4">
        <div className="hidden rounded-xl border border-primary/35 bg-primary/10 p-2.5 text-primary sm:block">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Cookie Consent
            </h3>
            <button
              onClick={() => setShowBanner(false)}
              className="text-zinc-400 hover:text-white transition"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs leading-relaxed text-zinc-300">
            We use Google Analytics to analyze website traffic and improve the website scanning experience.
            By clicking "Accept", you consent to the storage of cookies on your device for analytics purposes.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={handleAccept}
              className="rounded-xl border border-primary bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-primary/90"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
