import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "media-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://apis.google.com https://www.gstatic.com https://www.google.com https://www.googletagmanager.com https://checkout.razorpay.com`,
  "frame-src 'self' https://hack-my-website-2026.firebaseapp.com https://accounts.google.com https://apis.google.com https://api.razorpay.com https://checkout.razorpay.com",
  "child-src 'self' https://hack-my-website-2026.firebaseapp.com https://accounts.google.com https://apis.google.com https://api.razorpay.com https://checkout.razorpay.com",

  `connect-src 'self'${isDev ? " http://localhost:* ws://localhost:*" : ""} https://staging.hackmywebsite.io https://hackmywebsite.io https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.razorpay.com https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com`,
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://hackmywebsite.io/api/v1/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // The project lives in a OneDrive-synced folder, and Next's dev cache
      // has been intermittently failing to rename/write manifest files there.
      // Disabling persistent webpack cache in dev trades a bit of speed for
      // much more stable local refresh behavior.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
