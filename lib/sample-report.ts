export type SampleFinding = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  confidence: "High" | "Medium" | "Low";
  toolSource: string;
  affectedUrl: string;
  owaspCategory: string;
  summary: string;
  businessImpact: string;
  evidenceTitle: string;
  evidenceSummary: string;
  remediation: string[];
  fixCode?: string;
  cursorPrompt?: string;
};

export const sampleReport = {
  domain: "https://demo-saas-platform.com",
  scanDate: "16 Aug 2026, 09:27 UTC",
  launchScore: 42,
  riskScore: 58,
  verdict: "High Risk • Action Required Before Launch",
  severitySummary: {
    critical: 0,
    high: 0,
    medium: 3,
    low: 7,
    info: 2,
  },
  executiveSummary:
    "Your website has several security misconfigurations that, while not immediately critical, could expose your users to client-side attacks, clickjacking, and information leakage. The primary areas requiring remediation are missing Clickjacking headers, absent Subresource Integrity (SRI) on third-party scripts, and a permissive Content Security Policy (CSP). Applying these fixes will bring your AI Launch Score to Launch Ready (85+).",
  whatMattersMost: [
    "Missing Clickjacking protection allows framing on sensitive checkout and dashboard views.",
    "External payment and analytics scripts load without cryptographic Subresource Integrity (SRI).",
    "Content Security Policy lacks explicit directives, permitting unsafe inline execution.",
  ],
  fixFirst: [
    "Add 'X-Frame-Options: SAMEORIGIN' and CSP 'frame-ancestors' to eliminate framing vulnerabilities.",
    "Include SHA-384 cryptographic integrity hashes on all Razorpay and Google script tags.",
    "Configure strict Content-Security-Policy response headers on server routes.",
  ],
  quickWins: [
    "Add `X-Content-Type-Options: nosniff` to suppress MIME sniffing.",
    "Set `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.",
    "Configure `Referrer-Policy: strict-origin-when-cross-origin`.",
  ],
  findings: [
    {
      id: "sample-01",
      title: "Missing Clickjacking Protection",
      severity: "medium",
      confidence: "High",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "Your website doesn't prevent attackers from embedding pages inside transparent iframes to trick logged-in users into clicking disguised controls.",
      businessImpact:
        "Users could be tricked into performing unintended actions such as updating settings or triggering checkouts inside a disguised overlay.",
      evidenceTitle: "Missing X-Frame-Options & frame-ancestors",
      evidenceSummary:
        "Neither X-Frame-Options nor frame-ancestors CSP directive was returned in HTTP response headers.",
      remediation: [
        "Add 'X-Frame-Options: DENY' or 'SAMEORIGIN' to all HTTP response headers.",
        "Add CSP 'frame-ancestors: none' (or 'self') to modern web server configuration.",
      ],
      fixCode: `// Nginx Configuration
add_header X-Frame-Options "SAMEORIGIN";
add_header Content-Security-Policy "frame-ancestors 'self';";`,
      cursorPrompt: `Review the Next.js / server config at "https://demo-saas-platform.com" and resolve "Missing Clickjacking Protection" by adding X-Frame-Options: SAMEORIGIN and Content-Security-Policy: frame-ancestors 'self' to all HTTP response headers.`,
    },
    {
      id: "sample-02",
      title: "Missing Subresource Integrity (SRI) for Third-Party Scripts",
      severity: "medium",
      confidence: "High",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A08:2021 - Software and Data Integrity Failures",
      summary:
        "External JavaScript scripts (Razorpay checkout.js and Google reCAPTCHA) are loaded from CDNs without cryptographic SRI hashes.",
      businessImpact:
        "If a third-party CDN is compromised, an attacker could inject malicious JavaScript into your users' active browser sessions.",
      evidenceTitle: "Script tag missing integrity attribute",
      evidenceSummary:
        "Matched script: <script src='https://checkout.razorpay.com/v1/checkout.js'> without integrity attribute.",
      remediation: [
        "Compute SHA-384 or SHA-512 hashes for all external scripts.",
        "Add integrity='sha384-...' and crossorigin='anonymous' attributes to script tags.",
      ],
      fixCode: `<script 
  src="https://checkout.razorpay.com/v1/checkout.js" 
  integrity="sha384-H4uW0Qd8o/4y1aR2m6S8pQ..." 
  crossorigin="anonymous">
</script>`,
      cursorPrompt: `Review script inclusions at "https://demo-saas-platform.com" and resolve "Missing Subresource Integrity (SRI)" by adding integrity attributes and crossorigin="anonymous" to all external CDN script tags.`,
    },
    {
      id: "sample-03",
      title: "Weak Content Security Policy (CSP)",
      severity: "medium",
      confidence: "High",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "The Content Security Policy does not define strict source allowlists for scripts, styles, and object embeds.",
      businessImpact:
        "Increases exposure to Cross-Site Scripting (XSS) and data exfiltration by allowing unverified scripts or style injections.",
      evidenceTitle: "Permissive CSP Header",
      evidenceSummary:
        "CSP header allows wildcard script sources and lacks object-src/base-uri restrictions.",
      remediation: [
        "Define explicit trusted sources for script-src and style-src.",
        "Set object-src 'none' and base-uri 'self'.",
      ],
      fixCode: `Content-Security-Policy: default-src 'self'; script-src 'self' https://checkout.razorpay.com https://apis.google.com; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';`,
      cursorPrompt: `Tighten the Content-Security-Policy headers at "https://demo-saas-platform.com" to disallow unverified script sources and enforce object-src 'none' and base-uri 'self'.`,
    },
    {
      id: "sample-04",
      title: "Missing HSTS Header",
      severity: "low",
      confidence: "High",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "HTTP Strict Transport Security (HSTS) is not enforced, allowing browsers to potentially fall back to unencrypted HTTP.",
      businessImpact:
        "Users on untrusted public Wi-Fi networks could be subjected to SSL-stripping downgrade attacks.",
      evidenceTitle: "Strict-Transport-Security header missing",
      evidenceSummary:
        "No Strict-Transport-Security header was returned on HTTPS responses.",
      remediation: [
        "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' header to all HTTPS responses.",
      ],
      fixCode: `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`,
      cursorPrompt: `Add the Strict-Transport-Security header with max-age=31536000 and includeSubDomains to all HTTPS responses at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-05",
      title: "Missing MIME Type Sniffing Protection",
      severity: "low",
      confidence: "High",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "The X-Content-Type-Options: nosniff header is missing, allowing browsers to guess file MIME types.",
      businessImpact:
        "Could lead to drive-by script execution if user-uploaded images or text files are parsed as executable HTML/JS.",
      evidenceTitle: "X-Content-Type-Options header absent",
      evidenceSummary: "Main response did not include X-Content-Type-Options: nosniff.",
      remediation: [
        "Add 'X-Content-Type-Options: nosniff' header to all static and dynamic responses.",
      ],
      fixCode: `add_header X-Content-Type-Options "nosniff" always;`,
      cursorPrompt: `Add X-Content-Type-Options: nosniff to all HTTP response headers at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-06",
      title: "Missing Permissions Policy",
      severity: "low",
      confidence: "Medium",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "The application does not restrict access to browser hardware APIs (camera, microphone, geolocation).",
      businessImpact:
        "Third-party scripts or embedded iframes could request intrusive browser permissions.",
      evidenceTitle: "Permissions-Policy header absent",
      evidenceSummary: "Main response did not set a restrictive Permissions-Policy header.",
      remediation: [
        "Add 'Permissions-Policy: camera=(), microphone=(), geolocation=()' to HTTP headers.",
      ],
      fixCode: `add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`,
      cursorPrompt: `Configure Permissions-Policy: camera=(), microphone=(), geolocation=() on all responses at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-07",
      title: "Missing Referrer Policy",
      severity: "low",
      confidence: "High",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "No Referrer-Policy is specified, causing browsers to leak full URLs to external sites.",
      businessImpact:
        "May leak sensitive URL query parameters or internal path structures to third-party services.",
      evidenceTitle: "Referrer-Policy header absent",
      evidenceSummary: "Application did not declare a Referrer-Policy header.",
      remediation: [
        "Set 'Referrer-Policy: strict-origin-when-cross-origin' on all responses.",
      ],
      fixCode: `add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
      cursorPrompt: `Add Referrer-Policy: strict-origin-when-cross-origin to response headers at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-08",
      title: "Server Information Leakage",
      severity: "low",
      confidence: "High",
      toolSource: "Custom AI-built website check",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "The server response reveals hosting provider and CDN stack banners (e.g. hcdn).",
      businessImpact:
        "Provides attackers with reconnaissance information regarding the backend infrastructure.",
      evidenceTitle: "Server banner exposed",
      evidenceSummary: "Server response exposed 'Server: hcdn' banner.",
      remediation: [
        "Suppress or generalize server tokens in web server / CDN configuration.",
      ],
      fixCode: `server_tokens off;`,
      cursorPrompt: `Suppress server banner disclosure tokens at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-09",
      title: "Third-Party JavaScript Inclusion",
      severity: "low",
      confidence: "Medium",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com",
      owaspCategory: "A08:2021 - Software and Data Integrity Failures",
      summary:
        "The application includes external JavaScript dependencies across multiple frontend routes.",
      businessImpact:
        "Creates a supply chain risk if external scripts are modified or hijacked upstream.",
      evidenceTitle: "External JS dependency mapped",
      evidenceSummary: "Mapped checkout.js from checkout.razorpay.com.",
      remediation: [
        "Regularly review third-party script necessities and implement SRI.",
      ],
      cursorPrompt: `Audit and review third-party JavaScript dependencies at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-10",
      title: "Timestamp Disclosure",
      severity: "low",
      confidence: "Low",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com/assets/index-C5X7ZmxC.js",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "JavaScript bundle contains Unix timestamps revealing asset build times.",
      businessImpact:
        "Minor reconnaissance data that can assist in determining deployment schedules.",
      evidenceTitle: "Unix timestamp pattern",
      evidenceSummary: "ZAP matched Unix timestamp pattern in compiled bundle.",
      remediation: [
        "Ensure build scripts strip or obfuscate internal deployment timestamps.",
      ],
      cursorPrompt: `Strip build timestamps from compiled JavaScript bundles at "https://demo-saas-platform.com".`,
    },
    {
      id: "sample-11",
      title: "Inadequate Cache Control for Sensitive Content",
      severity: "info",
      confidence: "Low",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com/assets/index-BoNJx2HJ.css",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "Static and dynamic assets are served without explicit cache directives.",
      businessImpact:
        "Informational hygiene item. Static assets should declare immutable caching.",
      evidenceTitle: "Cache-Control verification",
      evidenceSummary: "Static CSS asset retrieved from shared cache.",
      remediation: [
        "Ensure static assets set 'Cache-Control: public, max-age=31536000, immutable'.",
      ],
      fixCode: `add_header Cache-Control "public, max-age=31536000, immutable";`,
      cursorPrompt: `Set Cache-Control: public, max-age=31536000, immutable on static CSS/JS assets.`,
    },
    {
      id: "sample-12",
      title: "Information Disclosure via Comments",
      severity: "info",
      confidence: "Medium",
      toolSource: "OWASP ZAP",
      affectedUrl: "https://demo-saas-platform.com/assets/index-C5X7ZmxC.js",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      summary:
        "Client-side JavaScript code contains author / internal developer comments.",
      businessImpact:
        "Minor reconnaissance assistance for social engineering or internal architecture mapping.",
      evidenceTitle: "Comment pattern matched",
      evidenceSummary: "ZAP matched developer comment string in bundled JavaScript.",
      remediation: [
        "Configure production bundler / minifier to strip all comments during build.",
      ],
      cursorPrompt: `Ensure Vite / Webpack / Next.js strips all code comments from production build outputs.`,
    },
  ] as SampleFinding[],
};
