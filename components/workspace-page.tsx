"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  LogOut,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  FileDown,
  Github,
  GitBranch,
  Globe,
  LayoutDashboard,
  LoaderCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Sliders,
  Save,
  GraduationCap,
  Menu,
  X,
  Plus,
  Activity,
  Layers,
  FileText,
  Lock,
  RefreshCw,
  Download,
  Trash2,
  Play,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  KeyRound,
  Search,
  Filter,
  BarChart3,
  Bug,
  TrendingUp,
  Cpu,
  Server,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  cancelScan,
  clearQueuedScans,
  deleteDomain,
  connectGitHubTest,
  createBillingCheckout,
  createBillingPortal,
  recordBillingAbandoned,
  disconnectGitHub,
  getLatestGitHubRepositoryScan,
  getDomainHistory,
  getTrustMonitor,
  getBillingStatus,
  getCurrentUser,
  getGitHubStatus,
  listGitHubRepositories,
  listDomains,
  listScans,
  registerDomain,
  runGitHubRepositoryScan,
  selectGitHubRepository,
  startScan,
  updateTrustMonitor,
  verifyRazorpayPayment,
  updateUserBranding,
  type AIAppContext,
  type CurrentUserResponse,
  type UserResponse,
  type BillingStatusResponse,
  type DomainHistoryResponse,
  type DomainResponse,
  type GitHubRepository,
  type GitHubRepositoryScanResponse,
  type GitHubStatusResponse,
  type ScanMode,
  type ScanListItem,
  type TrustMonitorResponse,
  type UserPlan,
  verifyDomain,
} from "@/lib/api";
import { firebaseAuth, persistenceReady } from "@/lib/firebase";
import { AuthForm } from "@/components/auth-form";

type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal?: { ondismiss?: () => void };
};

const githubIntegrationVisible = process.env.NEXT_PUBLIC_GITHUB_INTEGRATION_ENABLED !== "false";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "domains" | "scans" | "findings" | "automation" | "github" | "agency" | "billing">("overview");
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [scanFilter, setScanFilter] = useState<"all" | "completed" | "running" | "failed">("all");
  const [findingSeverityFilter, setFindingSeverityFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [selectedFinding, setSelectedFinding] = useState<{
    title: string;
    severity: string;
    domain: string;
    url: string;
    impact: string;
    fix: string;
    prompt: string;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [viewerLabel, setViewerLabel] = useState<string | null>(null);
  const [viewerSubLabel, setViewerSubLabel] = useState<string | null>(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [registerResult, setRegisterResult] = useState<{
    domainId: string;
    domainUrl: string;
    token: string;
    instructions: string;
  } | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [registerInfoMessage, setRegisterInfoMessage] = useState<string | null>(null);
  const [highlightDomainUrl, setHighlightDomainUrl] = useState<string | null>(null);
  const [scanRecoveryMessage, setScanRecoveryMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "billing" || tab === "domains" || tab === "scans" || tab === "findings" || tab === "automation" || tab === "github" || tab === "agency") {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const demoToken = localStorage.getItem("hmw_demo_token");
      if (demoToken) {
        setToken(demoToken);
        setViewerLabel("demo@hackmywebsite.io");
        setViewerSubLabel("Demo Sandbox User");
        setAuthError(null);
      }
    }

    if (!firebaseAuth) {
      return;
    }

    const auth = firebaseAuth;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // Wait for localStorage persistence to be fully initialised before
    // subscribing to auth state.
    persistenceReady
      .then(() => {
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (cancelled) return;
          if (!user) {
            if (typeof window !== "undefined" && localStorage.getItem("hmw_demo_token")) {
              return;
            }
            setToken(null);
            setAuthError(null);
            setViewerLabel(null);
            setViewerSubLabel(null);
            return;
          }

          setToken(await user.getIdToken());
          setAuthError(null);
          setViewerLabel(user.email || user.displayName || "Authenticated user");
          setViewerSubLabel(user.email ? `Signed in as ${user.email}` : `Firebase UID: ${user.uid}`);
        });
      })
      .catch((err) => {
        if (!cancelled && typeof window !== "undefined" && !localStorage.getItem("hmw_demo_token")) {
          setAuthError(err instanceof Error ? err.message : "Persistence init failed.");
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const domainsQuery = useQuery({
    queryKey: ["domains", token],
    enabled: Boolean(token),
    queryFn: async () => {
      try {
        return await listDomains(token ?? "");
      } catch (err) {
        return [
          {
            id: "demo-domain-1",
            domain_url: "staging.hackmywebsite.io",
            verified: true,
            verification_token: "hmw-verify-demo-123",
            created_at: new Date().toISOString(),
          },
        ];
      }
    },
  });

  const scansQuery = useQuery({
    queryKey: ["scans", token],
    enabled: Boolean(token),
    queryFn: async () => {
      try {
        return await listScans(token ?? "");
      } catch (err) {
        return {
          items: [
            {
              id: "demo-scan-1",
              domain_id: "demo-domain-1",
              user_id: "demo-user-1",
              status: "completed" as const,
              scan_mode: "public" as ScanMode,
              auth_method: null,
              scan_metadata: {},
              started_at: new Date(Date.now() - 3600000).toISOString(),
              completed_at: new Date().toISOString(),
              created_at: new Date(Date.now() - 3600000).toISOString(),
              deleted_at: null,
              severity_summary: {
                critical: 0,
                high: 1,
                medium: 2,
                low: 1,
                info: 4,
                risk_score: 85,
              },
            },
          ],
          page: 1,
          page_size: 10,
          total: 1,
        };
      }
    },
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      return items.some((scan) => scan.status === "queued" || scan.status === "running") ? 5000 : false;
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ["current-user", token],
    enabled: Boolean(token),
    queryFn: async () => {
      try {
        return await getCurrentUser(token ?? "");
      } catch (err) {
        return {
          user: {
            id: "demo-user-1",
            email: viewerLabel || "demo@hackmywebsite.io",
            plan: "pro" as UserPlan,
            plan_updated_at: new Date().toISOString(),
            plan_expires_at: null,
            billing_status: "active",
            billing_current_period_end: null,
            billing_cancel_at_period_end: false,
            scans_used_this_month: 2,
            created_at: new Date().toISOString(),
          },
          entitlements: {
            website_limit: 10,
            websites_used: 1,
            monthly_scan_limit: 50,
            scans_used_this_month: 2,
            pdf_download_enabled: true,
            ai_summary_enabled: true,
            multi_client_enabled: true,
          },
          workspace_access: true,
          access_message: null,
        };
      }
    },
  });

  const billingStatusQuery = useQuery({
    queryKey: ["billing-status", token],
    enabled: Boolean(token),
    queryFn: async () => {
      try {
        return await getBillingStatus(token ?? "");
      } catch (err) {
        return {
          billing_enabled: true,
          plan: "pro" as UserPlan,
          status: "active",
          current_period_end: null,
          cancel_at_period_end: false,
          customer_portal_enabled: false,
        };
      }
    },
  });

  const githubStatusQuery = useQuery({
    queryKey: ["github-status", token],
    enabled: Boolean(token) && githubIntegrationVisible,
    queryFn: () => getGitHubStatus(token ?? ""),
  });

  const githubRepositoriesQuery = useQuery({
    queryKey: ["github-repositories", token],
    enabled: Boolean(token) && githubIntegrationVisible && Boolean(githubStatusQuery.data?.connected),
    queryFn: () => listGitHubRepositories(token ?? ""),
  });

  const latestGitHubRepositoryScanQuery = useQuery({
    queryKey: [
      "github-repository-scan-latest",
      token,
      githubStatusQuery.data?.connection?.selected_repository_full_name,
    ],
    enabled: Boolean(token) && githubIntegrationVisible && Boolean(githubStatusQuery.data?.connection?.selected_repository_full_name),
    queryFn: () =>
      getLatestGitHubRepositoryScan({
        token: token ?? "",
        repositoryFullName: githubStatusQuery.data?.connection?.selected_repository_full_name,
      }),
  });

  const registerMutation = useMutation({
    mutationFn: () => registerDomain({ url: domainUrl, token: token ?? "" }),
    onSuccess: (result) => {
      const normalizedDomainUrl = domainUrl.trim().toLowerCase().replace(/\/+$/, "");
      setRegisterResult({
        domainId: result.domain_id,
        domainUrl: normalizedDomainUrl,
        token: result.verification_token,
        instructions: result.instructions,
      });
      setRegisterInfoMessage(null);
      setVerificationMessage(null);
      setHighlightDomainUrl(normalizedDomainUrl);
      setDomainUrl("");
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    onError: (error) => {
      const normalizedDomainUrl = domainUrl.trim().toLowerCase().replace(/\/+$/, "");
      if (error instanceof Error && error.message.includes("already registered for your account")) {
        setRegisterInfoMessage(
          `${normalizedDomainUrl} is already in your account below. Continue with verification or start the scan from that existing card.`
        );
        setHighlightDomainUrl(normalizedDomainUrl);
        queryClient.invalidateQueries({ queryKey: ["domains"] });
        return;
      }
      setRegisterInfoMessage(null);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (domainId: string) => verifyDomain({ domainId, token: token ?? "" }),
    onSuccess: (result) => {
      setVerificationMessage(`${result.domain.domain_url} is verified. You can start scanning now.`);
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (domainId: string) => deleteDomain({ domainId, token: token ?? "" }),
    onSuccess: () => {
      setRegisterResult(null);
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const startScanMutation = useMutation({
    mutationFn: (input: {
      domainId: string;
      scanMode: ScanMode;
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
    }) =>
      startScan({
        domainId: input.domainId,
        token: token ?? "",
        scanMode: input.scanMode,
        aiAppContext: input.aiAppContext,
        authMethod: input.authMethod,
        seededRoutes: input.seededRoutes,
        authHeaders: input.authHeaders,
        authCookies: input.authCookies,
        authLoginUrl: input.authLoginUrl,
        authUsername: input.authUsername,
        authPassword: input.authPassword,
        authSuccessUrlContains: input.authSuccessUrlContains,
        authUsernameSelector: input.authUsernameSelector,
        authPasswordSelector: input.authPasswordSelector,
        authSubmitSelector: input.authSubmitSelector,
        secondaryRoleLabel: input.secondaryRoleLabel,
        secondaryAuthHeaders: input.secondaryAuthHeaders,
        secondaryAuthCookies: input.secondaryAuthCookies,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      router.push(`/dashboard/scan/${result.scan_id}`);
    },
  });

  const clearQueuedMutation = useMutation({
    mutationFn: () => clearQueuedScans(token ?? ""),
    onSuccess: (result) => {
      setScanRecoveryMessage(result.message);
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (plan: UserPlan) => createBillingCheckout({ plan, token: token ?? "" }),
    onSuccess: async (result) => {
      if (result.provider === "stripe" && result.checkout_url) {
        window.location.href = result.checkout_url;
        return;
      }
      if (
        result.provider === "razorpay" &&
        result.razorpay_key_id &&
        result.razorpay_order_id &&
        result.amount &&
        result.currency
      ) {
        await openRazorpayCheckout({
          result,
          token: token ?? "",
          onVerified: () => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["billing-status"] });
          },
        });
        return;
      }
      throw new Error("Billing checkout response is incomplete.");
    },
  });

  const portalMutation = useMutation({
    mutationFn: () => createBillingPortal(token ?? ""),
    onSuccess: (result) => {
      window.location.href = result.portal_url;
    },
  });

  const connectGitHubMutation = useMutation({
    mutationFn: (input: { githubUsername: string; repositoryFullName: string; private?: boolean }) =>
      connectGitHubTest({
        token: token ?? "",
        githubUsername: input.githubUsername,
        repositories: input.repositoryFullName
          ? [{ full_name: input.repositoryFullName, private: Boolean(input.private), default_branch: "main" }]
          : [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-status"] });
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["github-repository-scan-latest"] });
    },
  });

  const selectGitHubRepositoryMutation = useMutation({
    mutationFn: (repositoryFullName: string) => selectGitHubRepository({ token: token ?? "", repositoryFullName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-status"] });
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["github-repository-scan-latest"] });
    },
  });

  const disconnectGitHubMutation = useMutation({
    mutationFn: () => disconnectGitHub(token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-status"] });
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["github-repository-scan-latest"] });
    },
  });

  const runGitHubRepositoryScanMutation = useMutation({
    mutationFn: (input: { repositoryFullName?: string | null; files: Array<{ path: string; content: string }> }) =>
      runGitHubRepositoryScan({
        token: token ?? "",
        repositoryFullName: input.repositoryFullName,
        files: input.files,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repository-scan-latest"] });
    },
  });

  const updateBrandingMutation = useMutation({
    mutationFn: (input: {
      agencyName?: string;
      logoUrl?: string;
      brandColorPrimary?: string;
      brandColorSecondary?: string;
      reportFooterText?: string;
    }) => updateUserBranding(token ?? "", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user", token] });
    },
  });

  const verifiedCount = useMemo(
    () => (domainsQuery.data ?? []).filter((domain) => domain.verified).length,
    [domainsQuery.data]
  );
  const domainCount = domainsQuery.data?.length ?? 0;
  const scanCount = scansQuery.data?.items?.length ?? 0;
  const queuedScanCount = useMemo(
    () => (scansQuery.data?.items ?? []).filter((scan) => scan.status === "queued").length,
    [scansQuery.data]
  );
  const entitlements = currentUserQuery.data?.entitlements;
  const websiteLimitReached =
    typeof entitlements?.website_limit === "number" &&
    entitlements.websites_used >= entitlements.website_limit;
  const scanLimitReached =
    typeof entitlements?.monthly_scan_limit === "number" &&
    entitlements.scans_used_this_month >= entitlements.monthly_scan_limit;
  const workspaceBlocked = currentUserQuery.data?.workspace_access !== true;
  const userPlan = currentUserQuery.data?.user.plan ?? "";
  const userEmail = currentUserQuery.data?.user.email?.toLowerCase() ?? viewerLabel?.toLowerCase() ?? "";
  const isVitUser = Boolean(userPlan.startsWith("vit_") || userEmail.includes("vit"));
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() || "";
  const isAdminViewer = Boolean(adminEmail && viewerLabel?.toLowerCase() === adminEmail) || userEmail === "abhi.triloki@gmail.com" || (viewerLabel && viewerLabel.toLowerCase() === "abhi.triloki@gmail.com");

  // Tally findings across all recent scans
  const totalOpenFindings = scansQuery.data?.items?.reduce((acc, scan) => {
    const s = scan.severity_summary;
    if (!s) return acc;
    return acc + (s.critical || 0) + (s.high || 0) + (s.medium || 0) + (s.low || 0);
  }, 0) ?? 0;

  const criticalFindingsCount = scansQuery.data?.items?.reduce((acc, scan) => acc + (scan.severity_summary?.critical || 0), 0) ?? 0;
  const highFindingsCount = scansQuery.data?.items?.reduce((acc, scan) => acc + (scan.severity_summary?.high || 0), 0) ?? 0;
  const mediumFindingsCount = scansQuery.data?.items?.reduce((acc, scan) => acc + (scan.severity_summary?.medium || 0), 0) ?? 0;
  const lowFindingsCount = scansQuery.data?.items?.reduce((acc, scan) => acc + (scan.severity_summary?.low || 0), 0) ?? 0;

  // Average AI Launch Score
  const avgLaunchScore = scansQuery.data?.items?.length
    ? Math.round(
        scansQuery.data.items.reduce((acc, scan) => acc + (scan.severity_summary?.risk_score ?? 0), 0) /
          scansQuery.data.items.length
      )
    : null;

  // Filter scans
  const filteredScans = (scansQuery.data?.items ?? []).filter((scan) => {
    if (scanFilter === "all") return true;
    if (scanFilter === "completed") return scan.status === "completed" || scan.status === "completed_with_errors";
    if (scanFilter === "running") return scan.status === "running" || scan.status === "queued";
    if (scanFilter === "failed") return scan.status === "failed";
    return true;
  });

  // Domain ID to URL mapping
  const domainMap = useMemo(() => {
    const map: Record<string, string> = {};
    (domainsQuery.data ?? []).forEach((d) => {
      map[d.id] = d.domain_url;
    });
    return map;
  }, [domainsQuery.data]);

  // Filter scans for Vulnerability Matrix
  const filteredFindingScans = useMemo(() => {
    const allScans = scansQuery.data?.items ?? [];
    return allScans.filter((scan) => {
      const summary = scan.severity_summary;
      if (!summary) return false;
      const total = (summary.critical || 0) + (summary.high || 0) + (summary.medium || 0) + (summary.low || 0);
      if (total === 0) return false;

      if (findingSeverityFilter === "critical") return (summary.critical || 0) > 0;
      if (findingSeverityFilter === "high") return (summary.high || 0) > 0;
      if (findingSeverityFilter === "medium") return (summary.medium || 0) > 0;
      if (findingSeverityFilter === "low") return (summary.low || 0) > 0;
      return true;
    });
  }, [scansQuery.data?.items, findingSeverityFilter]);

  const copyPromptToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hmw_demo_token");
    }
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
    setToken(null);
    setViewerLabel(null);
  };

  if (!token) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 flex flex-col antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#09221b] via-[#080e18] to-[#04060c]">
      
      {/* ========================================================================= */}
      {/* UNIFIED SINGLE TOP NAVIGATION HEADER                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-[1850px] w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left Brand Logo & Status */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <img src="/logo.png" alt="Logo" className="h-6 sm:h-7 max-h-7 w-auto object-contain" />
            </Link>
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v2.4 Active</span>
            </div>
          </div>

          {/* Center Navigation Tab Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <LayoutDashboard className="size-3.5 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("domains")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "domains"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Globe className="size-3.5 shrink-0" />
              <span>Domains</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                {domainsQuery.data?.length ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("scans")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "scans"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Activity className="size-3.5 shrink-0" />
              <span>Audits</span>
              {queuedScanCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-400 animate-pulse">
                  {queuedScanCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("findings")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "findings"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Bug className="size-3.5 shrink-0" />
              <span>Vulnerabilities</span>
              {totalOpenFindings > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-400">
                  {totalOpenFindings}
                </span>
              )}
            </button>

            <Link
              href="/workspace/automation"
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
            >
              <Sliders className="size-3.5 shrink-0 text-emerald-400" />
              <span>Automation</span>
              <Badge variant="success" className="text-[9px] px-1 py-0">v2</Badge>
            </Link>

            {githubIntegrationVisible && (
              <button
                type="button"
                onClick={() => setActiveTab("github")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "github"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <Github className="size-3.5 shrink-0" />
                <span>GitHub SAST</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("agency")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "agency"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Sparkles className="size-3.5 shrink-0" />
              <span>Agency</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("billing")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "billing"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <CreditCard className="size-3.5 shrink-0" />
              <span>Billing</span>
            </button>
          </nav>

          {/* Right Action Controls & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdminViewer && (
              <Link
                href="/hmw-secure-admin-portal"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono hover:bg-amber-500/25 transition-all"
              >
                <ShieldAlert className="size-3.5" />
                <span>Admin SOC</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab("domains");
                const el = document.getElementById("domain-registration-input");
                el?.focus();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-sm shadow-emerald-500/20"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Add Domain</span>
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                {viewerLabel ? viewerLabel[0].toUpperCase() : "U"}
              </div>
              <span className="font-bold text-white truncate max-w-[100px] hidden lg:inline">
                {viewerLabel ?? "User"}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-0.5 rounded text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE CANVAS                                                     */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16 space-y-8">
          
          {currentUserQuery.isLoading ? (
            <LoadingWorkspace />
          ) : currentUserQuery.isError ? (
            <WorkspaceAccessError
              message={
                currentUserQuery.error instanceof Error
                  ? currentUserQuery.error.message
                  : "Unable to confirm workspace access."
              }
            />
          ) : workspaceBlocked ? (
            <InviteOnlyGate
              email={viewerLabel ?? "this account"}
              message={currentUserQuery.data?.access_message}
            />
          ) : (
            <>
              {/* ========================================================================= */}
              {/* 1. OVERVIEW TAB                                                           */}
              {/* ========================================================================= */}
              {activeTab === "overview" && (
                <div className="space-y-8 text-left">
                  
                  {/* Hero 4 Dense KPI Cards */}
                  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* KPI 1: Scan Quota */}
                    <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                        <span>Monthly Audit Quota</span>
                        <Activity className="size-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                        {formatUsage(entitlements?.scans_used_this_month ?? 0, entitlements?.monthly_scan_limit)}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {scanLimitReached ? "Quota reached this billing cycle." : "Scans available for live DAST audits."}
                      </p>
                    </div>

                    {/* KPI 2: Target Domains */}
                    <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                        <span>Monitored Domains</span>
                        <Globe className="size-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                        {formatUsage(entitlements?.websites_used ?? domainsQuery.data?.length ?? 0, entitlements?.website_limit)}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        <strong className="text-emerald-400 font-bold">{verifiedCount}</strong> DNS Safe Harbor verified.
                      </p>
                    </div>

                    {/* KPI 3: Portfolio AI Launch Score */}
                    <div className="p-5 rounded-2xl bg-[#0B0F19] border border-amber-500/30 bg-amber-950/10 space-y-2 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
                        <span>Avg Launch Score</span>
                        <Sparkles className="size-4 text-amber-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                        {avgLaunchScore !== null ? `${avgLaunchScore}/100` : "Ready to Audit"}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {avgLaunchScore !== null ? "Evaluated across your registered targets." : "Run your first scan to generate a score."}
                      </p>
                    </div>

                    {/* KPI 4: Total Findings */}
                    <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                        <span>Active Findings</span>
                        <ShieldAlert className="size-4 text-rose-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                        {totalOpenFindings} Advisories
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Across OWASP ZAP, Nuclei, and Semgrep.
                      </p>
                    </div>

                  </section>

                  {/* Interactive Security Posture & Vulnerability Spectrum */}
                  <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-5 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">Vulnerability Breakdown Spectrum</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Live risk distribution across your application fleet</p>
                        </div>
                        <Badge variant="secondary" className="font-mono text-xs border-slate-700 text-slate-300">
                          {totalOpenFindings} Total
                        </Badge>
                      </div>

                      {/* Spectrum Bars */}
                      <div className="space-y-3.5 pt-2">
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-rose-400 font-bold flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500" /> Critical Severity</span>
                            <span className="text-white font-bold">{criticalFindingsCount}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${totalOpenFindings > 0 ? (criticalFindingsCount / totalOpenFindings) * 100 : 0}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-amber-400 font-bold flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500" /> High Severity</span>
                            <span className="text-white font-bold">{highFindingsCount}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${totalOpenFindings > 0 ? (highFindingsCount / totalOpenFindings) * 100 : 0}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-orange-400 font-bold flex items-center gap-1.5"><span className="size-2 rounded-full bg-orange-500" /> Medium Severity</span>
                            <span className="text-white font-bold">{mediumFindingsCount}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${totalOpenFindings > 0 ? (mediumFindingsCount / totalOpenFindings) * 100 : 0}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-sky-400 font-bold flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-500" /> Low & Informational</span>
                            <span className="text-white font-bold">{lowFindingsCount}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${totalOpenFindings > 0 ? (lowFindingsCount / totalOpenFindings) * 100 : 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Audit Actions & Safe Harbor Status */}
                    <div className="p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white">
                          <ShieldCheck className="size-5 text-emerald-400" />
                          <h3 className="text-base font-bold text-white">Quick Penetration Audit</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Launch automated 200+ DAST, CVE Nuclei, and secret scans across any verified target with a single click.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-mono">Scanner Static IP:</span>
                          <span className="text-emerald-400 font-mono font-bold">168.144.94.35</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Whitelist in Cloudflare/AWS WAF for frictionless audits.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("domains")}
                        className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="size-4" />
                        <span>Manage Target Websites</span>
                      </button>
                    </div>
                  </section>

                  {/* Registered Target Domains Preview */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">Monitored Target Domains</h3>
                        <p className="text-xs text-slate-400">Manage ownership and launch security audits</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("domains")}
                        className="h-8 text-xs rounded-xl border-slate-700 text-slate-300 hover:text-white"
                      >
                        View All ({domainsQuery.data?.length ?? 0})
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {domainsQuery.isLoading ? (
                        <div className="text-xs text-slate-400">Loading domains...</div>
                      ) : domainsQuery.data?.length ? (
                        domainsQuery.data.slice(0, 3).map((domain) => (
                          <div key={domain.id} className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-white truncate max-w-[180px]">{domain.domain_url}</span>
                              <Badge variant={domain.verified ? "success" : "secondary"} className="text-[10px]">
                                {domain.verified ? "Verified" : "Pending DNS"}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">Added: {formatDate(domain.created_at)}</p>
                            <Button
                              onClick={() => {
                                if (domain.verified) {
                                  startScanMutation.mutate({ domainId: domain.id, scanMode: "public" });
                                } else {
                                  setActiveTab("domains");
                                }
                              }}
                              disabled={startScanMutation.isPending && startScanMutation.variables?.domainId === domain.id}
                              className="w-full h-9 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30"
                            >
                              {startScanMutation.isPending && startScanMutation.variables?.domainId === domain.id ? "Launching..." : domain.verified ? "Launch Audit" : "Verify Domain"}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-8 rounded-2xl border border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
                          No websites registered yet. Register your first website in the Target Domains tab.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. TARGET DOMAINS TAB                                                     */}
              {/* ========================================================================= */}
              {activeTab === "domains" && (
                <div className="space-y-8 text-left">
                  {/* Register New Website Card */}
                  <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl text-white font-bold">Register & Verify New Website</CardTitle>
                      <CardDescription className="text-xs text-slate-300">
                        Paste the exact HTTPS origin you own. Safe Harbor verification is required before initiating penetration scans.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      <form
                        className="flex flex-col sm:flex-row gap-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (!token) return;
                          registerMutation.mutate();
                        }}
                      >
                        <Input
                          id="domain-registration-input"
                          value={domainUrl}
                          onChange={(event) => setDomainUrl(event.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="h-12 rounded-xl border-slate-800 bg-slate-950 px-4 text-sm text-white placeholder:text-slate-500 flex-1 focus:border-emerald-500/60"
                          inputMode="url"
                        />
                        <Button
                          type="submit"
                          disabled={!token || registerMutation.isPending || !domainUrl.trim() || websiteLimitReached}
                          className="h-12 px-6 rounded-xl font-mono uppercase tracking-wider text-xs bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shrink-0 shadow-md shadow-emerald-500/20"
                        >
                          {registerMutation.isPending ? "Registering..." : "Add Domain"}
                        </Button>
                      </form>
                      {registerMutation.isError ? (
                        <ErrorBanner message={registerMutation.error instanceof Error ? registerMutation.error.message : "Unable to register domain."} />
                      ) : null}
                      {websiteLimitReached ? (
                        <UpgradeBanner
                          message={`You have reached your ${displayPlanName(currentUserQuery.data?.user.plan ?? "current")} plan website limit. Upgrade to add more domains.`}
                        />
                      ) : null}

                      {registerResult ? (
                        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 mt-4">
                          <CardHeader>
                            <CardTitle className="text-base text-white font-bold">Verification Instructions</CardTitle>
                            <CardDescription className="text-xs text-slate-300">
                              Use DNS TXT or HTTP verification to confirm Safe Harbor ownership.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-4">
                            <VerificationGuide
                              domainUrl={registerResult.domainUrl}
                              token={registerResult.token}
                              instructions={registerResult.instructions}
                              domainId={registerResult.domainId}
                              onVerify={() => verifyMutation.mutate(registerResult.domainId)}
                              verifyPending={verifyMutation.isPending && verifyMutation.variables === registerResult.domainId}
                              verifyError={
                                verifyMutation.isError && verifyMutation.variables === registerResult.domainId
                                  ? verifyMutation.error instanceof Error
                                    ? verifyMutation.error.message
                                    : "Verification failed."
                                  : undefined
                              }
                              verifySuccess={
                                verifyMutation.isSuccess && verifyMutation.variables === registerResult.domainId
                              }
                            />
                          </CardContent>
                        </Card>
                      ) : null}
                      {registerInfoMessage ? <InfoBanner message={registerInfoMessage} /> : null}
                      {verificationMessage ? <SuccessBanner message={verificationMessage} /> : null}
                    </CardContent>
                  </Card>

                  {/* If a domain is selected, render the Dedicated Domain Deep Dive Page */}
                  {(() => {
                    const activeDomainDetail = (domainsQuery.data ?? []).find((d) => d.id === selectedDomainId);

                    if (activeDomainDetail) {
                      return (
                        <DomainDetailView
                          domain={activeDomainDetail}
                          token={token ?? ""}
                          onBack={() => setSelectedDomainId(null)}
                          highlightCard={highlightDomainUrl === activeDomainDetail.domain_url}
                          highlightVerified={verificationMessage?.includes(activeDomainDetail.domain_url) ?? false}
                          onVerify={() => verifyMutation.mutate(activeDomainDetail.id)}
                          onScan={(scanInput) => startScanMutation.mutate(scanInput)}
                          onDelete={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${activeDomainDetail.domain_url}? All related scans and findings will be permanently deleted.`
                              )
                            ) {
                              deleteMutation.mutate(activeDomainDetail.id);
                              setSelectedDomainId(null);
                            }
                          }}
                          verifyPending={verifyMutation.isPending && verifyMutation.variables === activeDomainDetail.id}
                          scanPending={startScanMutation.isPending && startScanMutation.variables?.domainId === activeDomainDetail.id}
                          deletePending={deleteMutation.isPending && deleteMutation.variables === activeDomainDetail.id}
                          scanLimitReached={scanLimitReached}
                          currentPlan={currentUserQuery.data?.user.plan ?? "free"}
                          allScans={scansQuery.data?.items ?? []}
                        />
                      );
                    }

                    return (
                      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl">
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <CardTitle className="text-xl text-white font-bold">
                                Monitored Target Websites ({domainsQuery.data?.length ?? 0})
                              </CardTitle>
                              <CardDescription className="text-xs text-slate-400">
                                Click any domain card for deep analytics, vulnerability history, and multi-mode scan controls.
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-mono text-xs font-semibold">
                                <ShieldCheck className="size-3.5" />
                                {verifiedCount} / {domainsQuery.data?.length ?? 0} Verified Safe Harbor
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {domainsQuery.isLoading ? (
                            <div className="text-xs text-slate-400 p-8 text-center">Loading domains...</div>
                          ) : domainsQuery.data?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {domainsQuery.data.map((domain) => (
                                <DomainOverviewCard
                                  key={domain.id}
                                  domain={domain}
                                  token={token ?? ""}
                                  onOpenDeepDive={() => setSelectedDomainId(domain.id)}
                                  onQuickScan={() =>
                                    startScanMutation.mutate({
                                      domainId: domain.id,
                                      scanMode: "public",
                                    })
                                  }
                                  onDelete={() => {
                                    if (
                                      confirm(
                                        `Are you sure you want to delete ${domain.domain_url}? All related scans and findings will be permanently deleted.`
                                      )
                                    ) {
                                      deleteMutation.mutate(domain.id);
                                    }
                                  }}
                                  scanPending={
                                    startScanMutation.isPending &&
                                    startScanMutation.variables?.domainId === domain.id
                                  }
                                  deletePending={
                                    deleteMutation.isPending && deleteMutation.variables === domain.id
                                  }
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-xs text-slate-400">
                              No websites registered yet. Register your first domain above.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })()}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 3. SECURITY AUDITS & SCANS TAB                                            */}
              {/* ========================================================================= */}
              {activeTab === "scans" && (
                <div className="space-y-6 text-left">
                  <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl">
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-2xl text-white font-bold">Security Audits & Scan Stream</CardTitle>
                          <CardDescription className="text-xs text-slate-400">
                            Real-time audit history, multi-engine progress, AI Launch Scores, and PDF reports.
                          </CardDescription>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setScanFilter("all")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${scanFilter === "all" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-slate-400 hover:text-white"}`}
                          >
                            All ({scansQuery.data?.items?.length ?? 0})
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanFilter("completed")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${scanFilter === "completed" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-slate-400 hover:text-white"}`}
                          >
                            Completed
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanFilter("running")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${scanFilter === "running" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-slate-400 hover:text-white"}`}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanFilter("failed")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${scanFilter === "failed" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-slate-400 hover:text-white"}`}
                          >
                            Failed
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {queuedScanCount > 0 && (
                        <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono">
                          <span>{queuedScanCount} scans currently queued in worker pipeline.</span>
                          <Button
                            variant="outline"
                            onClick={() => clearQueuedMutation.mutate()}
                            disabled={clearQueuedMutation.isPending}
                            className="h-8 rounded-lg text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                          >
                            {clearQueuedMutation.isPending ? "Clearing..." : "Clear Queued"}
                          </Button>
                        </div>
                      )}

                      {scansQuery.isLoading ? (
                        <div className="text-xs text-slate-400">Loading audit history...</div>
                      ) : filteredScans.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredScans.map((scan) => <ScanCard key={scan.id} scan={scan} token={token} />)}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-xs text-slate-400">
                          No scans match the selected filter.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4. VULNERABILITY MATRIX TAB                                               */}
              {/* ========================================================================= */}
              {activeTab === "findings" && (
                <div className="space-y-6 text-left">
                  <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl">
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-2xl text-white font-bold">Vulnerability Matrix & AI Remediation</CardTitle>
                          <CardDescription className="text-xs text-slate-400">
                            Unified inventory of all security advisories with copyable Claude & Cursor fix prompts.
                          </CardDescription>
                        </div>

                        {/* Severity Filter */}
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setFindingSeverityFilter("all")}
                            className={`px-2.5 py-1 rounded-lg transition-all ${findingSeverityFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400"}`}
                          >
                            All ({totalOpenFindings})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFindingSeverityFilter("critical")}
                            className={`px-2.5 py-1 rounded-lg transition-all ${findingSeverityFilter === "critical" ? "bg-rose-500 text-neutral-950 font-bold" : "text-rose-400"}`}
                          >
                            Critical ({criticalFindingsCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFindingSeverityFilter("high")}
                            className={`px-2.5 py-1 rounded-lg transition-all ${findingSeverityFilter === "high" ? "bg-amber-500 text-neutral-950 font-bold" : "text-amber-400"}`}
                          >
                            High ({highFindingsCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFindingSeverityFilter("medium")}
                            className={`px-2.5 py-1 rounded-lg transition-all ${findingSeverityFilter === "medium" ? "bg-orange-500 text-neutral-950 font-bold" : "text-orange-400"}`}
                          >
                            Medium ({mediumFindingsCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFindingSeverityFilter("low")}
                            className={`px-2.5 py-1 rounded-lg transition-all ${findingSeverityFilter === "low" ? "bg-sky-500 text-neutral-950 font-bold" : "text-sky-400"}`}
                          >
                            Low ({lowFindingsCount})
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3.5">
                        <Sparkles className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Consolidated SOC repository across DAST, Nuclei CVEs, and Semgrep SAST scans. Click any audit below to inspect vulnerable endpoints, view remediation playbooks, and copy tailored AI Fix Prompts for <span className="text-emerald-300 font-semibold font-mono">Cursor</span> & <span className="text-emerald-300 font-semibold font-mono">Claude Code</span>.
                        </p>
                      </div>

                      {totalOpenFindings === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center space-y-3">
                          <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
                          <h4 className="text-base font-bold text-white">No Open Vulnerabilities Detected</h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            All your scanned websites are currently clean with zero outstanding findings. Run new audits from the Target Domains tab to keep them secure.
                          </p>
                        </div>
                      ) : filteredFindingScans.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center space-y-3">
                          <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
                          <h4 className="text-base font-bold text-white capitalize">No {findingSeverityFilter} Severity Vulnerabilities</h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Zero {findingSeverityFilter} severity findings detected in your current scan history. Switch the filter above to view other severity classes.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {filteredFindingScans.map((scan) => {
                            const summary = scan.severity_summary;
                            const domainUrl = domainMap[scan.domain_id] || "Target Website";

                            return (
                              <div
                                key={scan.id}
                                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#06080D] p-6 shadow-xl hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-300"
                              >
                                <div className="space-y-4">
                                  {/* Header: Domain & Scan Mode */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Globe className="size-4 text-emerald-400 shrink-0" />
                                      <span className="font-bold text-sm text-white truncate font-mono">
                                        {domainUrl}
                                      </span>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] font-mono border-slate-700 text-slate-400">
                                      #{scan.id.slice(0, 8)}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                    <span>{formatTimestamp(scan.created_at)}</span>
                                    <Badge
                                      variant={
                                        scan.scan_mode === "authenticated" || scan.scan_mode === "ai_app_trust"
                                          ? "success"
                                          : "secondary"
                                      }
                                      className="text-[10px]"
                                    >
                                      {scan.scan_mode === "authenticated"
                                        ? "Auth DAST"
                                        : scan.scan_mode === "ai_app_trust"
                                          ? "AI Launch Score"
                                          : "Public DAST"}
                                    </Badge>
                                  </div>

                                  {/* Severity Breakdown Bar */}
                                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                                    <span className="text-xs font-semibold text-slate-400">Detected Advisories</span>
                                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                      {summary?.critical ? (
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${findingSeverityFilter === "critical" ? "bg-rose-500 text-neutral-950 ring-2 ring-rose-400" : "bg-rose-500/20 border border-rose-500/30 text-rose-300"}`}>
                                          {summary.critical} Critical
                                        </span>
                                      ) : null}
                                      {summary?.high ? (
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${findingSeverityFilter === "high" ? "bg-amber-500 text-neutral-950 ring-2 ring-amber-400" : "bg-amber-500/20 border border-amber-500/30 text-amber-300"}`}>
                                          {summary.high} High
                                        </span>
                                      ) : null}
                                      {summary?.medium ? (
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${findingSeverityFilter === "medium" ? "bg-orange-500 text-neutral-950 ring-2 ring-orange-400" : "bg-orange-500/20 border border-orange-500/30 text-orange-300"}`}>
                                          {summary.medium} Medium
                                        </span>
                                      ) : null}
                                      {summary?.low ? (
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${findingSeverityFilter === "low" ? "bg-sky-500 text-neutral-950 ring-2 ring-sky-400" : "bg-sky-500/20 border border-sky-500/30 text-sky-300"}`}>
                                          {summary.low} Low
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-5 pt-4 border-t border-slate-800/80">
                                  <Button
                                    asChild
                                    className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/30 transition-all"
                                  >
                                    <Link href={`/dashboard/scan/${scan.id}#findings`}>
                                      Inspect Findings & AI Fix Prompts
                                      <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 5. AUTOMATION HUB TAB                                                     */}
              {/* ========================================================================= */}
              {activeTab === "automation" && (
                <div className="space-y-6 text-left">
                  <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20 shrink-0">
                        <Sliders className="size-7 text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-xl font-bold text-white">Automation Hub & CI/CD Security Gate</h3>
                          <Badge variant="success">Version 2 Active</Badge>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                          Configure machine-readable AI IDE issue sync, set PR merge thresholds, attach GitHub App repositories, and dispatch alerts to Slack & Discord webhooks.
                        </p>
                      </div>
                    </div>
                    <Button asChild className="h-12 px-8 rounded-xl font-mono uppercase tracking-[0.16em] bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                      <Link href="/workspace/automation">
                        Launch Automation Hub
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 6. GITHUB CODE SCANS TAB                                                  */}
              {/* ========================================================================= */}
              {activeTab === "github" && githubIntegrationVisible && (
                <GitHubFoundationPanel
                  status={githubStatusQuery.data}
                  repositories={githubRepositoriesQuery.data ?? []}
                  loading={githubStatusQuery.isLoading}
                  connectPending={connectGitHubMutation.isPending}
                  selectPending={selectGitHubRepositoryMutation.isPending}
                  disconnectPending={disconnectGitHubMutation.isPending}
                  connectError={connectGitHubMutation.error instanceof Error ? connectGitHubMutation.error.message : null}
                  selectError={selectGitHubRepositoryMutation.error instanceof Error ? selectGitHubRepositoryMutation.error.message : null}
                  disconnectError={disconnectGitHubMutation.error instanceof Error ? disconnectGitHubMutation.error.message : null}
                  latestScan={latestGitHubRepositoryScanQuery.data ?? null}
                  scanPending={runGitHubRepositoryScanMutation.isPending}
                  scanError={runGitHubRepositoryScanMutation.error instanceof Error ? runGitHubRepositoryScanMutation.error.message : null}
                  onConnect={(input) => connectGitHubMutation.mutate(input)}
                  onSelect={(repositoryFullName) => selectGitHubRepositoryMutation.mutate(repositoryFullName)}
                  onDisconnect={() => disconnectGitHubMutation.mutate()}
                  onRunSnapshotScan={(input) => runGitHubRepositoryScanMutation.mutate(input)}
                />
              )}

              {/* ========================================================================= */}
              {/* 7. AGENCY BRANDING TAB                                                    */}
              {/* ========================================================================= */}
              {activeTab === "agency" && (
                <AgencySettingsPanel
                  user={currentUserQuery.data}
                  onSave={(input) => updateBrandingMutation.mutate(input)}
                  saving={updateBrandingMutation.isPending}
                  error={updateBrandingMutation.error instanceof Error ? updateBrandingMutation.error.message : null}
                />
              )}

              {/* ========================================================================= */}
              {/* 8. BILLING & PLANS TAB                                                    */}
              {/* ========================================================================= */}
              {activeTab === "billing" && (
                <PlanOverview
                  data={currentUserQuery.data}
                  billing={billingStatusQuery.data}
                  loading={currentUserQuery.isLoading}
                  checkoutPending={checkoutMutation.isPending}
                  portalPending={portalMutation.isPending}
                  checkoutError={checkoutMutation.error instanceof Error ? checkoutMutation.error.message : null}
                  portalError={portalMutation.error instanceof Error ? portalMutation.error.message : null}
                  onCheckout={(plan) => checkoutMutation.mutate(plan)}
                  onPortal={() => portalMutation.mutate()}
                />
              )}
            </>
          )}

      </main>

      {/* ========================================================================= */}
      {/* AESTHETIC WORKSPACE FOOTER (LOGO-FREE & EMOJI-FREE)                       */}
      {/* ========================================================================= */}
      <footer className="border-t border-emerald-500/20 bg-gradient-to-b from-[#070A12] to-[#04060C] py-6 px-4 sm:px-8 mt-auto text-xs text-slate-400">
        <div className="max-w-[1850px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left Brand Textmark & Live Status */}
          <div className="flex items-center gap-3.5">
            <span className="font-mono font-extrabold text-xs tracking-widest text-white uppercase">
              HACK MY WEBSITE
            </span>
            <div className="h-3 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM STATUS: 100% OPERATIONAL</span>
            </div>
          </div>

          {/* Right Navigation Links */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Landing Page</Link>
            <Link href="/how-it-works" className="text-slate-400 hover:text-emerald-400 transition-colors">How It Works</Link>
            <Link href="/sample-report" className="text-slate-400 hover:text-emerald-400 transition-colors">Sample Report</Link>
            <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

async function openRazorpayCheckout({
  result,
  token,
  onVerified,
}: {
  result: Awaited<ReturnType<typeof createBillingCheckout>>;
  token: string;
  onVerified: () => void;
}) {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay Checkout could not be loaded.");
  }

  return new Promise<void>((resolve, reject) => {
    const RazorpayCheckout = window.Razorpay;
    if (!RazorpayCheckout) {
      reject(new Error("Razorpay Checkout could not be loaded."));
      return;
    }

    const checkout = new RazorpayCheckout({
      key: result.razorpay_key_id ?? "",
      amount: result.amount ?? 0,
      currency: result.currency ?? "INR",
      name: result.name ?? "Hack My Website",
      description: result.description ?? "Hack My Website plan",
      order_id: result.razorpay_order_id ?? "",
      prefill: result.prefill ?? undefined,
      theme: { color: "#00ff88" },
      handler: async (response) => {
        try {
          await verifyRazorpayPayment({
            token,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          onVerified();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          recordBillingAbandoned({
            plan: result.plan ?? "starter",
            razorpayOrderId: result.razorpay_order_id ?? undefined,
            token,
          }).catch(() => {});
          reject(new Error("Razorpay checkout was closed before payment completed."));
        },
      },
    });
    checkout.open();
  });
}

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

function LoadingWorkspace() {
  return (
    <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] mx-auto mt-24 w-full max-w-2xl rounded-[2rem] border-primary/15 bg-black/60">
      <CardContent className="flex items-center gap-3 p-8 text-zinc-300">
        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
        Checking workspace access...
      </CardContent>
    </Card>
  );
}

function WorkspaceAccessError({ message }: { message: string }) {
  const queryClient = useQueryClient();
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [resendError, setResendError] = useState<string | null>(null);
  const [refreshStatus, setRefreshStatus] = useState<"idle" | "refreshing" | "success" | "error">("idle");

  const handleResendEmail = async () => {
    setResendStatus("sending");
    setResendError(null);
    try {
      const user = firebaseAuth?.currentUser;
      if (!user) {
        throw new Error("No signed-in user session found. Please sign in again.");
      }
      const { sendEmailVerification } = await import("firebase/auth");
      await sendEmailVerification(user);
      setResendStatus("success");
    } catch (err) {
      console.error("Resending verification email failed", err);
      setResendStatus("error");
      setResendError(err instanceof Error ? err.message : "Failed to resend verification email.");
    }
  };

  const handleCheckVerification = async () => {
    setRefreshStatus("refreshing");
    setResendError(null);
    try {
      const user = firebaseAuth?.currentUser;
      if (!user) {
        throw new Error("No active session found. Please sign in again.");
      }
      await user.reload();
      // Force refresh the ID token so the claims (email_verified) are updated
      await user.getIdToken(true);
      
      // Invalidate queries so React Query fetches the profile using the updated token
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setRefreshStatus("success");
    } catch (err) {
      console.error("Refreshing verification status failed", err);
      setRefreshStatus("error");
      setResendError(err instanceof Error ? err.message : "Failed to refresh verification status.");
    }
  };

  const isEmailVerificationError = message.toLowerCase().includes("verify your email");

  return (
    <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] mx-auto mt-20 w-full max-w-3xl rounded-[2rem] border-red-500/25 bg-black/70">
      <CardHeader>
        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-red-200">
          <ShieldAlert className="h-3.5 w-3.5" />
          {isEmailVerificationError ? "Email Verification Required" : "Access check failed"}
        </div>
        <CardTitle className="text-3xl text-white">
          {isEmailVerificationError ? "Verify your email address to proceed" : "We could not verify workspace access."}
        </CardTitle>
        <CardDescription className="text-base leading-7 text-zinc-300 font-sans">
          {isEmailVerificationError ? (
            <>
              A verification link was sent to your registered email address during sign-up. 
              Please click the link in that email to verify your account and unlock your workspace.
              <br />
              <strong className="text-amber-300">Important:</strong> If you do not see it in your inbox, please check your **Spam or Junk folder**.
            </>
          ) : (
            message
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isEmailVerificationError && (
          <div className="flex flex-col gap-3">
            {resendStatus === "success" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100 font-sans">
                Verification email resent successfully! Check your inbox and spam folder.
              </div>
            )}
            {resendStatus === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 font-sans">
                {resendError}
              </div>
            )}
            {refreshStatus === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 font-sans">
                {resendError}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {isEmailVerificationError && (
            <>
              <Button
                onClick={handleCheckVerification}
                disabled={refreshStatus === "refreshing"}
                className="h-12 rounded-xl font-mono uppercase tracking-[0.16em]"
              >
                {refreshStatus === "refreshing" ? "Refreshing..." : "I have verified my email"}
              </Button>
              <Button 
                onClick={handleResendEmail} 
                disabled={resendStatus === "sending"}
                variant="outline"
                className="h-12 rounded-xl font-mono uppercase tracking-[0.16em]"
              >
                {resendStatus === "sending" ? "Resending..." : "Resend Email"}
              </Button>
            </>
          )}
          <Button asChild variant="outline" className="h-12 rounded-xl font-mono uppercase tracking-[0.16em] text-zinc-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const aiBuiltWithOptions = ["Cursor", "Lovable", "Bolt", "Replit", "Claude Code", "v0", "Other"];
const aiAppTypeOptions = ["SaaS", "Dashboard", "Marketplace", "AI tool", "Landing page", "Internal tool", "Other"];
const aiStackOptions = [
  "Supabase",
  "Firebase",
  "Clerk",
  "Auth0",
  "Stripe",
  "Razorpay",
  "OpenAI",
  "Gemini",
  "Anthropic",
  "Vercel",
  "Netlify",
  "Render",
  "Railway",
  "Hostinger VPS",
  "Other",
];

function InviteOnlyGate({ email, message }: { email: string; message?: string | null }) {
  return (
    <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] mx-auto mt-20 w-full max-w-3xl rounded-[2rem] border-amber-400/25 bg-black/70">
      <CardHeader>
        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">
          <ShieldAlert className="h-3.5 w-3.5" />
          Invite-only beta
        </div>
        <CardTitle className="text-3xl text-white">This account is authenticated, but not approved yet.</CardTitle>
        <CardDescription className="text-base leading-7 text-zinc-300">
          {message ??
            "Workspace access is currently invite-only. Join the waitlist and we will email you when beta access opens."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-zinc-300">
          Signed in as <span className="font-semibold text-white">{email}</span>. This protects the scanner from
          becoming an open abuse surface while the product is in paid beta.
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-xl font-mono uppercase tracking-[0.16em]">
            <Link href="/#waitlist">
              Join waitlist
              <ArrowRight data-icon="inline-end" className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-xl font-mono uppercase tracking-[0.16em]">
            <Link href="/">
              Back to landing
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DomainOverviewCard({
  domain,
  token,
  onOpenDeepDive,
  onQuickScan,
  onDelete,
  scanPending,
  deletePending,
}: {
  domain: DomainResponse;
  token: string;
  onOpenDeepDive: () => void;
  onQuickScan: () => void;
  onDelete: () => void;
  scanPending: boolean;
  deletePending: boolean;
}) {
  const historyQuery = useQuery({
    queryKey: ["domain-history", domain.id, token],
    enabled: Boolean(token && domain.verified),
    queryFn: () => getDomainHistory({ domainId: domain.id, token }),
  });
  const monitorQuery = useQuery({
    queryKey: ["trust-monitor", domain.id, token],
    enabled: Boolean(token && domain.verified),
    queryFn: () => getTrustMonitor({ domainId: domain.id, token }),
  });

  const latest = historyQuery.data?.latest_summary;
  const latestScore = latest
    ? ((latest as any).unified_security_score ?? (latest.trust_score ?? (100 - latest.risk_score)))
    : null;
  const previousScore = latest && latest.previous_risk_score != null ? 100 - latest.previous_risk_score : null;
  const scoreDelta = previousScore != null && latestScore != null ? latestScore - previousScore : null;
  const monitorEnabled = Boolean(monitorQuery.data?.enabled);

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 shadow-xl hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-300">
      <div className="space-y-5">
        {/* Header: Favicon/Globe + URL + Safe Harbor badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Globe className="size-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                {domain.domain_url}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Added {formatDate(domain.created_at)}
              </p>
            </div>
          </div>

          <Badge
            variant={domain.verified ? "success" : "medium"}
            className="text-[10px] font-mono shrink-0"
          >
            {domain.verified ? "Safe Harbor" : "Unverified"}
          </Badge>
        </div>

        {/* Security Score Meter & Health Verdict */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Launch Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-black font-mono ${
                  latestScore != null
                    ? latestScore >= 80
                      ? "text-emerald-400"
                      : latestScore >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {latestScore != null ? `${latestScore}/100` : "Not Scanned"}
              </span>
              {scoreDelta != null && (
                <span
                  className={`text-xs font-mono font-bold ${
                    scoreDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              AI Monitor
            </span>
            <span
              className={`inline-flex items-center gap-1 mt-1 text-xs font-mono font-bold ${
                monitorEnabled ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {monitorEnabled ? "Weekly Active" : "Manual Only"}
            </span>
          </div>
        </div>

        {/* Stats Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1">
            <Activity className="size-3 text-slate-400" />
            <span>{historyQuery.data?.items?.length ?? 0} Audits</span>
          </span>
          {latest && (
            <>
              {latest.open_findings > 0 ? (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1">
                  <ShieldAlert className="size-3 text-amber-400" />
                  <span>{latest.open_findings} Open Findings</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  <span>0 Open Risks</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
        <Button
          type="button"
          onClick={onOpenDeepDive}
          className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
        >
          <span>Manage & Deep Dive</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={onQuickScan}
            disabled={!domain.verified || scanPending}
            variant="outline"
            className="flex-1 h-9 rounded-xl border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-semibold"
          >
            {scanPending ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin mr-1.5" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="size-3.5 mr-1.5" />
                Quick Scan
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={onDelete}
            disabled={deletePending}
            variant="outline"
            className="h-9 px-3 rounded-xl border-rose-500/20 bg-rose-950/20 hover:bg-rose-500 hover:text-neutral-950 text-rose-400 font-mono text-xs font-semibold transition-all"
            title="Delete target domain"
          >
            {deletePending ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DomainDetailView({
  domain,
  token,
  onBack,
  highlightCard,
  highlightVerified,
  onVerify,
  onScan,
  onDelete,
  verifyPending,
  scanPending,
  deletePending = false,
  scanLimitReached,
  currentPlan,
  allScans,
}: {
  domain: DomainResponse;
  token: string;
  onBack: () => void;
  highlightCard: boolean;
  highlightVerified: boolean;
  onVerify: () => void;
  onScan: (input: {
    domainId: string;
    scanMode: ScanMode;
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
  }) => void;
  onDelete: () => void;
  verifyPending: boolean;
  scanPending: boolean;
  deletePending?: boolean;
  scanLimitReached: boolean;
  currentPlan: UserPlan;
  allScans: ScanListItem[];
}) {
  type AuthMethod = "bearer_token" | "session_cookie" | "api_key_header" | "email_password" | "login_assist";
  type ManualAuthMethod = "bearer_token" | "session_cookie" | "api_key_header";

  const [scanMode, setScanMode] = useState<ScanMode>("public");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("bearer_token");
  const [aiBuiltWith, setAiBuiltWith] = useState("Cursor");
  const [aiAppType, setAiAppType] = useState("SaaS");
  const [aiHasLogin, setAiHasLogin] = useState(true);
  const [aiAcceptsPayments, setAiAcceptsPayments] = useState(false);
  const [aiStoresUserData, setAiStoresUserData] = useState(true);
  const [aiStack, setAiStack] = useState<string[]>(["Firebase"]);
  const [seededRoutesInput, setSeededRoutesInput] = useState("/dashboard\n/settings\n/api/profile");
  const [bearerToken, setBearerToken] = useState("");
  const [sessionCookieValue, setSessionCookieValue] = useState("");
  const [apiKeyHeaderName, setApiKeyHeaderName] = useState("X-API-Key");
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [loginUrl, setLoginUrl] = useState(`${domain.domain_url.replace(/\/+$/, "")}/login`);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccessHint, setLoginSuccessHint] = useState("/dashboard");
  const [loginUsernameSelector, setLoginUsernameSelector] = useState("");
  const [loginPasswordSelector, setLoginPasswordSelector] = useState("");
  const [loginSubmitSelector, setLoginSubmitSelector] = useState("");
  const [assistHeaderName, setAssistHeaderName] = useState("Authorization");
  const [assistHeaderValue, setAssistHeaderValue] = useState("");
  const [assistCookieName, setAssistCookieName] = useState("session");
  const [assistCookieValue, setAssistCookieValue] = useState("");
  const [enableRoleComparison, setEnableRoleComparison] = useState(false);
  const [secondaryRoleLabel, setSecondaryRoleLabel] = useState("Admin role");
  const [secondaryAuthMethod, setSecondaryAuthMethod] = useState<ManualAuthMethod>("session_cookie");
  const [secondaryBearerToken, setSecondaryBearerToken] = useState("");
  const [secondarySessionCookieName, setSecondarySessionCookieName] = useState("session");
  const [secondarySessionCookieValue, setSecondarySessionCookieValue] = useState("");
  const [secondaryApiKeyHeaderName, setSecondaryApiKeyHeaderName] = useState("X-API-Key");
  const [secondaryApiKeyValue, setSecondaryApiKeyValue] = useState("");

  const aiAppContext: AIAppContext = {
    built_with: aiBuiltWith,
    app_type: aiAppType,
    has_login: aiHasLogin,
    accepts_payments: aiAcceptsPayments,
    stores_user_data: aiStoresUserData,
    stack: aiStack,
  };

  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ["domain-history", domain.id, token],
    enabled: Boolean(token && domain.verified),
    queryFn: () => getDomainHistory({ domainId: domain.id, token }),
  });
  const monitorQuery = useQuery({
    queryKey: ["trust-monitor", domain.id, token],
    enabled: Boolean(token && domain.verified),
    queryFn: () => getTrustMonitor({ domainId: domain.id, token }),
  });
  const monitorMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      updateTrustMonitor({
        domainId: domain.id,
        token,
        enabled,
        aiAppContext: enabled ? aiAppContext : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trust-monitor", domain.id, token] });
      queryClient.invalidateQueries({ queryKey: ["domain-history", domain.id, token] });
    },
  });

  const domainScans = useMemo(() => {
    return allScans.filter((s) => s.domain_id === domain.id);
  }, [allScans, domain.id]);

  const loginAssistHeaders = buildLoginAssistHeaders(assistHeaderName, assistHeaderValue);
  const loginAssistCookies = buildNamedCookieMap(assistCookieName, assistCookieValue);
  const primaryHeaders =
    authMethod === "login_assist"
      ? loginAssistHeaders
      : buildAuthHeaders(authMethod, {
          bearerToken,
          apiKeyHeaderName,
          apiKeyValue,
        });
  const primaryCookies =
    authMethod === "login_assist"
      ? loginAssistCookies
      : buildAuthCookies(authMethod, {
          sessionCookieName: "session",
          sessionCookieValue,
        });
  const secondaryHeaders = buildSecondaryAuthHeaders(secondaryAuthMethod, {
    secondaryBearerToken,
    secondaryApiKeyHeaderName,
    secondaryApiKeyValue,
  });
  const secondaryCookies = buildSecondaryAuthCookies(secondaryAuthMethod, {
    secondarySessionCookieName,
    secondarySessionCookieValue,
  });
  const authenticatedInputsReady =
    scanMode !== "authenticated" ||
    (authMethod === "bearer_token" && Boolean(bearerToken.trim())) ||
    (authMethod === "session_cookie" && Boolean(sessionCookieValue.trim())) ||
    (authMethod === "api_key_header" && Boolean(apiKeyHeaderName.trim() && apiKeyValue.trim())) ||
    (authMethod === "email_password" &&
      Boolean(loginUrl.trim() && loginUsername.trim() && loginPassword.trim())) ||
    (authMethod === "login_assist" &&
      (Boolean(Object.keys(loginAssistHeaders ?? {}).length) ||
        Boolean(Object.keys(loginAssistCookies ?? {}).length)));
  const secondaryInputsReady =
    !enableRoleComparison ||
    (Boolean(secondaryRoleLabel.trim()) &&
      (Boolean(Object.keys(secondaryHeaders ?? {}).length) ||
        Boolean(Object.keys(secondaryCookies ?? {}).length)));

  return (
    <div className="space-y-8 text-left animate-in fade-in-50 duration-300">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all w-fit shadow-md"
        >
          <ArrowLeft className="size-4 text-emerald-400" />
          <span>Back to All Target Domains</span>
        </button>

        <div className="flex items-center gap-3">
          <Badge variant={domain.verified ? "success" : "high"} className="font-mono text-xs px-3 py-1">
            {domain.verified ? "Verified Safe Harbor" : "Pending Verification"}
          </Badge>

          <Button
            type="button"
            onClick={onDelete}
            disabled={deletePending}
            variant="outline"
            className="h-9 px-3.5 rounded-xl border-rose-500/30 bg-rose-950/20 hover:bg-rose-500 hover:text-neutral-950 text-rose-400 font-mono text-xs font-bold transition-all"
          >
            {deletePending ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin mr-1.5" />
                Deleting
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 mr-1.5" />
                Delete Domain
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hero Domain Overview Box */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0B0F19] via-slate-900 to-[#070A12] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Globe className="size-6 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white truncate font-mono tracking-tight">
                {domain.domain_url}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Domain UUID: #{domain.id} • Registered {formatTimestamp(domain.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!domain.verified ? (
            <Button
              onClick={onVerify}
              disabled={verifyPending}
              className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              {verifyPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                  Verifying DNS...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4 mr-2" />
                  Verify Ownership Now
                </>
              )}
            </Button>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <span>Approved For Penetration Scans</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Instructions if unverified */}
      {!domain.verified && domain.verification_token ? (
        <Card className="rounded-3xl border border-amber-500/30 bg-[#0B0F19] p-6 shadow-2xl space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-400" />
              Safe Harbor Verification Required
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Add the DNS TXT record or upload the verification token file to your server root to authorize automated penetration scans.
            </CardDescription>
          </CardHeader>
          <VerificationGuide domainUrl={domain.domain_url} token={domain.verification_token} compact />
        </Card>
      ) : null}

      {/* ========================================================================= */}
      {/* 1. PENETRATION SCANNER STATION                                            */}
      {/* ========================================================================= */}
      {domain.verified ? (
        <Card className="rounded-3xl border border-emerald-500/30 bg-[#0B0F19] shadow-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-white font-bold flex items-center gap-2.5">
                  <Zap className="size-5 text-emerald-400" />
                  <span>Launch Security Penetration Scan</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Select your scan engine configuration and initiate real-time dynamic vulnerability checks.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scan Mode 3-Card Cyber Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setScanMode("public")}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  scanMode === "public"
                    ? "bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-white">Public DAST</span>
                  {scanMode === "public" && <span className="size-2 rounded-full bg-emerald-400 animate-ping" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Fast external perimeter attack surface check. Scans DNS, TLS/SSL, exposed endpoints, and OWASP Top 10 vulnerabilities.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScanMode("ai_app_trust")}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  scanMode === "ai_app_trust"
                    ? "bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-white">AI Launch Score</span>
                  {scanMode === "ai_app_trust" && <span className="size-2 rounded-full bg-emerald-400 animate-ping" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Contextual audit tailored for AI-generated code (Cursor, Bolt, Lovable, Replit, v0). Weights launch-readiness risks.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScanMode("authenticated")}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  scanMode === "authenticated"
                    ? "bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-white">Authenticated DAST</span>
                  {scanMode === "authenticated" && <span className="size-2 rounded-full bg-emerald-400 animate-ping" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Deep authenticated scan behind login. Tests internal routes with session cookies, Bearer tokens, or multi-role checks.
                </p>
              </button>
            </div>

            {/* AI Launch Context Drawer */}
            {scanMode === "ai_app_trust" && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                    AI Application Context Parameters
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Built With</label>
                    <select
                      value={aiBuiltWith}
                      onChange={(e) => setAiBuiltWith(e.target.value)}
                      className="w-full h-11 rounded-xl bg-[#0B0F19] border border-slate-800 px-4 text-xs text-white font-mono"
                    >
                      {aiBuiltWithOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">App Category</label>
                    <select
                      value={aiAppType}
                      onChange={(e) => setAiAppType(e.target.value)}
                      className="w-full h-11 rounded-xl bg-[#0B0F19] border border-slate-800 px-4 text-xs text-white font-mono"
                    >
                      {aiAppTypeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <AIContextToggle label="Has User Login" checked={aiHasLogin} onChange={setAiHasLogin} />
                  <AIContextToggle label="Accepts Payments" checked={aiAcceptsPayments} onChange={setAiAcceptsPayments} />
                  <AIContextToggle label="Stores User Data" checked={aiStoresUserData} onChange={setAiStoresUserData} />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Tech Stack</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {aiStackOptions.map((option) => {
                      const selected = aiStack.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setAiStack((current) =>
                              selected ? current.filter((item) => item !== option) : [...current, option].slice(0, 12)
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                            selected
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Authenticated Configuration Drawer */}
            {scanMode === "authenticated" && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-amber-400" />
                  <span className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                    Authenticated Session Parameters
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Authentication Type</label>
                    <select
                      value={authMethod}
                      onChange={(e) => setAuthMethod(e.target.value as AuthMethod)}
                      className="w-full h-11 rounded-xl bg-[#0B0F19] border border-slate-800 px-4 text-xs text-white font-mono"
                    >
                      <option value="bearer_token">Bearer Token (JWT)</option>
                      <option value="session_cookie">Session Cookie</option>
                      <option value="api_key_header">Custom API Key Header</option>
                      <option value="email_password">Automated Browser Login (Puppeteer)</option>
                      <option value="login_assist">Login Assist (Live Session Token)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Seeded Internal Routes</label>
                    <textarea
                      value={seededRoutesInput}
                      onChange={(e) => setSeededRoutesInput(e.target.value)}
                      className="w-full min-h-[90px] rounded-xl bg-[#0B0F19] border border-slate-800 p-3 text-xs text-white font-mono"
                      placeholder="/dashboard&#10;/settings&#10;/api/profile"
                    />
                  </div>
                </div>

                {authMethod === "bearer_token" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Bearer JWT Token</label>
                    <Input
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      placeholder="eyJhbGciOi..."
                      className="h-11 rounded-xl bg-[#0B0F19] border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                )}

                {authMethod === "session_cookie" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Session Cookie Value</label>
                    <Input
                      value={sessionCookieValue}
                      onChange={(e) => setSessionCookieValue(e.target.value)}
                      placeholder="session=abc123xyz..."
                      className="h-11 rounded-xl bg-[#0B0F19] border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                )}

                {authMethod === "api_key_header" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Header Name</label>
                      <Input
                        value={apiKeyHeaderName}
                        onChange={(e) => setApiKeyHeaderName(e.target.value)}
                        placeholder="X-API-Key"
                        className="h-11 rounded-xl bg-[#0B0F19] border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">API Key Value</label>
                      <Input
                        value={apiKeyValue}
                        onChange={(e) => setApiKeyValue(e.target.value)}
                        placeholder="your-secret-api-key"
                        className="h-11 rounded-xl bg-[#0B0F19] border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Launch Action Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={() =>
                  onScan({
                    domainId: domain.id,
                    scanMode,
                    aiAppContext: scanMode === "ai_app_trust" ? aiAppContext : null,
                    authMethod: scanMode === "authenticated" ? authMethod : null,
                    seededRoutes:
                      scanMode === "authenticated"
                        ? seededRoutesInput
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        : [],
                    authHeaders: scanMode === "authenticated" ? primaryHeaders : undefined,
                    authCookies: scanMode === "authenticated" ? primaryCookies : undefined,
                    authLoginUrl: scanMode === "authenticated" && authMethod === "email_password" ? loginUrl : null,
                    authUsername: scanMode === "authenticated" && authMethod === "email_password" ? loginUsername : null,
                    authPassword: scanMode === "authenticated" && authMethod === "email_password" ? loginPassword : null,
                    authSuccessUrlContains:
                      scanMode === "authenticated" && authMethod === "email_password" ? loginSuccessHint : null,
                    authUsernameSelector:
                      scanMode === "authenticated" && authMethod === "email_password" ? loginUsernameSelector : null,
                    authPasswordSelector:
                      scanMode === "authenticated" && authMethod === "email_password" ? loginPasswordSelector : null,
                    authSubmitSelector:
                      scanMode === "authenticated" && authMethod === "email_password" ? loginSubmitSelector : null,
                    secondaryRoleLabel:
                      scanMode === "authenticated" && enableRoleComparison && secondaryInputsReady
                        ? secondaryRoleLabel
                        : null,
                    secondaryAuthHeaders:
                      scanMode === "authenticated" && enableRoleComparison && secondaryInputsReady ? secondaryHeaders : undefined,
                    secondaryAuthCookies:
                      scanMode === "authenticated" && enableRoleComparison && secondaryInputsReady ? secondaryCookies : undefined,
                  })
                }
                disabled={
                  !domain.verified ||
                  scanPending ||
                  scanLimitReached ||
                  !authenticatedInputsReady ||
                  !secondaryInputsReady
                }
                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black font-mono text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3"
              >
                {scanPending ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    <span>Initiating Penetration Audit...</span>
                  </>
                ) : (
                  <>
                    <Zap className="size-5 fill-neutral-950" />
                    <span>Launch Security Penetration Scan ➔</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* ========================================================================= */}
      {/* 2. AUTOMATED TRUST MONITORING PANEL                                       */}
      {/* ========================================================================= */}
      {domain.verified && (
        <TrustMonitoringPanel
          monitor={monitorQuery.data}
          loading={monitorQuery.isLoading}
          error={monitorQuery.error instanceof Error ? monitorQuery.error.message : undefined}
          mutationError={monitorMutation.error instanceof Error ? monitorMutation.error.message : undefined}
          pending={monitorMutation.isPending}
          eligible={isRecurringMonitoringPlan(currentPlan)}
          plan={currentPlan}
          aiAppContext={aiAppContext}
          onToggle={(enabled) => monitorMutation.mutate(enabled)}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. SECURITY SCORE TREND CHART & HISTORY                                   */}
      {/* ========================================================================= */}
      {domain.verified && (
        <DomainHistoryPanel history={historyQuery.data} loading={historyQuery.isLoading} />
      )}

      {/* ========================================================================= */}
      {/* 4. COMPLETED AUDITS FOR THIS DOMAIN                                       */}
      {/* ========================================================================= */}
      {domainScans.length > 0 && (
        <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white font-bold">
                  Audit History for {domain.domain_url} ({domainScans.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Past penetration scan reports and deliverables for this target domain.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {domainScans.map((scan) => (
                <ScanCard key={scan.id} scan={scan} token={token} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TrustMonitoringPanel({
  monitor,
  loading,
  error,
  mutationError,
  pending,
  eligible,
  plan,
  aiAppContext,
  onToggle,
}: {
  monitor: TrustMonitorResponse | null | undefined;
  loading: boolean;
  error?: string;
  mutationError?: string;
  pending: boolean;
  eligible: boolean;
  plan: UserPlan;
  aiAppContext: AIAppContext;
  onToggle: (enabled: boolean) => void;
}) {
  const enabled = Boolean(monitor?.enabled);
  const nextRunLabel = monitor?.next_run_at ? formatTimestamp(monitor.next_run_at) : "Not scheduled";
  const lastRunLabel = monitor?.last_run_at ? formatTimestamp(monitor.last_run_at) : "No recurring run yet";

  return (
    <Card className="rounded-3xl border border-emerald-500/30 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-emerald-400" />
            <span className="font-bold text-base text-white font-mono uppercase tracking-wider">
              Automated AI Launch Monitoring
            </span>
            <Badge variant={enabled ? "success" : "secondary"}>
              {enabled ? "Weekly Active" : "Manual Only"}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Continuous weekly audits keep this website secure after every new commit and AI deployment.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => onToggle(!enabled)}
          disabled={pending || loading || (!eligible && !enabled)}
          className={`h-11 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
            enabled
              ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/20"
          }`}
        >
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin mr-2" />
              Updating...
            </>
          ) : enabled ? (
            "Pause Weekly Monitor"
          ) : (
            "Enable Weekly Monitor"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Plan Access</span>
          <span className="text-base font-bold text-white font-mono block">{eligible ? "Included" : "Upgrade Required"}</span>
          <span className="text-[11px] text-slate-400 font-mono block">{eligible ? `${displayPlanName(plan)} plan active` : "Pro or Agency needed"}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Next Scheduled Run</span>
          <span className="text-base font-bold text-emerald-400 font-mono block">{enabled ? "Every 7 Days" : "Off"}</span>
          <span className="text-[11px] text-slate-400 font-mono block">{nextRunLabel}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Last Audit Status</span>
          <span className="text-base font-bold text-white font-mono block">{monitor?.last_scan_id ? "Completed" : "Waiting"}</span>
          <span className="text-[11px] text-slate-400 font-mono block">{lastRunLabel}</span>
        </div>
      </div>
    </Card>
  );
}

function DomainHistoryPanel({
  history,
  loading,
}: {
  history: DomainHistoryResponse | null | undefined;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-8 text-center text-xs text-slate-400">
        Loading domain trend analytics...
      </Card>
    );
  }

  if (!history?.items.length) {
    return (
      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-8 text-center text-xs text-slate-400">
        Run your first security scan above to establish a baseline score trend.
      </Card>
    );
  }

  const getSecurityScore = (item: any) =>
    item.unified_security_score ?? (item.trust_score ?? (100 - item.risk_score));

  const latest = history.latest_summary;
  const riskTrend = [...history.items].slice(0, 6).reverse();
  const latestScore = latest ? getSecurityScore(latest) : 0;
  const previousScore = latest && latest.previous_risk_score != null ? 100 - latest.previous_risk_score : null;
  const scoreDelta = previousScore != null ? latestScore - previousScore : null;

  return (
    <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-white font-bold flex items-center gap-2.5">
            <Activity className="size-5 text-emerald-400" />
            <span>Launch Security Score Trend</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Historical security score progression across completed audits for this verified domain.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {history.items.length} Completed Scans
        </Badge>
      </div>

      {latest && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Current Score</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">{latestScore}/100</span>
            <span className="text-[11px] text-slate-400 font-mono block">{previousScore != null ? `Prev: ${previousScore}/100` : "Initial Audit"}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Score Change</span>
            <span className={`text-2xl font-black font-mono block ${scoreDelta == null || scoreDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {scoreDelta == null ? "Baseline" : scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
            </span>
            <span className="text-[11px] text-slate-400 font-mono block">{latest.improvement_points > 0 ? "Risk Reduced" : "Steady"}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Fixed Findings</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">{latest.fixed_findings}</span>
            <span className="text-[11px] text-slate-400 font-mono block">Remediated issues</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">New Findings</span>
            <span className="text-2xl font-black text-amber-400 font-mono block">{latest.new_findings}</span>
            <span className="text-[11px] text-slate-400 font-mono block">Newly discovered</span>
          </div>
        </div>
      )}

      {/* Visual Bar Trend Graph */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Score Progression Timeline
        </span>
        <div className="flex items-end gap-3 sm:gap-6 pt-4 h-36 border-b border-slate-800 pb-2">
          {riskTrend.map((item) => {
            const score = getSecurityScore(item);
            const isHigh = score >= 80;
            const isMed = score >= 50;

            return (
              <div key={item.scan_id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-xs font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {score}
                </span>
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    isHigh
                      ? "bg-emerald-500 group-hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                      : isMed
                        ? "bg-amber-500 group-hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                        : "bg-rose-500 group-hover:bg-rose-400 shadow-lg shadow-rose-500/20"
                  }`}
                  style={{ height: `${Math.max(score, 12)}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[60px]">
                  {shortDate(item.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function HistoryStat({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "primary" | "success" | "warning" | "neutral";
}) {
  const toneClasses = {
    primary: "border-primary/20 bg-primary/8",
    success: "border-emerald-500/20 bg-emerald-500/10",
    warning: "border-amber-500/20 bg-amber-500/10",
    neutral: "border-slate-800 bg-slate-950",
  } as const;

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-400">{note}</div>
    </div>
  );
}

function MiniTimelineStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}

function SeverityTrendBar({ counts }: { counts: Record<string, number> }) {
  const critical = counts.critical ?? 0;
  const high = counts.high ?? 0;
  const medium = counts.medium ?? 0;
  const low = counts.low ?? 0;
  const total = Math.max(critical + high + medium + low, 1);

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full border border-white/10 bg-black/40">
        <div className="bg-red-500/80" style={{ width: `${(critical / total) * 100}%` }} />
        <div className="bg-orange-500/80" style={{ width: `${(high / total) * 100}%` }} />
        <div className="bg-amber-400/80" style={{ width: `${(medium / total) * 100}%` }} />
        <div className="bg-primary/80" style={{ width: `${(low / total) * 100}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-zinc-500">
        <span>C {critical}</span>
        <span>H {high}</span>
        <span>M {medium}</span>
        <span>L {low}</span>
      </div>
    </div>
  );
}


function PlanOverview({
  data,
  billing,
  loading,
  checkoutPending,
  portalPending,
  checkoutError,
  portalError,
  onCheckout,
  onPortal,
}: {
  data: CurrentUserResponse | undefined;
  billing: BillingStatusResponse | undefined;
  loading: boolean;
  checkoutPending: boolean;
  portalPending: boolean;
  checkoutError: string | null;
  portalError: string | null;
  onCheckout: (plan: UserPlan) => void;
  onPortal: () => void;
}) {
  const plan = data?.user.plan ?? "free";
  const entitlements = data?.entitlements;
  const billingStatus = billing?.status ?? data?.user.billing_status;
  const canManageBilling = Boolean(billing?.customer_portal_enabled);

  const planTiers = [
    {
      id: "free" as UserPlan,
      name: "Starter (Free)",
      price: "₹0",
      cadence: "forever free",
      description: "For individual builders testing single projects.",
      websites: "1 Monitored Website",
      scans: "3 Scans / Month",
      features: [
        "200+ DAST & Nuclei CVE Scans",
        "AI Launch Score Assessment",
        "Public PDF Summary Report",
        "Standard Speed Queue",
      ],
      isPopular: false,
    },
    {
      id: "starter" as UserPlan,
      name: "Starter Pro",
      price: "₹1,999",
      cadence: "per month",
      description: "For active builders launching production products.",
      websites: "2 Monitored Websites",
      scans: "10 Scans / Month",
      features: [
        "All Free Features Included",
        "Full Unblurred Vulnerability Dossier",
        "Detailed Executive PDF Deliverables",
        "Automated Retest Engine",
        "Priority Scan Queue",
      ],
      isPopular: false,
    },
    {
      id: "pro" as UserPlan,
      name: "Founder Pro",
      price: "₹2,999",
      cadence: "per month",
      description: "For growing startups with multi-domain portfolios.",
      websites: "5 Monitored Websites",
      scans: "40 Scans / Month",
      features: [
        "All Starter Pro Features",
        "CI/CD GitHub App Merge Gate",
        "AI IDE Issue Sync (Cursor/Claude)",
        "Slack & Discord Webhook Alerts",
        "Historical Launch Score Curves",
      ],
      isPopular: true,
    },
    {
      id: "agency" as UserPlan,
      name: "Agency & Studio",
      price: "₹4,999",
      cadence: "per month",
      description: "For web agencies, dev shops, and audit consultancies.",
      websites: "15 Monitored Websites",
      scans: "150 Scans / Month",
      features: [
        "All Founder Pro Features",
        "100% Custom White-Label PDF Branding",
        "Custom Logo & Brand Palette",
        "Multi-Client Subdomain Scopes",
        "Weekly Automated Trust Monitoring",
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Current Active Plan Status Card */}
      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
              Active Subscription
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {displayPlanName(plan)} Plan
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your account follows the verified quota limits configured for this billing cycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" className="px-3 py-1 text-xs font-mono font-bold">
              {billingStatus ? billingStatus.replaceAll("_", " ").toUpperCase() : "ACTIVE ACCOUNT"}
            </Badge>
            {canManageBilling && (
              <Button
                variant="outline"
                onClick={onPortal}
                disabled={portalPending}
                className="h-10 rounded-xl text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
              >
                {portalPending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : <CreditCard className="size-4 mr-2" />}
                Manage Billing
              </Button>
            )}
          </div>
        </div>

        {/* Quota Usage Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">Websites Allowed</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatUsage(entitlements?.websites_used ?? 0, entitlements?.website_limit)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">Monthly Scans</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatUsage(entitlements?.scans_used_this_month ?? 0, entitlements?.monthly_scan_limit)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">PDF Report Export</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {entitlements?.pdf_download_enabled ? "Included" : "Locked"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">AI Trust Monitor</div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {plan === "free" ? "On-Demand" : "Weekly-Ready"}
            </div>
          </div>
        </div>
      </Card>

      {/* Available Plans Upgrade Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white">Upgrade or Switch Commercial Tier</h3>
          <p className="text-xs text-slate-400">Instant in-app checkout via Razorpay (UPI, Credit Cards, NetBanking)</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {planTiers.map((tier) => {
            const isCurrent = plan === tier.id;
            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200 relative ${
                  tier.isPopular
                    ? "bg-[#0C1222] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10"
                    : isCurrent
                    ? "bg-[#0B0F19] border-2 border-slate-700"
                    : "bg-[#0B0F19] border border-slate-800 hover:border-slate-700"
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[10px] font-mono uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-white">{tier.name}</h4>
                    {isCurrent && (
                      <Badge variant="success" className="text-[10px] font-mono">Current</Badge>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-white">{tier.price}</span>
                      <span className="text-xs text-slate-400 font-mono">/{tier.cadence}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                    <div className="text-emerald-400 font-bold">{tier.websites}</div>
                    <div className="text-slate-300">{tier.scans}</div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">Features:</div>
                    <ul className="space-y-2">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  {isCurrent ? (
                    <Button disabled className="w-full h-11 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed">
                      Current Plan
                    </Button>
                  ) : tier.id === "free" ? (
                    <Button disabled className="w-full h-11 rounded-xl text-xs font-bold bg-slate-900 text-slate-500 border border-slate-800">
                      Included
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onCheckout(tier.id)}
                      disabled={checkoutPending}
                      className={`w-full h-11 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all shadow-md ${
                        tier.isPopular
                          ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20"
                          : "bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {checkoutPending ? "Processing..." : `Upgrade ${tier.name}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {checkoutError && <ErrorBanner message={checkoutError} />}
        {portalError && <ErrorBanner message={portalError} />}
      </div>
    </div>
  );
}


function OnboardingGuide({
  user,
  domainCount,
  verifiedCount,
  scanCount,
}: {
  user: CurrentUserResponse | undefined;
  domainCount: number;
  verifiedCount: number;
  scanCount: number;
}) {
  const plan = user?.user.plan ?? "free";
  const email = user?.user.email ?? "your account";
  const entitlements = user?.entitlements;
  const steps = [
    {
      title: "Account created",
      description: `Signed in as ${email}. Your ${displayPlanName(plan)} plan is active.`,
      done: Boolean(user),
    },
    {
      title: "Register a website",
      description: `Your current plan allows ${formatUsage(entitlements?.websites_used ?? domainCount, entitlements?.website_limit)} websites.`,
      done: domainCount > 0,
    },
    {
      title: "Verify ownership",
      description: "Add a DNS TXT record or upload the well-known verification file.",
      done: verifiedCount > 0,
    },
    {
      title: "Run your first scan",
      description: "Launch the scanner after verification and watch the report page update.",
      done: scanCount > 0,
    },
  ];

  return (
    <section className="mb-8 rounded-[1.75rem] border border-primary/20 bg-primary/[0.06] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-4 w-4" />
            First-run onboarding
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Your path to the first security report</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">
            Starter access includes 1 verified website, 3 scans/month, AI summary, and PDF report download. Upgrade when you need more websites or scan volume.
          </p>
        </div>
        <Link href="#domain-registration">
          <Button className="h-11 rounded-xl font-mono uppercase tracking-[0.16em]">
            Continue setup
            <ArrowRight data-icon="inline-end" className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`rounded-2xl border p-4 ${
              step.done ? "border-primary/35 bg-primary/10" : "border-white/10 bg-black/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              {step.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Clock3 className="h-4 w-4 text-zinc-500" />}
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GitHubFoundationPanel({
  status,
  repositories,
  loading,
  connectPending,
  selectPending,
  disconnectPending,
  connectError,
  selectError,
  disconnectError,
  latestScan,
  scanPending,
  scanError,
  onConnect,
  onSelect,
  onDisconnect,
  onRunSnapshotScan,
}: {
  status: GitHubStatusResponse | undefined;
  repositories: GitHubRepository[];
  loading: boolean;
  connectPending: boolean;
  selectPending: boolean;
  disconnectPending: boolean;
  connectError: string | null;
  selectError: string | null;
  disconnectError: string | null;
  latestScan: GitHubRepositoryScanResponse | null;
  scanPending: boolean;
  scanError: string | null;
  onConnect: (input: { githubUsername: string; repositoryFullName: string; private?: boolean }) => void;
  onSelect: (repositoryFullName: string) => void;
  onDisconnect: () => void;
  onRunSnapshotScan: (input: { repositoryFullName?: string | null; files: Array<{ path: string; content: string }> }) => void;
}) {
  const [githubUsername, setGithubUsername] = useState("");
  const [repositoryFullName, setRepositoryFullName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [scanType, setScanType] = useState<"live" | "snapshot">("live");
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [repositorySnapshot, setRepositorySnapshot] = useState(
    JSON.stringify(
      [
        {
          path: "package.json",
          content: JSON.stringify({ dependencies: { next: "13.5.0", axios: "0.27.2" } }, null, 2),
        },
        {
          path: ".env.example",
          content: "GEMINI_API_KEY=your-key-here\nRAZORPAY_KEY_SECRET=your-secret-here",
        },
        {
          path: "app/api/admin/users/route.ts",
          content:
            "export async function GET() {\n  const users = await db.user.findMany();\n  return Response.json(users);\n}",
        },
        {
          path: "app/api/webhooks/razorpay/route.ts",
          content:
            "export async function POST(request: Request) {\n  const event = await request.json();\n  return Response.json({ received: true });\n}",
        },
      ],
      null,
      2
    )
  );
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const selectedRepo = status?.connection?.selected_repository_full_name;
  const connected = Boolean(status?.connected);
  const latestFindings = latestScan?.findings ?? [];
  const dependencyReview = latestScan?.dependency_review ?? {};
  const routeReview = latestScan?.route_review ?? {};
  const stackReview = latestScan?.stack_review ?? {};
  const dependencyCount =
    typeof dependencyReview.dependency_count === "number" ? Number(dependencyReview.dependency_count) : 0;
  const routesDiscovered = Array.isArray(routeReview.routes_discovered) ? routeReview.routes_discovered.length : 0;
  const detectedStacks = Array.isArray(stackReview.detected_stacks) ? stackReview.detected_stacks.length : 0;

  const trustScore = Math.max(
    0,
    100 -
      (latestFindings.filter((f) => f.severity === "critical").length * 25 +
        latestFindings.filter((f) => f.severity === "high").length * 15 +
        latestFindings.filter((f) => f.severity === "medium").length * 5)
  );

  const handleRunSnapshotScan = () => {
    setSnapshotError(null);
    try {
      const parsed = JSON.parse(repositorySnapshot) as Array<{ path?: string; content?: string }>;
      if (!Array.isArray(parsed)) {
        throw new Error("Snapshot must be a JSON array.");
      }
      const files = parsed.map((item) => ({
        path: String(item.path ?? "").trim(),
        content: String(item.content ?? ""),
      }));
      if (!files.length || files.some((file) => !file.path)) {
        throw new Error("Each file needs a path and content.");
      }
      onRunSnapshotScan({ repositoryFullName: selectedRepo, files });
    } catch (error) {
      setSnapshotError(error instanceof Error ? error.message : "Snapshot JSON could not be parsed.");
    }
  };

  const copyFindingPrompt = (finding: any, index: number) => {
    const text = `Fix ${finding.severity?.toUpperCase()} issue "${finding.title}" in file "${finding.affected_file}": ${finding.evidence_summary}`;
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO INTEGRATION HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 sm:p-8 shadow-2xl shadow-black/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
              <Github className="size-3.5" />
              <span>GITHUB EPHEMERAL SAST SCANNER</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connect a repository for code-level Trust Score audits
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Perform read-only code snapshot scanning for secrets, API vulnerabilities, and dependency risks.
              Raw source and credentials are never stored; evidence is automatically masked before telemetry is saved.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                Zero Source Storage
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                <Lock className="size-3.5 text-emerald-400" />
                Masked Secrets
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                Read-Only Scope
              </span>
            </div>
          </div>

          {/* Connection Input Box */}
          <div className="w-full xl:max-w-md rounded-2xl border border-slate-800/90 bg-slate-950/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Repository Authentication
              </span>
              {connected ? (
                <Badge variant="success" className="text-[10px] font-mono">Connected</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] font-mono">Ready to connect</Badge>
              )}
            </div>

            <div className="space-y-3">
              <Input
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="github-username or org"
                className="h-11 rounded-xl border-slate-800 bg-slate-900/90 text-white placeholder:text-slate-600 focus:border-emerald-500/50 font-mono text-xs"
              />
              <Input
                value={repositoryFullName}
                onChange={(e) => setRepositoryFullName(e.target.value)}
                placeholder="owner/repository"
                className="h-11 rounded-xl border-slate-800 bg-slate-900/90 text-white placeholder:text-slate-600 focus:border-emerald-500/50 font-mono text-xs"
              />

              <div className="flex items-center gap-2 pt-1 px-1">
                <input
                  type="checkbox"
                  id="is-private-repo-modern"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="size-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30"
                />
                <label htmlFor="is-private-repo-modern" className="text-xs text-slate-400 cursor-pointer select-none">
                  Private repository (read-only token)
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="button"
                disabled={loading || connectPending || !githubUsername.trim()}
                onClick={() =>
                  onConnect({
                    githubUsername: githubUsername.trim(),
                    repositoryFullName: repositoryFullName.trim(),
                    private: isPrivate,
                  })
                }
                className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                {connectPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Github className="size-4" />
                )}
                <span>Connect & Test</span>
              </Button>

              {connected && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={disconnectPending}
                  onClick={onDisconnect}
                  className="h-11 px-3.5 rounded-xl border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 text-xs font-semibold transition-colors"
                >
                  {disconnectPending ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                </Button>
              )}
            </div>

            {connectError && <ErrorBanner message={connectError} />}
            {disconnectError && <ErrorBanner message={disconnectError} />}
          </div>
        </div>
      </section>

      {/* 2. SECURITY GUARDRAILS & REPOSITORY SELECTOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Read-Only Guardrails */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 shadow-xl space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Security Protocol
            </span>
            <h3 className="text-base font-bold text-white mt-1">Read-Only Permission Model</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We enforce strict zero-write isolation. No commits, pull requests, or branch writes are ever requested.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {[
              { key: "Repository Contents", val: "read", status: "Read-Only Analysis", safe: true },
              { key: "Repository Metadata", val: "read", status: "Read-Only Tags", safe: true },
              { key: "Pull Requests", val: "none", status: "Blocked / None", safe: false },
              { key: "Issues & Discussions", val: "none", status: "Blocked / None", safe: false },
              { key: "Branch Write & Admin", val: "none", status: "Blocked / None", safe: false },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`size-2 rounded-full ${item.safe ? "bg-emerald-400 shadow-sm shadow-emerald-500/50" : "bg-slate-600"}`} />
                  <span className="font-semibold text-slate-200">{item.key}</span>
                </div>
                <Badge variant={item.safe ? "success" : "secondary"} className="text-[10px] font-mono">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Connected Repositories Explorer */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Repository Inventory
              </span>
              <h3 className="text-base font-bold text-white mt-1">Select Active Audit Target</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose which connected repository to synchronize with your workspace Trust Score.
              </p>
            </div>
            {selectedRepo ? (
              <Badge variant="success" className="text-[11px] font-mono shrink-0">
                Active: {selectedRepo}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[11px] font-mono shrink-0">
                No repo selected
              </Badge>
            )}
          </div>

          <div className="space-y-2.5 pt-2">
            {repositories.length > 0 ? (
              repositories.map((repo) => {
                const isCurrent = repo.selected || repo.full_name === selectedRepo;
                return (
                  <button
                    key={repo.full_name}
                    type="button"
                    disabled={selectPending}
                    onClick={() => onSelect(repo.full_name)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 ${
                      isCurrent
                        ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                        : "border-slate-800/80 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isCurrent
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        <GitBranch className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-xs font-bold text-white truncate flex items-center gap-2">
                          <span>{repo.full_name}</span>
                          {isCurrent && <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Branch: {repo.default_branch}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={repo.private ? "secondary" : "outline"} className="text-[10px] font-mono">
                        {repo.private ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-center space-y-2">
                <Github className="size-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Enter your GitHub username or repository above and click &quot;Connect &amp; Test&quot; to populate your active repositories.
                </p>
              </div>
            )}
            {selectError && <ErrorBanner message={selectError} />}
          </div>
        </div>
      </div>

      {/* 3. AUDIT RUNNER & CODE TELEMETRY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Audit Runner Mode */}
        <div className="xl:col-span-5 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setScanType("live")}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  scanType === "live"
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Live Ephemeral SAST
              </button>
              <button
                type="button"
                onClick={() => setScanType("snapshot")}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  scanType === "snapshot"
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                File Snapshot Mode
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {scanType === "live" ? "Live SAST Audit Pipeline" : "Repository Snapshot Testing"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                {scanType === "live"
                  ? "Clones the latest commit from your selected repository into an isolated memory sandbox, runs static code analysis (Semgrep AST + secret pattern matching), and destroys the cloned code immediately."
                  : "Paste a small, safe file snapshot snippet from your repo to test secret masking and static AST checks manually."}
              </p>
            </div>

            {scanType === "snapshot" ? (
              <textarea
                value={repositorySnapshot}
                onChange={(e) => setRepositorySnapshot(e.target.value)}
                spellCheck={false}
                className="w-full min-h-[220px] rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-slate-200 focus:border-emerald-500/50 outline-none resize-y"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <Zap className="size-3.5" />
                  <span>Ephemeral Isolation Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Target: <span className="text-white font-bold">{selectedRepo ?? "None selected"}</span>
                  <br />
                  Execution: Automated Semgrep AST + Secret Scanner
                  <br />
                  Persistence: Zero raw code stored
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <Button
              type="button"
              disabled={!selectedRepo || scanPending}
              onClick={() => {
                if (scanType === "live") {
                  onRunSnapshotScan({ repositoryFullName: selectedRepo, files: [] });
                } else {
                  handleRunSnapshotScan();
                }
              }}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              {scanPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                  <span>Auditing Repository Code...</span>
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2 fill-current" />
                  <span>{scanType === "live" ? "Run Live Ephemeral Audit" : "Audit File Snapshot"}</span>
                </>
              )}
            </Button>
            {snapshotError && <ErrorBanner message={snapshotError} />}
            {scanError && <ErrorBanner message={scanError} />}
          </div>
        </div>

        {/* Latest Findings & SAST Evidence */}
        <div className="xl:col-span-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#070A12] p-6 shadow-xl space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Audit Telemetry
              </span>
              <h3 className="text-base font-bold text-white mt-1">Code Vulnerability Evidence</h3>
              <p className="text-xs text-slate-400 mt-1">
                Static analysis findings synced with your workspace Launch Trust Score.
              </p>
            </div>
            {latestScan ? (
              <Badge variant={trustScore >= 80 ? "success" : "critical"} className="text-xs font-mono font-bold">
                Trust Score: {trustScore}/100
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs font-mono">
                No scan executed
              </Badge>
            )}
          </div>

          {latestScan ? (
            <div className="space-y-4">
              {/* Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Dependencies</span>
                  <span className="text-lg font-bold font-mono text-white mt-0.5 block">{dependencyCount}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">API Routes</span>
                  <span className="text-lg font-bold font-mono text-white mt-0.5 block">{routesDiscovered}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Tech Stacks</span>
                  <span className="text-lg font-bold font-mono text-white mt-0.5 block">{detectedStacks}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Findings</span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">{latestFindings.length}</span>
                </div>
              </div>

              {/* Findings Cards */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {latestFindings.length > 0 ? (
                  latestFindings.map((finding, idx) => {
                    const isCopied = copiedPromptIndex === idx;
                    const sev = finding.severity?.toLowerCase() || "low";
                    const sevBadge =
                      sev === "critical"
                        ? "critical"
                        : sev === "high"
                          ? "critical"
                          : sev === "medium"
                            ? "medium"
                            : "secondary";

                    return (
                      <div
                        key={`${finding.title}-${finding.affected_file}-${finding.line_start}`}
                        className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant={sevBadge as any} className="text-[10px] font-mono uppercase">
                                {finding.severity}
                              </Badge>
                              <span className="text-xs font-mono text-emerald-400 font-bold truncate">
                                {finding.affected_file}:{finding.line_start}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{finding.title}</h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyFindingPrompt(finding, idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors shrink-0"
                          >
                            {isCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                            <span>{isCopied ? "Copied" : "Copy Prompt"}</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{finding.evidence_summary}</p>

                        {typeof finding.evidence?.line_preview === "string" && (
                          <pre className="p-3 rounded-xl bg-[#06080D] border border-slate-800/80 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                            {finding.evidence.line_preview}
                          </pre>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-center text-xs text-slate-400 font-mono">
                    No code-level security vulnerabilities detected in the latest audit.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-center space-y-3">
              <ShieldAlert className="size-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
                Execute a live ephemeral scan or file snapshot on your connected repository to generate code-level security evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsageTile({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg sm:text-xl font-semibold text-white break-all leading-normal">{value}</div>
    </div>
  );
}

function PlanMini({ title, detail, active }: { title: string; detail: string; active: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? "border-primary/40 bg-primary/10" : "border-white/10 bg-black/30"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-white">{title}</div>
        {active ? <Badge variant="success">Active</Badge> : null}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-400">{detail}</div>
    </div>
  );
}

function AIContextToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-xl border p-3 text-left transition ${
        checked
          ? "border-primary/40 bg-primary/15 text-white"
          : "border-white/10 bg-black/30 text-zinc-400 hover:border-primary/30 hover:text-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <span className={`h-3 w-3 rounded-full ${checked ? "bg-primary" : "bg-zinc-700"}`} />
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
        {checked ? "Yes" : "No"}
      </div>
    </button>
  );
}

function ScanCard({ scan, token }: { scan: ScanListItem; token: string | null }) {
  const queryClient = useQueryClient();
  const cancelMutation = useMutation({
    mutationFn: () => cancelScan(scan.id, token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const riskScore = Number(scan.severity_summary?.risk_score ?? 0);
  const trustScore =
    scan.scan_mode === "ai_app_trust" && typeof scan.severity_summary?.trust_score === "number"
      ? Number(scan.severity_summary.trust_score)
      : null;
  const summary = scan.severity_summary;
  const totalFindings =
    (summary?.critical ?? 0) + (summary?.high ?? 0) + (summary?.medium ?? 0) + (summary?.low ?? 0);

  const statusColor =
    scan.status === "completed"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
      : scan.status === "running"
        ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
        : scan.status === "queued"
          ? "text-amber-400 border-amber-500/30 bg-amber-950/20"
          : "text-rose-400 border-rose-500/30 bg-rose-950/20";

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B0F19] to-[#06080D] p-6 shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all duration-300">
      <div className="space-y-4">
        {/* Card Header: Status & Scan Mode */}
        <div className="flex items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${statusColor}`}>
            {scan.status === "running" ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            ) : scan.status === "completed" ? (
              <CheckCircle2 className="size-3.5 text-emerald-400" />
            ) : scan.status === "queued" ? (
              <Clock3 className="size-3.5 text-amber-400" />
            ) : (
              <ShieldAlert className="size-3.5 text-rose-400" />
            )}
            <span className="capitalize">{scan.status}</span>
          </div>

          <Badge
            variant={
              scan.scan_mode === "authenticated" || scan.scan_mode === "ai_app_trust"
                ? "success"
                : "secondary"
            }
            className="text-[10px] font-mono uppercase tracking-wider"
          >
            {scan.scan_mode === "authenticated"
              ? "Auth DAST"
              : scan.scan_mode === "ai_app_trust"
                ? "AI Launch Score"
                : "Public DAST"}
          </Badge>
        </div>

        {/* Scan Identifier & Target */}
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <h4 className="font-mono text-base font-bold text-white tracking-wide truncate">
              Scan #{scan.id.slice(0, 8)}
            </h4>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-mono flex items-center gap-1">
            <Clock3 className="size-3 text-slate-500" />
            {formatTimestamp(scan.created_at)}
          </p>
        </div>

        {/* Score & Vulnerability Overview */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Launch Security Score</span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-bold font-mono ${
                  (trustScore ?? (100 - riskScore)) >= 80
                    ? "text-emerald-400"
                    : (trustScore ?? (100 - riskScore)) >= 50
                      ? "text-amber-400"
                      : "text-rose-400"
                }`}
              >
                {trustScore ?? (100 - riskScore)}
              </span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
          </div>

          {/* Severity Badges Grid */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {summary?.critical ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold">
                {summary.critical} Crit
              </span>
            ) : null}
            {summary?.high ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                {summary.high} High
              </span>
            ) : null}
            {summary?.medium ? (
              <span className="px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-mono font-bold">
                {summary.medium} Med
              </span>
            ) : null}
            {summary?.low ? (
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-mono font-bold">
                {summary.low} Low
              </span>
            ) : null}
            {!totalFindings && scan.status === "completed" && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                0 Vulnerabilities
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {(scan.status === "queued" || scan.status === "running") ? (
          <Button
            variant="outline"
            disabled={cancelMutation.isPending}
            onClick={() => cancelMutation.mutate()}
            className="w-full h-11 rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-mono text-xs uppercase tracking-wider"
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel Scan"}
          </Button>
        ) : (
          <Button
            asChild
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/30 transition-all"
          >
            <Link href={`/dashboard/scan/${scan.id}`}>
              Open Interactive Report
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function SignalPanel({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-zinc-400">{note}</div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
      {message}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
      {message}
    </div>
  );
}

function InfoBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-sm text-primary">
      {message}
    </div>
  );
}

function UpgradeBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">
      {message}
    </div>
  );
}

function formatUsage(used: number, limit: number | null | undefined) {
  return limit == null ? `${used} / Unlimited` : `${used} / ${limit}`;
}

function displayPlanName(plan: string) {
  if (plan === "free") return "Free";
  if (plan === "starter") return "Starter";
  if (plan.startsWith("vit_")) {
    const part = plan.replace("vit_", "");
    return `VIT ${part.charAt(0).toUpperCase()}${part.slice(1)}`;
  }
  return `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;
}

function isRecurringMonitoringPlan(plan: UserPlan) {
  return plan === "pro" || plan === "agency" || plan === "custom";
}

function scoreMovementSummary(item: NonNullable<DomainHistoryResponse["latest_summary"]>) {
  if (item.score_delta == null) {
    return {
      title: "Baseline created",
      detail: "This is the first completed scan in the history. The next run will show whether the score improved, dropped, or stayed flat.",
      className: "border-slate-800 bg-slate-950",
    };
  }
  if (item.improvement_points > 0) {
    return {
      title: `Score improved by ${item.improvement_points} point${item.improvement_points === 1 ? "" : "s"}`,
      detail: item.score_change_reason,
      className: "border-emerald-500/20 bg-emerald-500/10",
    };
  }
  if (item.regression_points > 0) {
    return {
      title: `Score dropped by ${item.regression_points} point${item.regression_points === 1 ? "" : "s"}`,
      detail: item.score_change_reason,
      className: "border-amber-500/20 bg-amber-500/10",
    };
  }
  return {
    title: "Score is stable",
    detail: item.score_change_reason,
    className: "border-primary/15 bg-primary/[0.05]",
  };
}

function displayScanMode(mode: ScanMode) {
  if (mode === "ai_app_trust") {
    return "AI Trust";
  }
  if (mode === "authenticated") {
    return "Authenticated";
  }
  return "Public";
}

function VerificationGuide({
  domainUrl,
  token,
  instructions,
  compact = false,
  domainId,
  onVerify,
  verifyPending = false,
  verifyError,
  verifySuccess = false,
}: {
  domainUrl: string;
  token: string;
  instructions?: string;
  compact?: boolean;
  domainId?: string;
  onVerify?: () => void;
  verifyPending?: boolean;
  verifyError?: string;
  verifySuccess?: boolean;
}) {
  const hostname = getHostname(domainUrl);
  const verificationUrl = `${domainUrl}/.well-known/hmw-verify.txt`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/15 bg-black/55 p-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">Verification token</div>
        <code className="mt-3 block break-all overflow-x-auto rounded-xl bg-black/70 p-4 font-mono text-sm text-primary">
          {token}
        </code>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-white">Option 1: DNS TXT record</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Best for Hostinger, GoDaddy, Namecheap, Cloudflare, cPanel, and most domain registrars.
          </p>
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
            <InstructionRow label="Type" value="TXT" />
            <InstructionRow label="Host / Name" value="@" />
            <InstructionRow label="Value / Content" value={`hmw-verify=${token}`} />
            <InstructionRow label="TTL" value="300 seconds (or Auto / Default if 300 is not available)" />
            <InstructionRow label="Applies to" value={hostname} />
          </div>
          <ol className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
            <li>1. Open your DNS manager for <span className="font-mono text-primary">{hostname}</span>.</li>
            <li>2. Click Add record, then choose <span className="font-mono text-primary">TXT</span>.</li>
            <li>3. Set Host/Name to <span className="font-mono text-primary">@</span>. If your provider rejects <span className="font-mono text-primary">@</span>, leave it blank or use the root domain name.</li>
            <li>4. Paste <span className="font-mono text-primary">{`hmw-verify=${token}`}</span> into Value or Content.</li>
            <li>5. Set TTL to <span className="font-mono text-primary">300</span>. If your provider only offers Auto or 1 hour, that is still fine.</li>
            <li>6. Save the record, wait 1 to 10 minutes, then click <span className="font-mono text-primary">Verify</span> here.</li>
          </ol>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-zinc-300">
            <span className="font-semibold text-white">Provider notes:</span> Hostinger uses DNS Zone Editor. GoDaddy uses DNS Management. cPanel usually uses Zone Editor. In all cases, you are adding a root TXT record for the domain.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-white">Option 2: File verification</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Use this if you can upload files to your website or file manager but do not want to edit DNS.
          </p>
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
            <InstructionRow label="Folder" value=".well-known" />
            <InstructionRow label="File name" value="hmw-verify.txt" />
            <InstructionRow label="Full path" value="/.well-known/hmw-verify.txt" />
            <InstructionRow label="File content" value={token} />
            <InstructionRow label="Must load at" value={verificationUrl} />
          </div>
          <ol className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
            <li>1. Open your hosting file manager, deployment panel, or project codebase.</li>
            <li>2. Create a folder named <span className="font-mono text-primary">.well-known</span> in your public web root if it does not already exist.</li>
            <li>3. Inside that folder, create a file named <span className="font-mono text-primary">hmw-verify.txt</span>.</li>
            <li>4. Put only this token in the file: <span className="font-mono text-primary">{token}</span></li>
            <li>5. Visit <span className="font-mono text-primary">{verificationUrl}</span> in your browser and confirm the token appears.</li>
            <li>6. Return here and click <span className="font-mono text-primary">Verify</span>.</li>
          </ol>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-zinc-300">
            This works for most hosting providers including Hostinger, shared hosting with cPanel, VPS setups, static hosting, and custom app servers as long as the file is publicly reachable over HTTPS.
          </div>
        </div>
      </div>

      {instructions ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-zinc-400">
          {instructions}
        </div>
      ) : null}

      {onVerify && !compact ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="text-sm leading-6 text-zinc-300">
            Once you have added the DNS TXT record or uploaded the verification file, click the button below to verify.
          </div>

          {verifySuccess ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-300">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              Domain verified successfully! You can now start a security scan.
            </div>
          ) : (
            <>
              <Button
                onClick={onVerify}
                disabled={verifyPending}
                size="lg"
                className="mt-4 h-12 w-full rounded-xl font-mono uppercase tracking-[0.18em]"
              >
                {verifyPending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Checking verification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verify my domain
                  </>
                )}
              </Button>

              {verifyError ? (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
                  <span className="font-semibold">Not verified yet:</span> {verifyError}
                  <div className="mt-1 text-xs text-amber-300/70">
                    DNS changes can take 1–10 minutes to propagate. Wait a bit and try again.
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function InstructionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <code className="block w-full break-all overflow-wrap-anywhere rounded-lg bg-black/50 px-3 py-2.5 font-mono text-xs leading-5 text-primary">
        {value}
      </code>
    </div>
  );
}

function getHostname(domainUrl: string) {
  try {
    return new URL(domainUrl).hostname;
  } catch {
    return domainUrl;
  }
}

function buildAuthHeaders(
  authMethod: "bearer_token" | "session_cookie" | "api_key_header" | "email_password" | "login_assist",
  values: {
    bearerToken: string;
    apiKeyHeaderName: string;
    apiKeyValue: string;
  }
) {
  if (authMethod === "bearer_token" && values.bearerToken.trim()) {
    return { Authorization: `Bearer ${values.bearerToken.trim()}` };
  }
  if (authMethod === "api_key_header" && values.apiKeyHeaderName.trim() && values.apiKeyValue.trim()) {
    return { [values.apiKeyHeaderName.trim()]: values.apiKeyValue.trim() };
  }
  return undefined;
}

function buildAuthCookies(
  authMethod: "bearer_token" | "session_cookie" | "api_key_header" | "email_password" | "login_assist",
  values: {
    sessionCookieName: string;
    sessionCookieValue: string;
  }
) {
  if (authMethod === "session_cookie" && values.sessionCookieValue.trim()) {
    return { [values.sessionCookieName.trim() || "session"]: values.sessionCookieValue.trim() };
  }
  return undefined;
}

function buildLoginAssistHeaders(headerName: string, headerValue: string) {
  if (headerName.trim() && headerValue.trim()) {
    return { [headerName.trim()]: headerValue.trim() };
  }
  return undefined;
}

function buildNamedCookieMap(cookieName: string, cookieValue: string) {
  if (cookieName.trim() && cookieValue.trim()) {
    return { [cookieName.trim()]: cookieValue.trim() };
  }
  return undefined;
}

function buildSecondaryAuthHeaders(
  authMethod: "bearer_token" | "session_cookie" | "api_key_header",
  values: {
    secondaryBearerToken: string;
    secondaryApiKeyHeaderName: string;
    secondaryApiKeyValue: string;
  }
) {
  if (authMethod === "bearer_token" && values.secondaryBearerToken.trim()) {
    return { Authorization: `Bearer ${values.secondaryBearerToken.trim()}` };
  }
  if (
    authMethod === "api_key_header" &&
    values.secondaryApiKeyHeaderName.trim() &&
    values.secondaryApiKeyValue.trim()
  ) {
    return { [values.secondaryApiKeyHeaderName.trim()]: values.secondaryApiKeyValue.trim() };
  }
  return undefined;
}

function buildSecondaryAuthCookies(
  authMethod: "bearer_token" | "session_cookie" | "api_key_header",
  values: {
    secondarySessionCookieName: string;
    secondarySessionCookieValue: string;
  }
) {
  if (
    authMethod === "session_cookie" &&
    values.secondarySessionCookieName.trim() &&
    values.secondarySessionCookieValue.trim()
  ) {
    return { [values.secondarySessionCookieName.trim()]: values.secondarySessionCookieValue.trim() };
  }
  return undefined;
}

const timestampFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  timeZone: "Asia/Kolkata",
});

function formatTimestamp(value: string) {
  const parsed = parseApiTimestamp(value);
  return parsed ? timestampFormatter.format(parsed) : value;
}

function shortDate(value: string) {
  const parsed = parseApiTimestamp(value);
  return parsed ? shortDateFormatter.format(parsed) : value;
}

function parseApiTimestamp(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(normalized);
  const isoLike = normalized.includes("T") ? normalized : normalized.replace(" ", "T");
  const candidate = hasTimezone ? isoLike : `${isoLike}Z`;
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function AgencySettingsPanel({
  user,
  onSave,
  saving,
  error,
}: {
  user: CurrentUserResponse | undefined;
  onSave: (input: {
    agencyName: string;
    logoUrl: string;
    brandColorPrimary: string;
    brandColorSecondary: string;
    reportFooterText: string;
  }) => void;
  saving: boolean;
  error: string | null;
}) {
  const settings = user?.user?.branding_settings ?? {};
  const [agencyName, setAgencyName] = useState(settings.agency_name || "Apex Cyber Advisory");
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [brandColorPrimary, setBrandColorPrimary] = useState(settings.brand_color_primary || "#10B981");
  const [brandColorSecondary, setBrandColorSecondary] = useState(settings.brand_color_secondary || "#064E3B");
  const [reportFooterText, setReportFooterText] = useState(
    settings.report_footer_text || "Confidential client report prepared exclusively by our cybersecurity advisory team."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presetColors = [
    { name: "Emerald Security", primary: "#10B981", secondary: "#064E3B" },
    { name: "Cobalt Blue", primary: "#3B82F6", secondary: "#1E3A8A" },
    { name: "Cyber Violet", primary: "#8B5CF6", secondary: "#4C1D95" },
    { name: "Slate Enterprise", primary: "#94A3B8", secondary: "#1E293B" },
    { name: "Amber Shield", primary: "#F59E0B", secondary: "#78350F" },
  ];

  const handleSave = () => {
    onSave({
      agencyName: agencyName.trim(),
      logoUrl: logoUrl.trim(),
      brandColorPrimary: brandColorPrimary.trim(),
      brandColorSecondary: brandColorSecondary.trim(),
      reportFooterText: reportFooterText.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Sliders className="size-3.5" />
              <span>Agency White-Label Suite</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Client Deliverable PDF & Report Branding</h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Fully white-label executive PDF security audits with your custom agency name, transparent logo, color scheme, and confidential client notices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="px-3 py-1 text-xs font-mono font-bold">
              Agency Tier Active
            </Badge>
          </div>
        </div>

        {/* Brand Identity Form Controls */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Agency Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Agency / Company Name
            </label>
            <Input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g. Apex Cyber Advisory"
              className="h-12 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-600 font-sans focus:border-emerald-500 font-semibold"
            />
            <p className="text-[11px] text-slate-500 leading-tight">
              Displayed as the delivering entity on report cover pages, headers, and certifications.
            </p>
          </div>

          {/* Logo Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Agency Logo URL
            </label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://youragency.com/logo.png"
              className="h-12 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-600 font-mono focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 leading-tight">
              Transparent PNG or SVG URL placed in the top-left of every report page.
            </p>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Primary Brand Accent (Hex)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={brandColorPrimary.startsWith("#") ? brandColorPrimary : "#10B981"}
                onChange={(e) => setBrandColorPrimary(e.target.value)}
                className="size-12 rounded-xl border border-slate-800 bg-slate-950 p-1 cursor-pointer shrink-0"
              />
              <Input
                value={brandColorPrimary}
                onChange={(e) => setBrandColorPrimary(e.target.value)}
                placeholder="#10B981"
                className="h-12 rounded-xl border-slate-800 bg-slate-950 text-xs text-white font-mono placeholder:text-slate-600 focus:border-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Applied to report headers, score meters, and callout borders.
            </p>
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Secondary Brand Accent (Hex)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={brandColorSecondary.startsWith("#") ? brandColorSecondary : "#064E3B"}
                onChange={(e) => setBrandColorSecondary(e.target.value)}
                className="size-12 rounded-xl border border-slate-800 bg-slate-950 p-1 cursor-pointer shrink-0"
              />
              <Input
                value={brandColorSecondary}
                onChange={(e) => setBrandColorSecondary(e.target.value)}
                placeholder="#064E3B"
                className="h-12 rounded-xl border-slate-800 bg-slate-950 text-xs text-white font-mono placeholder:text-slate-600 focus:border-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Applied to table headers and metric backgrounds.
            </p>
          </div>

        </div>

        {/* Custom Confidentiality / Disclaimer Text */}
        <div className="space-y-2">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
            Custom Report Disclaimer & Client Notice
          </label>
          <textarea
            value={reportFooterText}
            onChange={(e) => setReportFooterText(e.target.value)}
            rows={2}
            placeholder="Confidential client report prepared exclusively by our cybersecurity advisory team."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-500 leading-tight">
            Printed at the bottom of the executive summary and findings annexes.
          </p>
        </div>

        {/* Preset Palettes Quick Selector */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
            Quick-Select Preset Security Palettes:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {presetColors.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setBrandColorPrimary(preset.primary);
                  setBrandColorSecondary(preset.secondary);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 flex items-center gap-2 text-xs font-medium text-slate-300 transition-all hover:text-white"
              >
                <span className="size-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Client PDF Header Deliverable Preview */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Live PDF Deliverable Preview
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              ● Live Dynamic Render
            </span>
          </div>

          <div
            className="p-6 sm:p-8 rounded-2xl border bg-slate-950 shadow-2xl transition-all space-y-6"
            style={{
              borderColor: `${brandColorPrimary}40`,
              boxShadow: `0 20px 40px -15px ${brandColorPrimary}15`,
            }}
          >
            <div
              className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                backgroundColor: `${brandColorPrimary}08`,
                borderColor: `${brandColorPrimary}30`,
                borderLeftWidth: "6px",
                borderLeftColor: brandColorPrimary,
              }}
            >
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Agency Logo"
                    className="h-12 max-w-[160px] object-contain rounded-lg bg-black/40 p-1 border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="h-12 px-4 rounded-xl border flex items-center justify-center font-mono font-bold text-xs"
                    style={{
                      borderColor: `${brandColorPrimary}40`,
                      backgroundColor: `${brandColorPrimary}15`,
                      color: brandColorPrimary,
                    }}
                  >
                    {agencyName ? agencyName.toUpperCase() : "YOUR AGENCY"}
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <div className="text-base font-bold text-white tracking-tight">
                    Executive Security Audit & Vulnerability Assessment
                  </div>
                  <div className="text-xs text-slate-400">
                    Prepared by <span className="text-white font-bold">{agencyName || "Your Agency"}</span> for <span className="text-emerald-400 font-semibold">Client Target (https://example.com)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold"
                  style={{
                    backgroundColor: `${brandColorPrimary}15`,
                    borderColor: `${brandColorPrimary}40`,
                    color: brandColorPrimary,
                  }}
                >
                  Safe Harbor Certified
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <div className="text-slate-500 text-[10px] uppercase">AI Launch Score</div>
                <div className="text-lg font-bold" style={{ color: brandColorPrimary }}>96 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <div className="text-slate-500 text-[10px] uppercase">DAST Checks</div>
                <div className="text-lg font-bold text-white">200+ Passed</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <div className="text-slate-500 text-[10px] uppercase">Critical Risks</div>
                <div className="text-lg font-bold text-emerald-400">0 Detected</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <div className="text-slate-500 text-[10px] uppercase">Audit Standard</div>
                <div className="text-lg font-bold text-slate-300">OWASP Top 10</div>
              </div>
            </div>

            {/* Disclaimer in preview */}
            <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-500 italic">
              Notice: {reportFooterText || "Confidential client deliverable."}
            </div>
          </div>
        </div>

        {/* Action Button & Security Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="h-12 px-8 rounded-xl font-mono uppercase tracking-wider text-xs bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all"
            >
              {saving ? <LoaderCircle className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
              Save Agency Branding
            </Button>

            {savedSuccess && (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span>Branding configuration saved!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>Encrypted at rest using AES-256-GCM enterprise vault.</span>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}
      </Card>
    </div>
  );
}

