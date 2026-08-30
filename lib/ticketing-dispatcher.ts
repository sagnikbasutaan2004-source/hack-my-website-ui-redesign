export interface TicketingFindingContext {
  id: string;
  title: string;
  severity: string;
  description: string;
  affected_url?: string | null;
  owasp_category?: string | null;
  tool_source?: string | null;
  evidence_summary?: string | null;
  business_impact?: string | null;
  fix_suggestion?: string | null;
  remediation_steps?: string[] | null;
}

/**
 * Builds a GitHub new issue URL pre-filled with formatted vulnerability markdown.
 */
export function buildGitHubIssueUrl(
  finding: TicketingFindingContext,
  targetUrl: string,
  repoUrl?: string
): string {
  const title = `[Security] ${finding.severity.toUpperCase()}: ${finding.title}`;
  const body = buildIssueMarkdownBody(finding, targetUrl);

  const cleanRepo = repoUrl?.trim().replace(/\/+$/, "");
  const match = cleanRepo?.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);

  if (match) {
    const owner = match[1];
    const repo = match[2];
    const url = new URL(`https://github.com/${owner}/${repo}/issues/new`);
    url.searchParams.set("title", title);
    url.searchParams.set("body", body);
    url.searchParams.set("labels", `security,vulnerability,${finding.severity.toLowerCase()}`);
    return url.toString();
  }

  // Fallback if no specific repo is attached: encode title & body query params to allow 1-click filing once repo is selected
  const url = new URL("https://github.com");
  return url.toString();
}

/**
 * Builds a Linear new issue URL pre-filled with formatted vulnerability markdown.
 */
export function buildLinearIssueUrl(
  finding: TicketingFindingContext,
  targetUrl: string
): string {
  const title = `[Security] ${finding.severity.toUpperCase()}: ${finding.title}`;
  const description = buildIssueMarkdownBody(finding, targetUrl);

  const url = new URL("https://linear.app/new");
  url.searchParams.set("title", title);
  url.searchParams.set("description", description);

  return url.toString();
}

/**
 * Formats a clean, standard Markdown body suitable for Jira, Linear, GitHub, and GitLab.
 */
export function buildIssueMarkdownBody(
  finding: TicketingFindingContext,
  targetUrl: string
): string {
  const endpoint = finding.affected_url || targetUrl;
  const lines: string[] = [
    `### Security Vulnerability Report`,
    ``,
    `| Property | Value |`,
    `| :--- | :--- |`,
    `| **Vulnerability** | \`${finding.title}\` |`,
    `| **Severity** | **${finding.severity.toUpperCase()}** |`,
    `| **OWASP Category** | ${finding.owasp_category || "A05:2021-Security Misconfiguration"} |`,
    `| **Affected Endpoint** | \`${endpoint}\` |`,
    `| **Audit ID** | \`${finding.id}\` |`,
    ``,
    `#### Overview & Description`,
    finding.description,
    ``,
  ];

  if (finding.business_impact) {
    lines.push(`#### Business Impact & Attack Vector`, finding.business_impact, ``);
  }

  if (finding.evidence_summary) {
    lines.push(`#### Scanner Telemetry Evidence`, `> ${finding.evidence_summary}`, ``);
  }

  lines.push(`#### Recommended Remediation Steps`);
  if (finding.remediation_steps && finding.remediation_steps.length > 0) {
    finding.remediation_steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. ${step}`);
    });
  } else if (finding.fix_suggestion) {
    lines.push(finding.fix_suggestion);
  } else {
    lines.push(`1. Inspect affected configuration and enforce required defense headers/validations.`);
  }

  lines.push(
    ``,
    `---`,
    `*Generated automatically by [Hack My Website Security Assessment](https://hackmywebsite.io)*`
  );

  return lines.join("\n");
}
