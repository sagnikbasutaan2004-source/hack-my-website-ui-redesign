export type DomainResponse = {
  id: string;
  domain_url: string;
  verified: boolean;
  verification_token: string | null;
  created_at: string;
};

export type ScanComparisonResponse = {
  current_scan_id: string;
  current_scan_date: string;
  previous_scan_id: string | null;
  previous_scan_date: string | null;
  compared: boolean;
  risk_score: number;
  launch_score?: number | null;
  previous_risk_score: number | null;
  previous_launch_score?: number | null;
  score_delta: number | null;
  launch_score_delta?: number | null;
  improvement_points: number;
  regression_points: number;
  open_findings: number;
  fixed_findings: number;
  new_findings: number;
  persisting_findings: number;
  retest_fixed_findings: number;
  score_change_reason: string;
  severity_counts: Record<string, number> | null;
  previous_severity_counts: Record<string, number> | null;
};

export type DomainHistoryItem = ScanComparisonResponse & {
  scan_id: string;
  status: "queued" | "running" | "completed" | "completed_with_errors" | "failed";
  scan_mode: ScanMode;
  created_at: string;
  completed_at: string | null;
  trust_score: number | null;
  unified_security_score?: number | null;
  trust_verdict: string | null;
  safe_to_launch: boolean | null;
};

export type DomainHistoryResponse = {
  domain_id: string;
  domain_url: string;
  latest_summary: DomainHistoryItem | null;
  items: DomainHistoryItem[];
};

export type TrustMonitorResponse = {
  id: string;
  domain_id: string;
  user_id: string;
  enabled: boolean;
  cadence: "weekly" | string;
  ai_app_context: Record<string, unknown>;
  next_run_at: string | null;
  last_run_at: string | null;
  last_scan_id: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

function isNotFoundError(error: unknown) {
  return error instanceof Error && /not found/i.test(error.message);
}

export type DomainRegisterResponse = {
  domain_id: string;
  verification_token: string;
  instructions: string;
};

export type DomainVerifyResponse = {
  success: boolean;
  reason: string;
  domain: DomainResponse;
};

export type ScanMode = "public" | "authenticated" | "ai_app_trust";

export type GitHubRepository = {
  full_name: string;
  repository_id: number | null;
  private: boolean;
  default_branch: string;
  selected: boolean;
};

export type GitHubConnection = {
  id: string;
  provider: string;
  provider_user_login: string;
  provider_user_id: string | null;
  installation_id: string | null;
  selected_repository_full_name: string | null;
  selected_repository_id: number | null;
  selected_repository_private: boolean;
  permissions: Record<string, string>;
  repositories: GitHubRepository[];
  token_stored: boolean;
  created_at: string;
  updated_at: string;
};

export type GitHubStatusResponse = {
  enabled: boolean;
  test_mode_enabled: boolean;
  integration_strategy: string;
  permission_model: Record<string, string>;
  install_url: string | null;
  connected: boolean;
  connection: GitHubConnection | null;
};

export type GitHubRepositoryScanFinding = {
  tool_source: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  affected_url: string;
  affected_file: string;
  line_start: number;
  line_end: number;
  evidence: Record<string, unknown>;
  evidence_summary: string;
  fix_suggestion: string;
  owasp_category: string;
  category: string;
};

export type GitHubRepositoryScanResponse = {
  id: string;
  repository_full_name: string;
  status: string;
  findings: GitHubRepositoryScanFinding[];
  dependency_review: Record<string, unknown>;
  route_review: Record<string, unknown>;
  stack_review: Record<string, unknown>;
  summary: Record<string, unknown>;
  scanner_metadata: Record<string, unknown>;
  created_at: string;
};

export type AIAppContext = {
  built_with: string;
  app_type: string;
  has_login: boolean;
  accepts_payments: boolean;
  stores_user_data: boolean;
  stack: string[];
};

export type ScanListItem = {
  id: string;
  domain_id: string;
  user_id: string;
  status: "queued" | "running" | "completed" | "completed_with_errors" | "failed";
  scan_mode: ScanMode;
  auth_method: string | null;
  scan_metadata: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  deleted_at: string | null;
  severity_summary: Record<string, number>;
};

export type ScanStartResponse = {
  scan_id: string;
  status: "queued" | "running" | "completed" | "completed_with_errors" | "failed";
  message: string;
};

export type ClearQueuedScansResponse = {
  removed: number;
  message: string;
};

export type RetestResponse = {
  id: string;
  finding_id: string;
  scan_id: string;
  domain_id: string;
  user_id: string;
  status: "queued" | "running" | "fixed" | "still_present" | "changed" | "unable_to_verify" | "failed";
  result: Record<string, unknown> | null;
  evidence: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type RetestBatchResponse = {
  queued: number;
  message: string;
  retests: RetestResponse[];
};

export type UserPlan = "free" | "starter" | "pro" | "agency" | "custom" | "vit_free" | "vit_pro" | "vit_team";

export type UserResponse = {
  id: string;
  email: string;
  plan: UserPlan;
  plan_updated_at: string | null;
  plan_expires_at: string | null;
  billing_status: string | null;
  billing_current_period_end: string | null;
  billing_cancel_at_period_end: boolean;
  scans_used_this_month: number;
  created_at: string;
  branding_settings?: {
    agency_name?: string;
    logo_url?: string;
    brand_color_primary?: string;
    brand_color_secondary?: string;
    report_footer_text?: string;
  } | null;
};

export type CurrentUserResponse = {
  user: UserResponse;
  entitlements: {
    website_limit: number | null;
    websites_used: number;
    monthly_scan_limit: number | null;
    scans_used_this_month: number;
    pdf_download_enabled: boolean;
    ai_summary_enabled: boolean;
    multi_client_enabled: boolean;
  };
  workspace_access: boolean;
  access_message: string | null;
};

export type ScanReportDownloadResponse = {
  scan_id: string;
  download_url: string;
  expires_in_days: number;
};

export type BillingStatusResponse = {
  billing_enabled: boolean;
  plan: UserPlan;
  status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  customer_portal_enabled: boolean;
};

export type BillingCheckoutResponse = {
  provider: "stripe" | "razorpay";
  checkout_url: string | null;
  razorpay_key_id: string | null;
  razorpay_order_id: string | null;
  amount: number | null;
  currency: string | null;
  name: string | null;
  description: string | null;
  plan: UserPlan | null;
  prefill: Record<string, string> | null;
};

export type BillingVerifyResponse = {
  success: boolean;
  user: CurrentUserResponse["user"];
};

export type BillingPortalResponse = {
  portal_url: string;
};

export type WaitlistPlan = "free" | "pro" | "agency" | "custom" | "unsure";

export type WaitlistCreateInput = {
  name: string;
  email: string;
  company?: string;
  website?: string;
  interested_plan: WaitlistPlan;
  source?: string;
  message?: string;
  website_url?: string;
};

export type WaitlistCreateResponse = {
  success: boolean;
  message: string;
  lead: {
    id: string;
    masked_email: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
};

export type AdminOverviewResponse = {
  total_users: number;
  total_domains: number;
  verified_domains: number;
  total_scans: number;
  waitlist_total: number;
  scans_by_status: Record<string, number>;
  users_by_plan: Record<string, number>;
  recent_users: Array<{
    id: string;
    email: string;
    plan: UserPlan;
    billing_status: string | null;
    scans_used_this_month: number;
    created_at: string;
  }>;
  recent_waitlist: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    website: string | null;
    interested_plan: WaitlistPlan;
    source: string | null;
    message: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
  recent_scans: Array<{
    id: string;
    user_email: string;
    domain_url: string;
    status: "queued" | "running" | "completed" | "completed_with_errors" | "failed";
    scan_mode: string;
    created_at: string;
    completed_at: string | null;
    risk_score: number | null;
  }>;
};

export type ScanDetailResponse = {
  id: string;
  domain_id: string;
  user_id: string;
  status: "queued" | "running" | "completed" | "completed_with_errors" | "failed";
  scan_mode: ScanMode;
  auth_method: string | null;
  scan_metadata: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  raw_results: Record<string, unknown>;
  ai_report: string | null;
  severity_summary: Record<string, number>;
  error_message: string | null;
  findings: Array<{
    id: string;
    title: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    affected_url: string | null;
    fix_suggestion: string | null;
    owasp_category: string | null;
    tool_source: string | null;
    confidence: string | null;
    evidence: Record<string, unknown> | null;
    evidence_summary: string | null;
    business_impact: string | null;
    technical_details: string | null;
    attack_scenario: string | null;
    remediation_steps: string[] | null;
    fix_priority: string | null;
    false_positive_notes: string | null;
    retest_status: string;
    retest_last_checked_at: string | null;
  }>;
  created_at: string;
  deleted_at: string | null;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload.detail === "string"
        ? payload.detail
        : payload.reason || payload.detail?.reason || "Request failed.";
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function publicApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload.detail === "string"
        ? payload.detail
        : payload.reason || payload.detail?.reason || "Request failed.";
    throw new Error(message);
  }

  return response.json();
}

export async function joinWaitlist(input: WaitlistCreateInput): Promise<WaitlistCreateResponse> {
  return publicApiFetch("/waitlist/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerDomain(input: {
  url: string;
  token: string;
}): Promise<DomainRegisterResponse> {
  return apiFetch("/domains/register", input.token, {
    method: "POST",
    body: JSON.stringify({ url: input.url.trim() }),
  });
}

export async function verifyDomain(input: {
  domainId: string;
  token: string;
}): Promise<DomainVerifyResponse> {
  return apiFetch(`/domains/${input.domainId}/verify`, input.token, {
    method: "POST",
  });
}

export async function listDomains(token: string): Promise<DomainResponse[]> {
  return apiFetch("/domains/", token);
}

export async function getDomainHistory(input: {
  domainId: string;
  token: string;
}): Promise<DomainHistoryResponse | null> {
  try {
    return await apiFetch(`/domains/${input.domainId}/history`, input.token);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function getTrustMonitor(input: {
  domainId: string;
  token: string;
}): Promise<TrustMonitorResponse | null> {
  try {
    return await apiFetch(`/domains/${input.domainId}/trust-monitor`, input.token);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function updateTrustMonitor(input: {
  domainId: string;
  token: string;
  enabled: boolean;
  cadence?: "weekly";
  aiAppContext?: AIAppContext | null;
}): Promise<TrustMonitorResponse> {
  return apiFetch(`/domains/${input.domainId}/trust-monitor`, input.token, {
    method: "POST",
    body: JSON.stringify({
      enabled: input.enabled,
      cadence: input.cadence ?? "weekly",
      ai_app_context: input.aiAppContext ?? null,
    }),
  });
}

export async function startScan(input: {
  domainId: string;
  token: string;
  scanMode?: ScanMode;
  aiAppContext?: AIAppContext | null;
  authMethod?: string | null;
  seededRoutes?: string[];
  authHeaders?: Record<string, string>;
  authCookies?: Record<string, string>;
  authLoginUrl?: string | null;
  authUsername?: string | null;
  authPassword?: string | null;
  authSuccessUrlContains?: string | null;
  authUsernameSelector?: string | null;
  authPasswordSelector?: string | null;
  authSubmitSelector?: string | null;
  secondaryRoleLabel?: string | null;
  secondaryAuthHeaders?: Record<string, string>;
  secondaryAuthCookies?: Record<string, string>;
}): Promise<ScanStartResponse> {
  return apiFetch("/scans/start", input.token, {
    method: "POST",
    body: JSON.stringify({
      domain_id: input.domainId,
      scan_mode: input.scanMode ?? "public",
      ai_app_context: input.aiAppContext ?? null,
      auth_method: input.authMethod ?? null,
      seeded_routes: input.seededRoutes ?? [],
      auth_headers: input.authHeaders ?? null,
      auth_cookies: input.authCookies ?? null,
      auth_login_url: input.authLoginUrl ?? null,
      auth_username: input.authUsername ?? null,
      auth_password: input.authPassword ?? null,
      auth_success_url_contains: input.authSuccessUrlContains ?? null,
      auth_username_selector: input.authUsernameSelector ?? null,
      auth_password_selector: input.authPasswordSelector ?? null,
      auth_submit_selector: input.authSubmitSelector ?? null,
      secondary_role_label: input.secondaryRoleLabel ?? null,
      secondary_auth_headers: input.secondaryAuthHeaders ?? null,
      secondary_auth_cookies: input.secondaryAuthCookies ?? null,
    }),
  });
}

export async function listScans(token: string): Promise<{ items: ScanListItem[]; page: number; page_size: number; total: number }> {
  return apiFetch("/scans/", token);
}

export async function clearQueuedScans(token: string): Promise<ClearQueuedScansResponse> {
  return apiFetch("/scans/clear-queued", token, {
    method: "POST",
  });
}

export async function cancelScan(scanId: string, token: string): Promise<{ status: string; message: string }> {
  return apiFetch(`/scans/${scanId}/cancel`, token, {
    method: "POST",
  });
}

export async function getCurrentUser(token: string): Promise<CurrentUserResponse> {
  return apiFetch("/users/me", token);
}

export async function exportCurrentUserData(token: string): Promise<{ data: Record<string, unknown> }> {
  return apiFetch("/users/me/export", token);
}

export async function deleteCurrentUserData(token: string): Promise<{ success: boolean; message: string }> {
  return apiFetch("/users/me", token, { method: "DELETE" });
}

export async function updateUserBranding(
  token: string,
  input: {
    agencyName?: string;
    logoUrl?: string;
    brandColorPrimary?: string;
    brandColorSecondary?: string;
    reportFooterText?: string;
  }
): Promise<UserResponse> {
  return apiFetch("/users/me/branding", token, {
    method: "PUT",
    body: JSON.stringify({
      agency_name: input.agencyName || null,
      logo_url: input.logoUrl || null,
      brand_color_primary: input.brandColorPrimary || null,
      brand_color_secondary: input.brandColorSecondary || null,
      report_footer_text: input.reportFooterText || null,
    }),
  });
}

export async function getAdminOverview(token: string): Promise<AdminOverviewResponse> {
  return apiFetch("/admin/overview", token);
}

export async function getBillingStatus(token: string): Promise<BillingStatusResponse> {
  return apiFetch("/billing/status", token);
}

export async function getGitHubStatus(token: string): Promise<GitHubStatusResponse> {
  return apiFetch("/github/status", token);
}

export async function connectGitHubTest(input: {
  token: string;
  githubUsername: string;
  repositories: Array<{
    full_name: string;
    repository_id?: number | null;
    private?: boolean;
    default_branch?: string;
  }>;
}): Promise<GitHubStatusResponse> {
  return apiFetch("/github/connect-test", input.token, {
    method: "POST",
    body: JSON.stringify({
      github_username: input.githubUsername,
      repositories: input.repositories,
    }),
  });
}

export async function listGitHubRepositories(token: string): Promise<GitHubRepository[]> {
  return apiFetch("/github/repositories", token);
}

export async function selectGitHubRepository(input: {
  token: string;
  repositoryFullName: string;
}): Promise<GitHubConnection> {
  return apiFetch("/github/repositories/select", input.token, {
    method: "POST",
    body: JSON.stringify({ repository_full_name: input.repositoryFullName }),
  });
}

export async function disconnectGitHub(token: string): Promise<void> {
  await apiFetch("/github/disconnect", token, { method: "DELETE" });
}

export async function runGitHubRepositoryScan(input: {
  token: string;
  repositoryFullName?: string | null;
  files: Array<{ path: string; content: string }>;
}): Promise<GitHubRepositoryScanResponse> {
  return apiFetch("/github/repository-scan", input.token, {
    method: "POST",
    body: JSON.stringify({
      repository_full_name: input.repositoryFullName || null,
      files: input.files,
    }),
  });
}

export async function getLatestGitHubRepositoryScan(input: {
  token: string;
  repositoryFullName?: string | null;
}): Promise<GitHubRepositoryScanResponse | null> {
  const suffix = input.repositoryFullName ? `?repository_full_name=${encodeURIComponent(input.repositoryFullName)}` : "";
  try {
    return await apiFetch(`/github/repository-scans/latest${suffix}`, input.token);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createBillingCheckout(input: {
  plan: UserPlan;
  token: string;
}): Promise<BillingCheckoutResponse> {
  return apiFetch("/billing/checkout", input.token, {
    method: "POST",
    body: JSON.stringify({ plan: input.plan }),
  });
}

export async function verifyRazorpayPayment(input: {
  token: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<BillingVerifyResponse> {
  return apiFetch("/billing/razorpay/verify", input.token, {
    method: "POST",
    body: JSON.stringify({
      razorpay_order_id: input.razorpayOrderId,
      razorpay_payment_id: input.razorpayPaymentId,
      razorpay_signature: input.razorpaySignature,
    }),
  });
}

export async function recordBillingAbandoned(input: {
  plan: string;
  razorpayOrderId?: string;
  token: string;
}): Promise<{ recorded: boolean }> {
  return apiFetch("/billing/abandoned", input.token, {
    method: "POST",
    body: JSON.stringify({
      plan: input.plan,
      razorpay_order_id: input.razorpayOrderId,
    }),
  });
}

export async function createBillingPortal(token: string): Promise<BillingPortalResponse> {
  return apiFetch("/billing/portal", token, {
    method: "POST",
  });
}

export async function getScan(input: {
  scanId: string;
  token: string;
}): Promise<ScanDetailResponse> {
  return apiFetch(`/scans/${input.scanId}`, input.token);
}

export async function getScanComparison(input: {
  scanId: string;
  token: string;
}): Promise<ScanComparisonResponse | null> {
  try {
    return await apiFetch(`/scans/${input.scanId}/comparison`, input.token);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function retestFinding(input: {
  findingId: string;
  token: string;
}): Promise<RetestResponse> {
  return apiFetch(`/findings/${input.findingId}/retest`, input.token, {
    method: "POST",
  });
}

export async function listFindingRetests(input: {
  findingId: string;
  token: string;
}): Promise<RetestResponse[]> {
  return apiFetch(`/findings/${input.findingId}/retests`, input.token);
}

export async function retestOpenFindings(input: {
  scanId: string;
  token: string;
}): Promise<RetestBatchResponse> {
  return apiFetch(`/scans/${input.scanId}/retest-open-findings`, input.token, {
    method: "POST",
  });
}

export async function downloadScanReport(input: {
  scanId: string;
  token: string;
}): Promise<ScanReportDownloadResponse> {
  return apiFetch(`/scans/${input.scanId}/report/download`, input.token);
}

export async function updateWaitlistStatus(input: {
  token: string;
  leadId: string;
  status: string;
}): Promise<any> {
  return apiFetch(`/admin/waitlist/${input.leadId}/status`, input.token, {
    method: "PATCH",
    body: JSON.stringify({ status: input.status }),
  });
}

export async function updateUserPlan(input: {
  token: string;
  userId: string;
  plan: string;
}): Promise<any> {
  return apiFetch(`/admin/users/${input.userId}/plan`, input.token, {
    method: "PATCH",
    body: JSON.stringify({ plan: input.plan }),
  });
}

export async function deleteDomain(input: {
  domainId: string;
  token: string;
}): Promise<void> {
  await apiFetch(`/domains/${input.domainId}`, input.token, {
    method: "DELETE",
  });
}

export async function testWebhookDispatcher(input: {
  token: string;
  webhookUrl: string;
  channelType: "slack" | "discord";
}): Promise<{ status: string; message: string }> {
  return apiFetch("/notifications/test-webhook", input.token, {
    method: "POST",
    body: JSON.stringify({
      webhook_url: input.webhookUrl,
      channel_type: input.channelType,
    }),
  });
}

export interface GitHubPolicy {
  min_launch_score: number;
  auto_create_issues: boolean;
  installation_id?: string | null;
  app_slug?: string | null;
  connected: boolean;
  slack_webhook_url?: string | null;
  discord_webhook_url?: string | null;
  updated_at?: string | null;
}

export async function getGitHubPolicy(token: string): Promise<GitHubPolicy> {
  return apiFetch("/github/policy", token);
}

export async function updateGitHubPolicy(
  token: string,
  payload: {
    min_launch_score: number;
    auto_create_issues: boolean;
    installation_id?: string | null;
    webhook_secret?: string | null;
    app_slug?: string | null;
    slack_webhook_url?: string | null;
    discord_webhook_url?: string | null;
  }
): Promise<GitHubPolicy> {
  return apiFetch("/github/policy", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}


