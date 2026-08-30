"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-EVPSWCEBN1";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        anonymize_ip: true,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Initial check
    const currentConsent = localStorage.getItem("cookie-consent");
    setConsent(currentConsent);

    // Update GA4 consent state when user grants/denies
    const handleConsentUpdate = () => {
      const updatedConsent = localStorage.getItem("cookie-consent");
      setConsent(updatedConsent);

      if (typeof window !== "undefined" && window.gtag) {
        if (updatedConsent === "granted") {
          // Upgrade to full tracking after consent
          window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "denied",
          });
        } else if (updatedConsent === "denied") {
          window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
          });
        }
      }
    };

    // Global click listener for tracking outbound links and custom CTAs
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Require consent for custom event tracking
      if (localStorage.getItem("cookie-consent") !== "granted") return;

      // 1. Check for data-track-id attribute
      const trackableElement = target.closest("[data-track-id]");
      if (trackableElement) {
        const trackId = trackableElement.getAttribute("data-track-id");
        if (trackId) {
          trackEvent("click", "CTA Button", trackId);
        }
      }

      // 2. Check for outbound/mailto anchor links
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href) {
          if (href.startsWith("mailto:")) {
            trackEvent("click", "Email Link", href);
          } else if (
            href.startsWith("http") &&
            !href.includes("hackmywebsite.io") &&
            !href.includes("hmw.aivilabs.com") &&
            !href.includes("localhost") &&
            !href.includes("127.0.0.1")
          ) {
            trackEvent("click", "Outbound Link", href);
          }
        }
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <>
      {/* GA4: Always load with Consent Mode v2 (anonymous page views, GDPR-safe) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Default consent: analytics granted (India/non-GDPR jurisdiction)
          // Cookie banner still allows users to opt out
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
          });

          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            page_path: window.location.pathname,
          });

          // If user has previously denied consent, respect it
          const savedConsent = localStorage.getItem('cookie-consent');
          if (savedConsent === 'denied') {
            gtag('consent', 'update', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
            });
          }
        `}
      </Script>
      {/* Route tracker for SPA page changes */}
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      {children}
    </>
  );
}

// Helper utility for tracking custom events (requires user consent)
export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number,
  additionalParams: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && window.gtag && localStorage.getItem("cookie-consent") === "granted") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams,
    });
  }
}
