"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

import { WaitlistForm } from "@/components/waitlist-form";

type WaitlistModalProps = {
  label?: string;
  source?: string;
  className?: string;
  note?: string;
};

export function WaitlistModal({
  label = "Join the waitlist",
  source = "landing-modal",
  className = "hmw-button hmw-button-primary",
  note,
}: WaitlistModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashCheck = () => {
      if (window.location.hash === "#waitlist") {
        if (source === "hero") {
          setOpen(true);
        }
      }
    };
    handleHashCheck();
    window.addEventListener("hashchange", handleHashCheck);
    return () => {
      window.removeEventListener("hashchange", handleHashCheck);
    };
  }, [source]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#waitlist") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        data-track-id={`waitlist-modal-trigger-${source}`}
      >
        {label}
        <ArrowRight size={16} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Join Hack My Website waitlist"
        >
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-primary/25 bg-[#080a09] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.65)] sm:p-7">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:text-white"
              aria-label="Close waitlist form"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 pr-12">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Beta waitlist
              </div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
                Join the paid beta list for Hack My Website.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                Plans start at ₹1,999/month. We are collecting serious early demand first, then payment checkout opens
                when the launch list is ready.
              </p>
              {note ? <p className="mt-2 text-sm text-primary">{note}</p> : null}
            </div>

            <WaitlistForm source={source} />
          </div>
        </div>
      ) : null}
    </>
  );
}
