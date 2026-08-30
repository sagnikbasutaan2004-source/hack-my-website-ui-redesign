"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flame,
  Globe,
  GraduationCap,
  History,
  Info,
  Layers,
  Link2,
  Lock,
  LockKeyhole,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TerminalSquare,
  Wrench,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { firebaseAuth } from "@/lib/firebase";
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal";
import { ScanComparisonModal } from "@/components/scan-comparison-modal";
import { RiskEffortMatrix } from "@/components/risk-effort-matrix";
import { RiskAcceptanceModal } from "@/components/risk-acceptance-modal";
import { AttackSurfaceGraph } from "@/components/attack-surface-graph";
import { ShareReportModal } from "@/components/share-report-modal";
import { SecurityPostureHistory } from "@/components/security-posture-history";
import {
  dispatchToIde,
  generateCurlReplayCommand,
  buildUniversalAgentDirective,
  SUPPORTED_IDES,
} from "@/lib/ide-dispatcher";
import {
  buildGitHubIssueUrl,
  buildLinearIssueUrl,
  buildIssueMarkdownBody,
} from "@/lib/ticketing-dispatcher";
import {
  downloadScanReport,
  getScanComparison,
  getDomainHistory,
  getCurrentUser,
  getScan,
  listDomains,
  retestFinding,
  retestOpenFindings,
  type DomainResponse,
  type ScanComparisonResponse,
  type ScanDetailResponse,
} from "@/lib/api";

export type Finding = {
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
  retest_status?: string | null;
  retest_last_checked_at: string | null;
};

type ScanDetail = ScanDetailResponse & { findings: Finding[] };

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const TRUST_SCORE_CATEGORIES = [
  { key: "security_basics", label: "Security basics", max: 25 },
  { key: "auth_session_safety", label: "Auth & session safety", max: 20 },
  { key: "secrets_api_exposure", label: "Secrets & API exposure", max: 20 },
  { key: "production_readiness", label: "Production readiness", max: 15 },
  { key: "payment_user_data_risk", label: "Payment & user data risk", max: 10 },
  { key: "scalability_reliability", label: "Scalability & reliability", max: 10 },
] as const;

export default function ScanResultsPage() {
  const params = useParams<{ scanId: string }>();
  const scanId = typeof params?.scanId === "string" ? params.scanId : "";
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [viewerLabel, setViewerLabel] = useState<string | null>(null);
  const [viewerSubLabel, setViewerSubLabel] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [retestMessage, setRetestMessage] = useState<string | null>(null);

  // New Interactive Explorer State
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("severity_desc");
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [manualFixedMap, setManualFixedMap] = useState<Record<string, boolean>>({});
  const [isScoreBreakdownOpen, setIsScoreBreakdownOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [drawerEvidenceTab, setDrawerEvidenceTab] = useState<"evidence" | "curl">("evidence");
  const [selectedIde, setSelectedIde] = useState<"cursor" | "vscode" | "windsurf" | "jetbrains">("cursor");
  const [ideDispatchStatus, setIdeDispatchStatus] = useState<string | null>(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false);
  const [riskAcceptedMap, setRiskAcceptedMap] = useState<Record<string, { reason: string; notes: string; expiresAt: string | null }>>({});
  const [retestProgressFindingId, setRetestProgressFindingId] = useState<string | null>(null);
  const [retestResultFindingMap, setRetestResultFindingMap] = useState<Record<string, { status: string; message?: string }>>({});
  const [isExecutiveMode, setIsExecutiveMode] = useState<boolean>(false);
  const [selectedEndpointFilter, setSelectedEndpointFilter] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthError("Firebase is not configured for this environment.");
      return;
    }

    const auth = firebaseAuth;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setToken(null);
        setAuthError("You are not authenticated. Please return to the homepage and sign in.");
        setViewerLabel(null);
        setViewerSubLabel(null);
        return;
      }
      setToken(await user.getIdToken());
      setViewerLabel(user.email || user.displayName || "Authenticated user");
      setViewerSubLabel(user.email ? `Signed in as ${user.email}` : `Firebase UID: ${user.uid}`);
    });

    return unsubscribe;
  }, []);

  const scanQuery = useQuery({
    queryKey: ["scan", scanId, token],
    enabled: Boolean(apiBaseUrl && token && scanId),
    queryFn: () => getScan({ scanId, token: token ?? "" }) as Promise<ScanDetail>,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "queued" || status === "running" ? 5000 : false;
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ["current-user", token],
    enabled: Boolean(apiBaseUrl && token),
    queryFn: () => getCurrentUser(token ?? ""),
  });

  const comparisonQuery = useQuery({
    queryKey: ["scan-comparison", scanId, token],
    enabled: Boolean(apiBaseUrl && token && scanId),
    queryFn: () => getScanComparison({ scanId, token: token ?? "" }) as Promise<ScanComparisonResponse | null>,
    refetchInterval: () => {
      const status = scanQuery.data?.status;
      return status === "queued" || status === "running" ? 5000 : false;
    },
  });

  const domainHistoryQuery = useQuery({
    queryKey: ["domain-history", scanQuery.data?.domain_id, token],
    enabled: Boolean(apiBaseUrl && token && scanQuery.data?.domain_id),
    queryFn: () => getDomainHistory({ domainId: scanQuery.data?.domain_id ?? "", token: token ?? "" }),
  });

  const domainsQuery = useQuery({
    queryKey: ["domains", token],
    enabled: Boolean(apiBaseUrl && token),
    queryFn: () => listDomains(token ?? ""),
  });

  const reportDownloadMutation = useMutation({
    mutationFn: () => downloadScanReport({ scanId, token: token ?? "" }),
    onSuccess: (result) => {
      const scanDateStr = scan?.completed_at
        ? new Date(scan.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "current audit";
      setDownloadMessage(`PDF security report (${scanDateStr}) is ready. Signed link valid for ${result.expires_in_days} days.`);
      const link = document.createElement("a");
      link.href = result.download_url;
      link.rel = "noopener noreferrer";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: (error) => {
      setDownloadMessage(error instanceof Error ? error.message : "PDF report could not be downloaded.");
    },
  });

  const retestFindingMutation = useMutation({
    mutationFn: ({ findingId }: { findingId: string }) => {
      setRetestProgressFindingId(findingId);
      return retestFinding({ findingId, token: token ?? "" });
    },
    onSuccess: (result, variables) => {
      setRetestProgressFindingId(null);
      setRetestResultFindingMap((prev) => ({
        ...prev,
        [variables.findingId]: {
          status: result.status,
          message:
            result.status === "fixed"
              ? "Vulnerability verified fixed ✓"
              : `Retest status: ${formatRetestStatus(result.status)}`,
        },
      }));
      if (result.status === "fixed") {
        setManualFixedMap((prev) => ({ ...prev, [variables.findingId]: true }));
      }
      setRetestMessage(
        result.status === "fixed"
          ? "Nice work. The last retest marked this finding as fixed."
          : `Retest finished with status: ${formatRetestStatus(result.status)}.`
      );
      void queryClient.invalidateQueries({ queryKey: ["scan", scanId, token] });
      void queryClient.invalidateQueries({ queryKey: ["current-user", token] });
    },
    onError: (error) => {
      setRetestProgressFindingId(null);
      setRetestMessage(error instanceof Error ? error.message : "Retest could not be started.");
    },
  });

  const retestAllMutation = useMutation({
    mutationFn: () => retestOpenFindings({ scanId, token: token ?? "" }),
    onSuccess: (result) => {
      setRetestMessage(result.message);
      void queryClient.invalidateQueries({ queryKey: ["scan", scanId, token] });
      void queryClient.invalidateQueries({ queryKey: ["current-user", token] });
    },
    onError: (error) => {
      setRetestMessage(error instanceof Error ? error.message : "Open findings could not be retested.");
    },
  });

  const scan = scanQuery.data;
  const targetUrl = useMemo(() => extractPrimaryUrl(scan, domainsQuery.data), [scan, domainsQuery.data]);
  const severity = useMemo(() => buildSeverityState(scan), [scan]);
  const summarySections = useMemo(() => buildSummarySections(scan, severity), [scan, severity]);
  const planData = currentUserQuery.data;
  const currentPlan = planData?.user.plan ?? "free";
  const pdfEnabled = Boolean(planData?.entitlements.pdf_download_enabled);
  const monthlyRetestLimit = planData?.entitlements.monthly_scan_limit ?? null;
  const scansUsedThisMonth = planData?.entitlements.scans_used_this_month ?? 0;
  const canStartRetest = monthlyRetestLimit === null || scansUsedThisMonth < monthlyRetestLimit;
  const scanComplete = scan?.status === "completed" || scan?.status === "completed_with_errors";

  const progressValue = useMemo(() => {
    if (!scan) return 0;
    if (scan.status === "queued") return 5;
    if (scan.status === "running") {
      const prog = (scan as any).scan_progress as Record<string, { percentage?: number }> | undefined;
      const overall = prog?.overall?.percentage ?? 10;
      return Math.min(Math.max(overall, 10), 95);
    }
    return 100;
  }, [scan]);

  const isVitUser = Boolean((planData?.user.plan && planData.user.plan.startsWith("vit_")) || viewerLabel?.toLowerCase().includes("vit"));

  // Findings list filtering and sorting
  const rawFindings = scan?.findings ?? [];
  const filteredFindings = useMemo(() => {
    return rawFindings
      .filter((finding) => {
        // Severity filter
        if (severityFilter !== "all" && finding.severity !== severityFilter) {
          return false;
        }
        // Status filter
        const isFixed = manualFixedMap[finding.id] || finding.retest_status === "fixed";
        const isRetestRequired = finding.retest_status === "still_present" || finding.retest_status === "failed";
        const isInProgress = finding.retest_status === "running" || finding.retest_status === "queued";
        if (statusFilter === "fixed" && !isFixed) return false;
        if (statusFilter === "open" && isFixed) return false;
        if (statusFilter === "retest_required" && !isRetestRequired) return false;
        if (statusFilter === "in_progress" && !isInProgress) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = finding.title.toLowerCase().includes(q);
          const matchUrl = (finding.affected_url ?? "").toLowerCase().includes(q);
          const matchOwasp = (finding.owasp_category ?? "").toLowerCase().includes(q);
          const matchTool = (finding.tool_source ?? "").toLowerCase().includes(q);
          const matchDesc = (finding.description ?? "").toLowerCase().includes(q);
          if (!matchTitle && !matchUrl && !matchOwasp && !matchTool && !matchDesc) {
            return false;
          }
        }

        // Attack Surface Graph Endpoint Filter
        if (selectedEndpointFilter && selectedEndpointFilter.trim()) {
          const fUrl = finding.affected_url || targetUrl;
          if (fUrl !== selectedEndpointFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "severity_desc") {
          const rank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
          return (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0);
        }
        if (sortBy === "severity_asc") {
          const rank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
          return (rank[a.severity] ?? 0) - (rank[b.severity] ?? 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "url") {
          return (a.affected_url ?? "").localeCompare(b.affected_url ?? "");
        }
        return 0;
      });
  }, [rawFindings, severityFilter, statusFilter, searchQuery, sortBy, manualFixedMap]);

  // Selected Finding & Drawer Navigation
  const selectedFindingIndex = useMemo(() => {
    if (!selectedFindingId) return -1;
    return filteredFindings.findIndex((f) => f.id === selectedFindingId);
  }, [selectedFindingId, filteredFindings]);

  const selectedFinding = useMemo(() => {
    if (selectedFindingIndex >= 0) return filteredFindings[selectedFindingIndex];
    if (selectedFindingId) return rawFindings.find((f) => f.id === selectedFindingId) ?? null;
    return null;
  }, [selectedFindingIndex, selectedFindingId, filteredFindings, rawFindings]);

  const handlePrevFinding = () => {
    if (selectedFindingIndex > 0) {
      setSelectedFindingId(filteredFindings[selectedFindingIndex - 1].id);
    }
  };

  const handleNextFinding = () => {
    if (selectedFindingIndex >= 0 && selectedFindingIndex < filteredFindings.length - 1) {
      setSelectedFindingId(filteredFindings[selectedFindingIndex + 1].id);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleIdeDispatch = async (ide: "cursor" | "vscode" | "windsurf" | "jetbrains") => {
    if (!selectedFinding) return;
    setSelectedIde(ide);
    await dispatchToIde(ide, selectedFinding, targetUrl);
    setIdeDispatchStatus(`Opened ${ide.toUpperCase()} & copied fix directive!`);
    setTimeout(() => setIdeDispatchStatus(null), 3500);
  };

  const handleAcceptRisk = (findingId: string, reason: string, notes: string, expiresAt: string | null) => {
    setRiskAcceptedMap((prev) => ({
      ...prev,
      [findingId]: { reason, notes, expiresAt },
    }));
    setRetestMessage("Risk accepted. Logged to workspace compliance audit trail.");
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/workspace">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Workspace
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="uppercase text-[10px] tracking-widest text-slate-500 font-bold hidden md:inline">Assessment</span>
              <span className="text-slate-600 hidden md:inline">/</span>
              <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-[320px]">{targetUrl}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isVitUser ? (
              <Link href="/vit-launch">
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[11px] hover:bg-amber-500/20 cursor-pointer">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  VIT Campus Edition
                </Badge>
              </Link>
            ) : null}
            {viewerLabel ? (
              <div className="hidden sm:flex items-center gap-2 border border-slate-800 bg-slate-950/80 px-3 py-1 rounded-lg text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-400">{planData ? displayPlanName(planData.user.plan) : "User"}</span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 space-y-8">
        {/* Live scanning progress station if scan is running */}
        {scan && !scanComplete && (scan.status === "queued" || scan.status === "running") ? (
          <LiveScanningStation scan={scan} progressValue={progressValue} targetUrl={targetUrl} />
        ) : (
          <>
            {/* 1. REPORT HEADER (Linear / Vercel style) */}
            <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                      Security Assessment
                    </span>
                    <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 font-mono text-xs">
                      {scan ? displayScanModeLabel(scan.scan_mode) : "Public Scan"}
                    </Badge>
                    <Badge variant="success" className="font-mono text-xs">
                      Safe Harbor Verified ✓
                    </Badge>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
                      <Globe className="h-6 w-6 text-emerald-400 shrink-0" />
                      <span className="truncate">{targetUrl}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                      Automated vulnerability assessment, business risk quantification, and actionable AI remediation prompts.
                    </p>
                  </div>

                  {/* Compact Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>{formatScanTimestamp(scan)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
                      <Layers className="h-3.5 w-3.5 text-slate-500" />
                      <span>Pages crawled: <strong className="text-slate-200">{extractPagesCrawled(scan)}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
                      <Lock className="h-3.5 w-3.5 text-slate-500" />
                      <span>Auth routes: <strong className="text-slate-200">{extractAuthRoutesCount(scan)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score & Actions Panel */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-8 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="text-left sm:text-right">
                      <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-1">
                        <span className={getScoreTextColor(severity.score)}>{severity.score}</span>
                        <span className="text-lg font-normal text-slate-600">/100</span>
                      </div>
                      <div className="mt-1 flex flex-col sm:items-end">
                        <Badge variant={severity.badgeVariant} className="font-mono text-[11px] uppercase tracking-wider font-bold">
                          {severity.label} Risk
                        </Badge>
                        <button
                          type="button"
                          onClick={() => setIsScoreBreakdownOpen(true)}
                          className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                        >
                          <Sparkles className="h-3 w-3 text-emerald-400" />
                          <span>How is this calculated? ↗</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    {/* Executive Presentation Mode Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsExecutiveMode((prev) => !prev)}
                      className={`h-9 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                        isExecutiveMode
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                      title="Toggle Executive Presentation Mode (simplified metrics & business impacts for stakeholders)"
                    >
                      <ShieldCheck className={`h-3.5 w-3.5 ${isExecutiveMode ? "text-emerald-400" : "text-slate-500"}`} />
                      <span>{isExecutiveMode ? "Executive View: ON" : "Executive View"}</span>
                    </button>

                    {/* Secure Share Link Generator */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsShareModalOpen(true)}
                      className="h-9 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Link2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Share</span>
                    </Button>

                    {pdfEnabled ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-9 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex-1 sm:flex-initial"
                        onClick={() => {
                          setDownloadMessage(null);
                          reportDownloadMutation.mutate();
                        }}
                        disabled={!scanComplete || reportDownloadMutation.isPending}
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        {reportDownloadMutation.isPending ? "Preparing PDF..." : "Download PDF"}
                      </Button>
                    ) : (
                      <Link href="/workspace" className="flex-1 sm:flex-initial">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        >
                          <LockKeyhole className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                          Upgrade for PDF
                        </Button>
                      </Link>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-lg font-mono text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer flex-1 sm:flex-initial"
                      disabled={!scanComplete || !canStartRetest || retestAllMutation.isPending}
                      onClick={() => {
                        setRetestMessage(null);
                        retestAllMutation.mutate();
                      }}
                    >
                      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${retestAllMutation.isPending ? "animate-spin" : ""}`} />
                      {retestAllMutation.isPending ? "Retesting all..." : "Retest all"}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* EXECUTIVE PRESENTATION BRIEF (Shown only in Executive Mode) */}
            {isExecutiveMode ? (
              <section className="rounded-2xl border border-emerald-500/40 bg-[#0B0F19] p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Executive Security Posture Brief
                    </div>
                    <h2 className="text-xl font-bold font-mono text-white">
                      Board & Compliance Summary
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={severity.badgeVariant} className="font-mono text-xs uppercase px-3 py-1 font-bold">
                      {severity.score >= 80 ? "Launch Ready" : severity.score >= 60 ? "Remediation Recommended" : "Launch Blocked"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                      Launch Posture Status
                    </span>
                    <p className="text-sm font-bold text-slate-200">
                      {severity.score >= 80 ? "Production Hardened" : severity.score >= 60 ? "Conditional Launch" : "Blocker Remediation Required"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {severity.counts.critical > 0 ? `${severity.counts.critical} critical vulnerabilities must be resolved prior to enterprise production deployment.` : "Zero critical blockers detected in current evaluation."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                      Top Business Risk Exposure
                    </span>
                    <p className="text-sm font-bold text-slate-200 truncate">
                      {rawFindings.length > 0 ? rawFindings[0].title : "No Active Risks"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {rawFindings.length > 0 ? (rawFindings[0].business_impact || "Potential data exposure / misconfiguration risk.") : "System baseline verified intact."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                      Estimated Remediation Effort
                    </span>
                    <p className="text-sm font-bold text-emerald-400 font-mono">
                      {severity.counts.critical + severity.counts.high > 0 ? `~${(severity.counts.critical * 2 + severity.counts.high * 1)} Engineering Days` : "< 1 Day"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Based on automated AI-assisted patch generation and isolated retest verification.
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {/* 2. SEVERITY OVERVIEW (Horizontal Restrained Metric Cards) */}
            <section className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <SeverityOverviewCard
                label="CRITICAL"
                count={severity.counts.critical}
                colorClass="border-rose-500/30 bg-rose-950/10 text-rose-400 hover:border-rose-500/50"
                active={severityFilter === "critical"}
                onClick={() => setSeverityFilter(severityFilter === "critical" ? "all" : "critical")}
              />
              <SeverityOverviewCard
                label="HIGH"
                count={severity.counts.high}
                colorClass="border-orange-500/30 bg-orange-950/10 text-orange-400 hover:border-orange-500/50"
                active={severityFilter === "high"}
                onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
              />
              <SeverityOverviewCard
                label="MEDIUM"
                count={severity.counts.medium}
                colorClass="border-amber-500/30 bg-amber-950/10 text-amber-400 hover:border-amber-500/50"
                active={severityFilter === "medium"}
                onClick={() => setSeverityFilter(severityFilter === "medium" ? "all" : "medium")}
              />
              <SeverityOverviewCard
                label="LOW"
                count={severity.counts.low}
                colorClass="border-sky-500/30 bg-sky-950/10 text-sky-400 hover:border-sky-500/50"
                active={severityFilter === "low"}
                onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
              />
              <SeverityOverviewCard
                label="INFO"
                count={severity.counts.info}
                colorClass="border-slate-700/40 bg-slate-900/30 text-slate-400 hover:border-slate-600"
                active={severityFilter === "info"}
                onClick={() => setSeverityFilter(severityFilter === "info" ? "all" : "info")}
              />
            </section>

            {/* 3. SCORE TRAJECTORY & RECENT AUDIT DELTAS */}
            {comparisonQuery.data ? (
              <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-200">
                      Score Trajectory & Progress
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      Comparing with previous scan ({comparisonQuery.data.previous_scan_date ? new Date(comparisonQuery.data.previous_scan_date).toLocaleDateString() : "Initial"})
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsComparisonModalOpen(true)}
                      className="h-7 px-2.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 cursor-pointer"
                    >
                      <History className="size-3 mr-1 text-emerald-400" />
                      View Changes ↗
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Current Health</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">{severity.score} / 100</div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Score Change</span>
                    <div className={`text-xl font-bold font-mono mt-1 ${
                      (comparisonQuery.data.score_delta ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {(comparisonQuery.data.score_delta ?? 0) >= 0 ? `+${comparisonQuery.data.score_delta ?? 0}` : comparisonQuery.data.score_delta} pts
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Fixed Findings</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{comparisonQuery.data.fixed_findings ?? 0} resolved</div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">New Findings</span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">{comparisonQuery.data.new_findings ?? 0} surfaced</div>
                  </div>
                </div>
              </section>
            ) : null}

            {/* 3.5 SECURITY POSTURE & HISTORICAL AUDIT TRAIL (Phase 5) */}
            {domainHistoryQuery.data?.items && domainHistoryQuery.data.items.length > 1 ? (
              <SecurityPostureHistory
                historyItems={domainHistoryQuery.data.items}
                currentScanId={scanId}
                targetUrl={targetUrl}
              />
            ) : null}

            {/* 4. ATTACK SURFACE TELEMETRY (Full Width Grid) */}
            <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-200">
                  Attack Surface & Scan Scope
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <AttackSurfaceCard label="Pages Crawled" value={extractPagesCrawled(scan)} icon={<Globe className="h-3.5 w-3.5 text-slate-400" />} />
                <AttackSurfaceCard label="Auth Routes" value={extractAuthRoutesCount(scan)} icon={<Lock className="h-3.5 w-3.5 text-slate-400" />} />
                <AttackSurfaceCard label="Scan Mode" value={scan ? displayScanModeLabel(scan.scan_mode) : "Public"} icon={<Shield className="h-3.5 w-3.5 text-slate-400" />} />
                <AttackSurfaceCard label="APIs Observed" value={extractApisObserved(scan)} icon={<Code2 className="h-3.5 w-3.5 text-slate-400" />} />
                <AttackSurfaceCard label="JS Assets" value={extractJsAssets(scan)} icon={<Layers className="h-3.5 w-3.5 text-slate-400" />} />
                <AttackSurfaceCard label="Safe Harbor" value="Verified" icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />} />
              </div>
            </section>

            {/* 4.1 INTERACTIVE ATTACK SURFACE GRAPH */}
            <AttackSurfaceGraph
              targetUrl={targetUrl}
              findings={rawFindings}
              selectedUrlFilter={selectedEndpointFilter}
              onSelectFindingUrl={(url) => {
                setSelectedEndpointFilter(url || null);
                // Scroll down smoothly to findings section
                const el = document.getElementById("discovered-vulnerabilities-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* 5. EXECUTIVE RISK SUMMARY ("WHAT MATTERS MOST") */}
            <section className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    What Matters Most
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Highest priority vulnerabilities requiring immediate attention before launch or scale-up.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {rawFindings.length} Total Findings
                </div>
              </div>

              {/* Priority Cards List */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rawFindings.slice(0, 3).map((finding) => (
                  <div
                    key={finding.id}
                    onClick={() => setSelectedFindingId(finding.id)}
                    className="group flex flex-col justify-between p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all cursor-pointer space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={severityVariantForFinding(finding.severity)} className="font-mono text-[10px] uppercase font-bold">
                          {finding.severity}
                        </Badge>
                        <span className="font-mono text-[10px] text-slate-500">{finding.tool_source ?? "DAST"}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {finding.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {finding.business_impact ?? finding.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      <span className="truncate text-slate-500 text-[11px] max-w-[160px]">{finding.affected_url ?? "Root"}</span>
                      <span className="inline-flex items-center gap-1 font-bold">
                        View detail <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5.5 RISK x EFFORT PRIORITIZATION & RECOMMENDED NEXT ACTIONS */}
            <RiskEffortMatrix findings={rawFindings} onSelectFinding={setSelectedFindingId} />

            {/* 6. FINDINGS EXPLORER (The Core Interactive Table / List) */}
            <section id="discovered-vulnerabilities-section" className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-xl space-y-6 scroll-mt-20">
              {/* Explorer Header & Controls */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-mono text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-emerald-400" />
                      Discovered Vulnerabilities ({filteredFindings.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select any vulnerability to review evidence, attack scenarios, and copy automated fix prompts.
                    </p>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full sm:w-72">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search findings, URLs, OWASP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
                    />
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Filter & Sort Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  {/* Severity Filter Tabs */}
                  <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800/80 text-xs font-mono">
                    {["all", "critical", "high", "medium", "low", "info"].map((sev) => {
                      const count = sev === "all" ? rawFindings.length : rawFindings.filter((f) => f.severity === sev).length;
                      if (count === 0 && sev !== "all") return null;
                      return (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-3 py-1 rounded-md text-[11px] uppercase font-bold transition-all ${
                            severityFilter === sev
                              ? "bg-slate-800 text-white shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {sev} <span className="text-slate-500 text-[10px]">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Status & Sort Controls */}
                  <div className="flex items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-8 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="all">All Statuses</option>
                      <option value="open">Open Issues</option>
                      <option value="fixed">Fixed / Resolved</option>
                      <option value="retest_required">Retest Required</option>
                      <option value="in_progress">In Progress</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="severity_desc">Severity (High → Low)</option>
                      <option value="severity_asc">Severity (Low → High)</option>
                      <option value="title">Finding Title (A-Z)</option>
                      <option value="url">Target URL</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Findings List (Compact Rows) */}
              <div className="divide-y divide-slate-800/80 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/60">
                {filteredFindings.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-mono text-xs space-y-2">
                    <ShieldCheck className="h-8 w-8 mx-auto text-emerald-400/60 mb-2" />
                    <p className="font-semibold text-white">No vulnerabilities found matching this filter.</p>
                    <p className="text-slate-500">Try clearing your search query or selecting "All" severities.</p>
                  </div>
                ) : (
                  filteredFindings.map((finding, idx) => {
                    const isSelected = selectedFindingId === finding.id;
                    const isFixed = manualFixedMap[finding.id] || finding.retest_status === "fixed";

                    return (
                      <div
                        key={finding.id}
                        onClick={() => setSelectedFindingId(finding.id)}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-slate-800/70 border-l-4 border-l-emerald-400"
                            : "hover:bg-slate-900/60"
                        }`}
                      >
                        {/* Left: Severity & Title & URL */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          <Badge
                            variant={severityVariantForFinding(finding.severity)}
                            className="font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5 sm:mt-0"
                          >
                            {finding.severity}
                          </Badge>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                                {finding.title}
                              </h4>
                              {isFixed ? (
                                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono font-bold shrink-0">
                                  FIXED ✓
                                </Badge>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
                              <span className="text-slate-400 truncate max-w-xs sm:max-w-md">{finding.affected_url ?? "Root target"}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{finding.tool_source ?? "ZAP"}</span>
                              {finding.confidence ? (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-slate-400">{finding.confidence} Confidence</span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900">
                          <Badge variant="outline" className="border-slate-800 bg-slate-900 font-mono text-[10px] uppercase text-slate-400">
                            {formatRetestStatus(finding.retest_status)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 font-mono text-xs text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-800"
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* 8. FINDING DETAIL RIGHT-SIDE DRAWER (45-50% Viewport Desktop / Fullscreen Mobile) */}
      {selectedFinding ? (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedFindingId(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full md:w-[48vw] lg:w-[46vw] max-w-3xl h-full bg-[#0B0F19] border-l border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            {/* Drawer Top Navigation & Actions */}
            <div className="sticky top-0 z-20 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
              {/* Finding Index / Stepper */}
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <button
                  onClick={handlePrevFinding}
                  disabled={selectedFindingIndex <= 0}
                  className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous finding"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-semibold text-slate-200">
                  {selectedFindingIndex >= 0 ? `${selectedFindingIndex + 1} of ${filteredFindings.length}` : "Finding Details"}
                </span>
                <button
                  onClick={handleNextFinding}
                  disabled={selectedFindingIndex >= filteredFindings.length - 1}
                  className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next finding"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Actions & Close Button */}
              <div className="flex items-center gap-2">
                {/* 1-Click IDE Dispatcher Dropdown / Quick Launch */}
                <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => handleIdeDispatch("cursor")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Launch in Cursor IDE & copy AI directive"
                  >
                    <Zap className="h-3 w-3" />
                    <span>Cursor</span>
                  </button>
                  <div className="w-px h-4 bg-slate-800 my-auto" />
                  <button
                    type="button"
                    onClick={() => handleIdeDispatch("vscode")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Open in VS Code"
                  >
                    <span>VS Code</span>
                  </button>
                  <div className="w-px h-4 bg-slate-800 my-auto" />
                  <button
                    type="button"
                    onClick={() => handleIdeDispatch("windsurf")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Open in Windsurf"
                  >
                    <span>Windsurf</span>
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    retestFindingMutation.mutate({ findingId: selectedFinding.id });
                  }}
                  disabled={retestFindingMutation.isPending}
                  className="h-8 rounded-lg font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${retestFindingMutation.isPending ? "animate-spin" : ""}`} />
                  {retestFindingMutation.isPending ? "Retesting..." : "Retest"}
                </Button>

                <button
                  onClick={() => setSelectedFindingId(null)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (FULL-WIDTH SECTIONS) */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-200">
              {/* Finding Title & Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={severityVariantForFinding(selectedFinding.severity)} className="font-mono text-xs uppercase font-bold">
                    {selectedFinding.severity}
                  </Badge>
                  <Badge variant="outline" className="border-slate-800 bg-slate-900 font-mono text-xs text-slate-300">
                    {selectedFinding.owasp_category ?? "OWASP Mapping Pending"}
                  </Badge>
                  <Badge variant="outline" className="border-slate-800 bg-slate-900 font-mono text-xs text-slate-400">
                    {selectedFinding.tool_source ?? "DAST Engine"}
                  </Badge>
                  <Badge variant="outline" className="border-slate-800 bg-slate-900 font-mono text-xs text-slate-400">
                    {selectedFinding.confidence ? `${selectedFinding.confidence} Confidence` : "Verified"}
                  </Badge>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight leading-snug">
                  {selectedFinding.title}
                </h2>
              </div>

              {/* SECTION: RETEST STATUS & VERIFICATION TELEMETRY BANNER */}
              {retestProgressFindingId === selectedFinding.id ? (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="h-5 w-5 text-emerald-400 animate-spin shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Executing Live Security Check...
                    </span>
                    <p className="text-xs text-slate-400">
                      Sending targeted verification probe to <code className="text-emerald-300">{selectedFinding.affected_url ?? targetUrl}</code> without full scan overhead.
                    </p>
                  </div>
                </div>
              ) : manualFixedMap[selectedFinding.id] || selectedFinding.retest_status === "fixed" ? (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                        VERIFIED FIXED ✓
                      </span>
                      <p className="text-xs text-slate-400">
                        Target response confirmed secure. Finding marked resolved in scan security metrics.
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="font-mono text-[10px] uppercase font-bold shrink-0">
                    Remediated
                  </Badge>
                </div>
              ) : riskAcceptedMap[selectedFinding.id] ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-400 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                        RISK ACCEPTED (COMPLIANCE AUDIT LOGGED)
                      </span>
                      <p className="text-xs text-slate-400">
                        Reason: {riskAcceptedMap[selectedFinding.id].reason}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold border-amber-500/40 text-amber-300 shrink-0">
                    Acknowledged
                  </Badge>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                      Fix Priority Recommendation
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      {getPriorityCallout(selectedFinding.severity)}
                    </p>
                  </div>
                  <Badge variant={severityVariantForFinding(selectedFinding.severity)} className="font-mono text-xs uppercase">
                    {selectedFinding.severity}
                  </Badge>
                </div>
              )}

              {/* SECTION: AFFECTED TARGET (Full-Width URL Box with Copy/Open) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Affected Target
                </span>
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-200">
                  <span className="truncate flex-1 select-all">{selectedFinding.affected_url ?? targetUrl}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopyText("url", selectedFinding.affected_url ?? targetUrl)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedItemId === "url" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {selectedFinding.affected_url ? (
                      <a
                        href={selectedFinding.affected_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* SECTION: WHAT THIS MEANS (Full Width) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  What This Means
                </span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {selectedFinding.description || "No plain-English description was provided."}
                </div>
              </div>

              {/* SECTION: BUSINESS IMPACT (Full Width) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Business Impact
                </span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {selectedFinding.business_impact ?? fallbackBusinessImpact(selectedFinding)}
                </div>
              </div>

              {/* SECTION: ATTACK SCENARIO (Full Width) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Attack Scenario
                </span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {selectedFinding.attack_scenario ?? "An attacker can exploit this weakness by sending crafted HTTP requests or executing unauthorized browser interactions."}
                </div>
              </div>

              {/* SECTION: EVIDENCE FOUND & cURL REPLAY (Full Width Technical Evidence with Tab Toggle) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setDrawerEvidenceTab("evidence")}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        drawerEvidenceTab === "evidence"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🔍 Scanner Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerEvidenceTab("curl")}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        drawerEvidenceTab === "curl"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      cURL Replay
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text =
                        drawerEvidenceTab === "evidence"
                          ? formatRawEvidence(selectedFinding)
                          : generateCurlReplayCommand(selectedFinding, targetUrl);
                      handleCopyText(drawerEvidenceTab, text);
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    {copiedItemId === drawerEvidenceTab ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedItemId === drawerEvidenceTab ? "Copied" : drawerEvidenceTab === "evidence" ? "Copy Evidence" : "Copy cURL"}</span>
                  </button>
                </div>

                {drawerEvidenceTab === "evidence" ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {formatRawEvidence(selectedFinding)}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#06080D] border border-emerald-500/30 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed space-y-2 shadow-inner">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Reproduce Finding in Terminal (Masked Auth Headers)
                    </div>
                    <pre className="text-[11px] text-emerald-300/90 leading-relaxed">
                      {generateCurlReplayCommand(selectedFinding, targetUrl)}
                    </pre>
                  </div>
                )}
              </div>

              {/* SECTION: TECHNICAL DETAILS (2-Column Key/Value Grid) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Technical Details
                </span>
                <div className="grid grid-cols-2 gap-2.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Scanner Engine</span>
                    <span className="text-slate-200">{selectedFinding.tool_source ?? "ZAP / Nuclei"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">OWASP Mapping</span>
                    <span className="text-slate-200">{selectedFinding.owasp_category ?? "CWE-Configuration"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Scanner Confidence</span>
                    <span className="text-slate-200">{selectedFinding.confidence ?? "High"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Retest Status</span>
                    <span className="text-slate-200 uppercase">{formatRetestStatus(selectedFinding.retest_status)}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: RECOMMENDED REMEDIATION (Structured Full-Width) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Recommended Remediation
                </span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-300">
                  {normalizeRemediationSteps(selectedFinding).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: AI-RECOMMENDED FIX & CURSOR PROMPT (IDE & Ticketing Ready) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                    <Bot className="h-4 w-4" />
                    AI-Recommended Fix & IDE Prompt
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText("issue_md", buildIssueMarkdownBody(selectedFinding, targetUrl))}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                      title="Copy issue formatted for Jira / Linear / GitHub"
                    >
                      {copiedItemId === "issue_md" ? <Check className="h-3 w-3 text-emerald-400" /> : <FileText className="h-3 w-3" />}
                      <span>{copiedItemId === "issue_md" ? "Copied Issue" : "Copy Ticket MD"}</span>
                    </button>
                    <button
                      onClick={() => handleCopyText("prompt", buildCursorPrompt(selectedFinding, targetUrl))}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                    >
                      {copiedItemId === "prompt" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedItemId === "prompt" ? "Copied" : "Copy Fix Prompt"}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-black p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono text-slate-400">
                      Paste this instruction directly into Cursor, Claude Code, Windsurf, or Antigravity:
                    </p>
                    {/* 1-Click Ticketing Links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={buildGitHubIssueUrl(selectedFinding, targetUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors"
                      >
                        <span>GitHub Issue</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      <a
                        href={buildLinearIssueUrl(selectedFinding, targetUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors"
                      >
                        <span>Linear</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {buildCursorPrompt(selectedFinding, targetUrl)}
                  </pre>

                  {/* Remediation Code Snippet if Available */}
                  {selectedFinding.fix_suggestion && selectedFinding.fix_suggestion.includes("```") ? (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                        Code Example / Directive
                      </span>
                      <pre className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                        {extractCodeSnippet(selectedFinding.fix_suggestion)}
                      </pre>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* SECTION: FIX STATUS LIFECYCLE STEPPER */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  Vulnerability Lifecycle
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    1. OPEN
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    2. FIX APPLIED
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    3. RE-SCAN
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    manualFixedMap[selectedFinding.id] || selectedFinding.retest_status === "fixed"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}>
                    4. VERIFIED
                  </div>
                </div>
              </div>
            </div>

            {/* IDE Dispatch Toast Notification */}
            {ideDispatchStatus ? (
              <div className="bg-emerald-950/90 border-t border-emerald-500/40 px-6 py-2 flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in duration-150">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {ideDispatchStatus}
                </span>
                <span className="text-[10px] text-emerald-400/80">Ready to paste</span>
              </div>
            ) : null}

            {/* Drawer Bottom Footer Actions */}
            <div className="sticky bottom-0 z-20 bg-[#0B0F19]/95 backdrop-blur-md border-t border-slate-800 p-4 px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setManualFixedMap((prev) => ({
                      ...prev,
                      [selectedFinding.id]: !prev[selectedFinding.id],
                    }));
                  }}
                  className="h-9 rounded-lg font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" />
                  {manualFixedMap[selectedFinding.id] ? "Mark as Open" : "Mark as Fixed"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRiskModalOpen(true)}
                  className="h-9 rounded-lg font-mono text-xs uppercase tracking-wider bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-amber-300 cursor-pointer"
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                  Accept Risk
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleIdeDispatch("cursor")}
                  className="h-9 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Send to Cursor
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => handleCopyText("prompt", buildCursorPrompt(selectedFinding, targetUrl))}
                  className="h-9 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  {copiedItemId === "prompt" ? "Copied Fix Prompt!" : "Copy Fix Prompt"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modals & Drawers */}
      <ScoreBreakdownModal
        isOpen={isScoreBreakdownOpen}
        onClose={() => setIsScoreBreakdownOpen(false)}
        currentScore={severity.score}
        findings={rawFindings}
        onSelectFinding={(id) => {
          setSelectedFindingId(id);
          setIsScoreBreakdownOpen(false);
        }}
      />

      <ScanComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        comparison={comparisonQuery.data ?? null}
        currentFindings={rawFindings}
        onSelectFinding={(id) => {
          setSelectedFindingId(id);
          setIsComparisonModalOpen(false);
        }}
      />

      {selectedFinding ? (
        <RiskAcceptanceModal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          findingId={selectedFinding.id}
          findingTitle={selectedFinding.title}
          findingSeverity={selectedFinding.severity}
          onAcceptRisk={handleAcceptRisk}
        />
      ) : null}

      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        scanId={scanId}
        targetUrl={targetUrl}
        score={severity.score}
      />
    </main>
  );
}

// -------------------------------------------------------------
// HELPER COMPONENTS
// -------------------------------------------------------------

function SeverityOverviewCard({
  label,
  count,
  colorClass,
  active,
  onClick,
}: {
  label: string;
  count: number;
  colorClass: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${colorClass} ${
        active ? "ring-2 ring-emerald-400 shadow-lg scale-[1.02]" : "opacity-90 hover:opacity-100"
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest block font-bold opacity-80">
        {label}
      </span>
      <div className="font-mono text-2xl sm:text-3xl font-black mt-1 tracking-tight">
        {count}
      </div>
    </button>
  );
}

function AttackSurfaceCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-[10px] font-mono uppercase tracking-wider block font-bold truncate">{label}</span>
        {icon}
      </div>
      <div className="text-sm sm:text-base font-bold font-mono text-slate-200 truncate">
        {value}
      </div>
    </div>
  );
}

function LiveScanningStation({
  scan,
  progressValue,
  targetUrl,
}: {
  scan: ScanDetail;
  progressValue: number;
  targetUrl: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-10 shadow-2xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Dynamic Security Audit in Progress
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight truncate">
            Target: {targetUrl}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Running automated crawlers, OWASP DAST probes, and Nuclei vulnerability signatures...
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end justify-center">
          <div className="text-4xl font-mono font-black text-emerald-400">
            {progressValue}%
          </div>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            Pipeline Completion
          </span>
        </div>
      </div>

      <Progress value={progressValue} className="h-2.5 bg-slate-900" />

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <PipelineStage label="1. DNS & Safe Harbor" active={progressValue >= 5} done={progressValue >= 25} />
        <PipelineStage label="2. OWASP ZAP 2.15 Spider" active={progressValue >= 25} done={progressValue >= 50} />
        <PipelineStage label="3. Nuclei CVE Engine" active={progressValue >= 50} done={progressValue >= 75} />
        <PipelineStage label="4. Secrets & API Audit" active={progressValue >= 75} done={progressValue >= 90} />
        <PipelineStage label="5. Gemini AI Synthesis" active={progressValue >= 90} done={progressValue === 100} />
      </div>
    </div>
  );
}

function PipelineStage({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`p-3 rounded-xl border font-mono text-xs transition-all ${
      done
        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-bold"
        : active
          ? "bg-slate-900 border-slate-700 text-white animate-pulse"
          : "bg-slate-950/40 border-slate-900 text-slate-600"
    }`}>
      <div className="flex items-center justify-between">
        <span className="truncate">{label}</span>
        {done ? <Check className="h-3 w-3 text-emerald-400" /> : null}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DATA FORMATTING & CALCULATION HELPERS
// -------------------------------------------------------------

function extractPrimaryUrl(scan: ScanDetail | undefined, domains: DomainResponse[] | undefined): string {
  if (!scan) return "Target Domain";
  if (scan.domain_id && domains) {
    const matched = domains.find((d) => d.id === scan.domain_id);
    if (matched?.domain_url) return matched.domain_url;
  }
  const meta = scan.scan_metadata as Record<string, any> | undefined;
  if (meta?.target_url) return meta.target_url;
  const raw = scan.raw_results as Record<string, any> | undefined;
  if (raw?.target_url) return raw.target_url;
  return `Target (${scan.id.slice(0, 8)})`;
}

function extractPagesCrawled(scan: ScanDetail | undefined): number {
  if (!scan?.raw_results) return 1;
  const raw = scan.raw_results as Record<string, any>;
  const scope = raw.scope as Record<string, any> | undefined;
  const coverage = raw.coverage as Record<string, any> | undefined;
  return Number(coverage?.pages_crawled ?? scope?.pages_crawled ?? 1);
}

function extractAuthRoutesCount(scan: ScanDetail | undefined): number {
  if (!scan?.raw_results) return 0;
  const raw = scan.raw_results as Record<string, any>;
  const coverage = raw.coverage as Record<string, any> | undefined;
  return Number(coverage?.authenticated_routes_reached ?? 0);
}

function extractApisObserved(scan: ScanDetail | undefined): number {
  if (!scan?.raw_results) return 0;
  const raw = scan.raw_results as Record<string, any>;
  const coverage = raw.coverage as Record<string, any> | undefined;
  return Number(coverage?.apis_observed ?? 0);
}

function extractJsAssets(scan: ScanDetail | undefined): number {
  if (!scan?.raw_results) return 1;
  const raw = scan.raw_results as Record<string, any>;
  const coverage = raw.coverage as Record<string, any> | undefined;
  return Number(coverage?.js_assets_analyzed ?? 1);
}

function getPriorityCallout(severity: string): string {
  switch (severity) {
    case "critical":
      return "Fix immediately — launch blocker.";
    case "high":
      return "Fix before production rollout.";
    case "medium":
      return "Address in the next security sprint.";
    case "low":
      return "Recommended hardening gap.";
    default:
      return "Informational observation.";
  }
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function severityVariantForFinding(severity: string): "critical" | "high" | "medium" | "low" | "secondary" {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "secondary";
  }
}

function formatRetestStatus(status?: string | null): string {
  if (!status) return "Open";
  return status.replace("_", " ");
}

function formatScanTimestamp(scan: ScanDetail | undefined): string {
  if (!scan?.created_at) return "Just now";
  return new Date(scan.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayScanModeLabel(mode: string | undefined): string {
  if (!mode) return "Public Scan";
  return mode.replace("_", " ").toUpperCase();
}

function displayPlanName(plan: string | undefined): string {
  if (!plan) return "Free";
  const normalized = plan.toLowerCase().trim();
  if (normalized === "vit_pro" || normalized === "vit_proo" || normalized === "vit_pro_plan") return "VIT Pro";
  if (normalized === "vit_free" || normalized === "vit_campus") return "VIT Free";
  if (normalized === "starter") return "Starter";
  if (normalized === "pro") return "Pro";
  if (normalized === "agency") return "Agency";
  if (normalized === "custom") return "Enterprise";
  return plan.replace(/_/g, " ").toUpperCase();
}

function fallbackBusinessImpact(finding: Finding): string {
  return `This ${finding.severity} finding affects application hardening and user trust if exploited by an attacker.`;
}

function normalizeRemediationSteps(finding: Finding): string[] {
  if (finding.remediation_steps && finding.remediation_steps.length > 0) {
    return finding.remediation_steps;
  }
  if (finding.fix_suggestion) {
    const text = finding.fix_suggestion.replace(/```[\s\S]*?```/g, "").trim();
    const parts = text.split("\n").map((p) => p.trim()).filter((p) => p.length > 5);
    if (parts.length > 0) return parts.slice(0, 3);
  }
  return ["Review the target server configuration and enforce strict security headers and input sanitization."];
}

function formatRawEvidence(finding: Finding): string {
  if (finding.evidence) {
    return JSON.stringify(finding.evidence, null, 2);
  }
  if (finding.evidence_summary) {
    return finding.evidence_summary;
  }
  return `Target: ${finding.affected_url ?? "Root"}\nScanner: ${finding.tool_source ?? "DAST"}\nConfidence: ${finding.confidence ?? "High"}`;
}

function extractCodeSnippet(fixSuggestion: string | null): string {
  if (!fixSuggestion) return "";
  const match = fixSuggestion.match(/```(?:[a-z0-9_-]+)?\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  return fixSuggestion;
}

function buildCursorPrompt(finding: Finding, targetUrl: string): string {
  const steps = normalizeRemediationSteps(finding).join("; ");
  return `Review the component/file at "${finding.affected_url ?? targetUrl}" and resolve the "${finding.title}" (${finding.severity.toUpperCase()}) vulnerability by applying these fixes: ${steps}. Ensure no regressions or broken functionality.`;
}

function buildSeverityState(scan: ScanDetail | undefined) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  if (scan?.findings) {
    for (const f of scan.findings) {
      if (f.severity in counts) counts[f.severity]++;
    }
  }
  const score = scan?.severity_summary?.risk_score !== undefined
    ? Math.max(0, 100 - Number(scan.severity_summary.risk_score))
    : ((scan as any)?.unified_security_score ?? 62);

  let label: "Low" | "Medium" | "High" | "Critical" = "Medium";
  let badgeVariant: "success" | "medium" | "high" | "critical" = "medium";

  if (counts.critical > 0 || score < 40) {
    label = "Critical";
    badgeVariant = "critical";
  } else if (counts.high > 0 || score < 60) {
    label = "High";
    badgeVariant = "high";
  } else if (counts.medium > 0 || score < 80) {
    label = "Medium";
    badgeVariant = "medium";
  } else {
    label = "Low";
    badgeVariant = "success";
  }

  return { counts, score, label, badgeVariant };
}

function buildSummarySections(scan: ScanDetail | undefined, severity: any) {
  return {
    overallRisk: `Overall launch security health evaluates to ${severity.score}/100 with ${severity.counts.critical} critical, ${severity.counts.high} high, and ${severity.counts.medium} medium findings.`,
    whatMattersMost: "Focus on internet-facing security headers, CORS policies, and subresource integrity checks.",
    whatToFixFirst: scan?.findings?.slice(0, 3).map((f) => f.title) ?? [],
    quickWins: ["Add X-Frame-Options: DENY", "Add Content-Security-Policy", "Add Strict-Transport-Security"],
  };
}
