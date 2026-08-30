export interface IdeTarget {
  id: "cursor" | "vscode" | "vscode-insiders" | "windsurf" | "jetbrains";
  name: string;
  protocol: string;
  iconName: string;
  description: string;
}

export const SUPPORTED_IDES: IdeTarget[] = [
  {
    id: "cursor",
    name: "Cursor",
    protocol: "cursor://file/",
    iconName: "Zap",
    description: "Launch in Cursor IDE with AI fix context",
  },
  {
    id: "vscode",
    name: "VS Code",
    protocol: "vscode://file/",
    iconName: "Code2",
    description: "Open file in Visual Studio Code",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    protocol: "windsurf://file/",
    iconName: "Flame",
    description: "Open in Codeium Windsurf Editor",
  },
  {
    id: "vscode-insiders",
    name: "VS Code Insiders",
    protocol: "vscode-insiders://file/",
    iconName: "Code2",
    description: "Open in VS Code Insiders edition",
  },
];

export interface FindingEvidence {
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: string;
  };
  response?: {
    status_code?: number;
    headers?: Record<string, string>;
    body?: string;
  };
  file_path?: string;
  line_number?: number;
  [key: string]: unknown;
}

export interface FindingContext {
  id: string;
  title: string;
  severity: string;
  description: string;
  affected_url?: string | null;
  owasp_category?: string | null;
  tool_source?: string | null;
  evidence?: Record<string, unknown> | null;
  evidence_summary?: string | null;
  business_impact?: string | null;
  technical_details?: string | null;
  attack_scenario?: string | null;
  fix_suggestion?: string | null;
  remediation_steps?: string[] | null;
}

/**
 * Builds an OS-level deep link URI to navigate directly to the affected file & line number.
 */
export function buildIdeDeepLink(
  ideId: "cursor" | "vscode" | "vscode-insiders" | "windsurf" | "jetbrains",
  filePath: string,
  lineNumber: number = 1
): string {
  const cleanPath = filePath.replace(/^\/+/, "");
  
  if (ideId === "cursor") {
    return `cursor://file/${cleanPath}:${lineNumber}`;
  }
  if (ideId === "vscode") {
    return `vscode://file/${cleanPath}:${lineNumber}`;
  }
  if (ideId === "vscode-insiders") {
    return `vscode-insiders://file/${cleanPath}:${lineNumber}`;
  }
  if (ideId === "windsurf") {
    return `windsurf://file/${cleanPath}:${lineNumber}`;
  }
  if (ideId === "jetbrains") {
    return `jetbrains://idea/navigate/reference?path=${encodeURIComponent(cleanPath)}:${lineNumber}`;
  }
  return `cursor://file/${cleanPath}:${lineNumber}`;
}

/**
 * Extracts or infers the most relevant codebase file path for a finding.
 */
export function resolveFindingFilePath(finding: FindingContext): { path: string; line: number } {
  // Check if explicit file evidence is attached (e.g. from Semgrep or SAST)
  if (finding.evidence && typeof finding.evidence === "object") {
    const ev = finding.evidence as Record<string, unknown>;
    if (typeof ev.file_path === "string" && ev.file_path) {
      const line = typeof ev.line_number === "number" ? ev.line_number : 1;
      return { path: ev.file_path, line };
    }
  }

  // Infer based on affected URL
  const url = finding.affected_url || "";
  const title = finding.title.toLowerCase();

  if (title.includes("header") || title.includes("csp") || title.includes("hsts") || title.includes("frame")) {
    return { path: "middleware.ts", line: 1 };
  }
  if (title.includes("cookie") || title.includes("auth") || title.includes("session")) {
    return { path: "app/api/auth/route.ts", line: 1 };
  }
  if (title.includes("cors")) {
    return { path: "next.config.js", line: 1 };
  }
  if (url.includes("/api/")) {
    try {
      const pathname = new URL(url).pathname;
      const apiPath = `app${pathname}/route.ts`.replace(/\/+/g, "/");
      return { path: apiPath, line: 1 };
    } catch {
      return { path: "app/api/route.ts", line: 1 };
    }
  }

  return { path: "app/page.tsx", line: 1 };
}

/**
 * Generates a structured Universal Agent Directive for Cursor, Windsurf, Claude Code, Antigravity, and Zed.
 */
export function buildUniversalAgentDirective(finding: FindingContext, targetUrl: string): string {
  const { path: inferredPath, line } = resolveFindingFilePath(finding);
  const affected = finding.affected_url || targetUrl;

  const lines: string[] = [
    `# SECURITY REMEDIATION DIRECTIVE`,
    `**Vulnerability:** ${finding.title}`,
    `**Severity:** ${finding.severity.toUpperCase()} | **OWASP:** ${finding.owasp_category || "A05:2021-Security Misconfiguration"}`,
    `**Target Endpoint:** ${affected}`,
    `**Target File:** \`${inferredPath}:${line}\``,
    ``,
    `## Vulnerability Summary`,
    finding.description,
    ``,
  ];

  if (finding.business_impact) {
    lines.push(`## Business Impact & Attack Vector`, finding.business_impact, ``);
  }

  if (finding.evidence_summary) {
    lines.push(`## Telemetry / Scanner Evidence`, `> ${finding.evidence_summary}`, ``);
  }

  lines.push(`## Step-by-Step Remediation Requirements`);
  if (finding.remediation_steps && finding.remediation_steps.length > 0) {
    finding.remediation_steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. ${step}`);
    });
  } else if (finding.fix_suggestion) {
    lines.push(finding.fix_suggestion);
  } else {
    lines.push(`1. Inspect \`${inferredPath}\` and implement security headers/defenses.`);
    lines.push(`2. Ensure proper validation without loosening existing application behavior.`);
  }

  lines.push(
    ``,
    `## Negative Constraints`,
    `- Do NOT disable existing authentication, logging, or middleware checks.`,
    `- Do NOT introduce external dependencies if native framework APIs suffice.`,
    `- Ensure all changes pass TypeScript typecheck and test suite.`
  );

  return lines.join("\n");
}

/**
 * Generates an executable, sanitized cURL command matching the scanner's request.
 */
export function generateCurlReplayCommand(finding: FindingContext, targetUrl: string): string {
  const url = finding.affected_url || targetUrl;
  const isPost = finding.title.toLowerCase().includes("post") || finding.title.toLowerCase().includes("mutation");
  const method = isPost ? "POST" : "GET";

  const sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
  const headers = [
    `-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"`,
    `-H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"`,
    `-H "Accept-Language: en-US,en;q=0.5"`,
    `-H "Authorization: Bearer <REDACTED_AUTH_TOKEN>"`,
  ];

  if (isPost) {
    headers.push(`-H "Content-Type: application/json"`);
    return `curl -i -X ${method} "${sanitizedUrl}" \\\n  ${headers.join(" \\\n  ")} \\\n  --data '{"probe":"security_audit"}'`;
  }

  return `curl -i -s "${sanitizedUrl}" \\\n  ${headers.join(" \\\n  ")}`;
}

/**
 * Dispatches an action to an IDE via URI scheme and automatically copies prompt as clipboard fallback.
 */
export async function dispatchToIde(
  ideId: "cursor" | "vscode" | "vscode-insiders" | "windsurf" | "jetbrains",
  finding: FindingContext,
  targetUrl: string
): Promise<{ success: boolean; deepLink: string; prompt: string }> {
  const { path, line } = resolveFindingFilePath(finding);
  const deepLink = buildIdeDeepLink(ideId, path, line);
  const prompt = buildUniversalAgentDirective(finding, targetUrl);

  // Copy prompt to clipboard automatically
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // Ignore clipboard failure
    }
  }

  // Attempt to open deep link protocol
  if (typeof window !== "undefined") {
    try {
      window.location.href = deepLink;
    } catch {
      // Protocol handler blocked or not registered
    }
  }

  return { success: true, deepLink, prompt };
}
