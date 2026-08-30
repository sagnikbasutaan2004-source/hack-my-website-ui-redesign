"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ArrowLeft,
  BarChart3,
  Clock3,
  Globe,
  ListChecks,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UsersRound,
  LayoutDashboard,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  Layers,
  Activity,
  Cpu,
  Server,
  Zap,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthForm } from "@/components/auth-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { firebaseAuth, persistenceReady } from "@/lib/firebase";
import { getAdminOverview, updateWaitlistStatus, updateUserPlan, type AdminOverviewResponse } from "@/lib/api";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() || "";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [viewerLabel, setViewerLabel] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    persistenceReady.then(() => {
      if (cancelled || !firebaseAuth) return;
      unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (!user) {
          setToken(null);
          setViewerLabel(null);
          setAuthReady(true);
          return;
        }
        setToken(await user.getIdToken());
        setViewerLabel(user.email || user.displayName || user.uid);
        setAuthReady(true);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const overviewQuery = useQuery({
    queryKey: ["admin-overview", token],
    enabled: Boolean(token),
    queryFn: () => getAdminOverview(token ?? ""),
  });

  const isAdminEmail = Boolean(ADMIN_EMAIL && viewerLabel?.toLowerCase() === ADMIN_EMAIL);
  const overview = overviewQuery.data;

  const handleSignOut = async () => {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 flex flex-col antialiased">
      {!authReady ? (
        <CenteredStatus message="Verifying secure admin authorization..." />
      ) : !token ? (
        <AuthForm />
      ) : overviewQuery.isLoading ? (
        <CenteredStatus message="Retrieving real-time SOC metrics and telemetry..." />
      ) : overviewQuery.isError ? (
        <AccessDenied message={overviewQuery.error instanceof Error ? overviewQuery.error.message : "Administrative privileges required."} />
      ) : overview ? (
        <AdminConsole overview={overview} token={token ?? ""} refetch={() => overviewQuery.refetch()} viewerLabel={viewerLabel} onSignOut={handleSignOut} isAdminEmail={isAdminEmail} />
      ) : null}
    </div>
  );
}

function CenteredStatus({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <LoaderCircle className="size-8 animate-spin text-emerald-400 mx-auto" />
        <p className="text-sm font-mono text-slate-300">{message}</p>
      </Card>
    </div>
  );
}

function AccessDenied({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <Card className="rounded-3xl border border-rose-500/30 bg-[#0B0F19] p-8 max-w-lg w-full text-left space-y-6 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
          <ShieldAlert className="size-4" />
          <span>Access Restricted</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
        <Button asChild className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs">
          <Link href="/workspace">
            <ArrowLeft className="size-4 mr-2" />
            Return to User Workspace
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function AdminConsole({
  overview,
  token,
  refetch,
  viewerLabel,
  onSignOut,
  isAdminEmail,
}: {
  overview: AdminOverviewResponse;
  token: string;
  refetch: () => void;
  viewerLabel: string | null;
  onSignOut: () => Promise<void>;
  isAdminEmail: boolean;
}) {
  const [activeAdminTab, setActiveAdminTab] = useState<"overview" | "users" | "waitlist" | "scans" | "health">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [waitlistSearch, setWaitlistSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const scanStatuses = useMemo(() => Object.entries(overview.scans_by_status), [overview.scans_by_status]);
  const planCounts = useMemo(() => Object.entries(overview.users_by_plan), [overview.users_by_plan]);

  const filteredUsers = useMemo(() => {
    return overview.recent_users.filter((user) =>
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.plan.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [overview.recent_users, userSearch]);

  const filteredWaitlist = useMemo(() => {
    return overview.recent_waitlist.filter((lead) =>
      lead.email.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
      lead.name.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(waitlistSearch.toLowerCase()))
    );
  }, [overview.recent_waitlist, waitlistSearch]);

  const handleApproveWaitlist = async (leadId: string) => {
    if (!token) return;
    setUpdatingId(leadId);
    try {
      await updateWaitlistStatus({ token, leadId, status: "approved" });
      refetch();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to approve waitlist lead.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectWaitlist = async (leadId: string) => {
    if (!token) return;
    setUpdatingId(leadId);
    try {
      await updateWaitlistStatus({ token, leadId, status: "pending" });
      refetch();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateUserPlan = async (userId: string, plan: string) => {
    if (!token) return;
    setUpdatingId(userId);
    try {
      await updateUserPlan({ token, userId, plan });
      refetch();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update user plan.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* ========================================================================= */}
      {/* UNIFIED SINGLE ADMIN TOP NAVIGATION HEADER                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-[1850px] w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left Brand Logo & SOC Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <img src="/logo.png" alt="Logo" className="h-6 sm:h-7 max-h-7 w-auto object-contain" />
            </Link>
            <Badge variant="critical" className="font-mono text-[9px] uppercase tracking-wider hidden sm:inline-block">
              Admin SOC
            </Badge>
          </div>

          {/* Center Navigation Tab Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
            <button
              type="button"
              onClick={() => setActiveAdminTab("overview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAdminTab === "overview"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <LayoutDashboard className="size-3.5 shrink-0" />
              <span>Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("users")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAdminTab === "users"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <UsersRound className="size-3.5 shrink-0" />
              <span>Users ({overview.total_users})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("waitlist")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAdminTab === "waitlist"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Mail className="size-3.5 shrink-0" />
              <span>Waitlist ({overview.waitlist_total})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("scans")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAdminTab === "scans"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Activity className="size-3.5 shrink-0" />
              <span>Audits ({overview.total_scans})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("health")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAdminTab === "health"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Server className="size-3.5 shrink-0" />
              <span>Health</span>
            </button>
          </nav>

          {/* Right Action Controls & Admin Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="h-8 rounded-xl text-xs font-semibold border-slate-700 text-slate-300 hover:text-white bg-slate-900">
              <Link href="/workspace">
                <ArrowLeft className="size-3.5 mr-1" />
                <span className="hidden sm:inline">User Workspace</span>
              </Link>
            </Button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="size-5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                {viewerLabel ? viewerLabel[0].toUpperCase() : "A"}
              </div>
              <span className="font-bold text-white truncate max-w-[100px] hidden lg:inline">
                {viewerLabel ?? "Admin"}
              </span>
              <button
                type="button"
                onClick={onSignOut}
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
      {/* ADMIN MAIN CANVAS                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16 space-y-8">

        {/* Content Body */}
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 pt-8 space-y-8 text-left">
          
          {/* ========================================================================= */}
          {/* 1. OVERVIEW TAB                                                           */}
          {/* ========================================================================= */}
          {activeAdminTab === "overview" && (
            <div className="space-y-8">
              
              {/* 5 Dense Metric KPI Cards */}
              <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                    <span>Total Users</span>
                    <UsersRound className="size-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white">{overview.total_users}</div>
                  <p className="text-[11px] text-slate-400">Authenticated accounts</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                    <span>Waitlist Leads</span>
                    <Mail className="size-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-amber-400">{overview.waitlist_total}</div>
                  <p className="text-[11px] text-slate-400">Organic marketing leads</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                    <span>Targets Registered</span>
                    <Globe className="size-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white">{overview.total_domains}</div>
                  <p className="text-[11px] text-slate-400"><strong className="text-emerald-400">{overview.verified_domains}</strong> verified Safe Harbor</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                    <span>Total Audits</span>
                    <ListChecks className="size-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white">{overview.total_scans}</div>
                  <p className="text-[11px] text-slate-400">Executed pipeline audits</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
                    <span>Plan Categories</span>
                    <BarChart3 className="size-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">{planCounts.length}</div>
                  <p className="text-[11px] text-slate-400">Active commercial tiers</p>
                </div>
              </section>

              {/* Distributions Grid */}
              <section className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg text-white font-bold">Commercial Plan Distribution</CardTitle>
                    <CardDescription className="text-xs text-slate-400">Live breakdown of active subscriptions across tiers</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3 pt-2">
                    {planCounts.map(([plan, count]) => {
                      const pct = overview.total_users > 0 ? (count / overview.total_users) * 100 : 0;
                      return (
                        <div key={plan} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300 font-bold uppercase">{displayPlan(plan)}</span>
                            <span className="text-emerald-400 font-bold">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg text-white font-bold">Scan Execution Status</CardTitle>
                    <CardDescription className="text-xs text-slate-400">Real-time status throughput across the scanning cluster</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3 pt-2">
                    {scanStatuses.map(([status, count]) => {
                      const pct = overview.total_scans > 0 ? (count / overview.total_scans) * 100 : 0;
                      return (
                        <div key={status} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300 font-bold capitalize">{status.replaceAll("_", " ")}</span>
                            <span className="text-white font-bold">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${
                                status === "completed" ? "bg-emerald-500" : status === "running" ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. USER DIRECTORY TAB                                                     */}
          {/* ========================================================================= */}
          {activeAdminTab === "users" && (
            <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl text-white font-bold">User Directory & Entitlements</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Inspect user accounts, usage quotas, and manage subscription tiers.</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="size-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by email or plan..."
                    className="h-10 pl-9 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                      <th className="pb-3 px-3">User Email</th>
                      <th className="pb-3 px-3">Current Plan</th>
                      <th className="pb-3 px-3">Monthly Usage</th>
                      <th className="pb-3 px-3">Joined Date</th>
                      <th className="pb-3 px-3 text-right">Modify Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-3 font-semibold text-white truncate max-w-[220px]">{user.email}</td>
                        <td className="py-4 px-3">
                          <Badge variant="secondary" className="font-mono text-[10px] uppercase">{displayPlan(user.plan)}</Badge>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-300">{user.scans_used_this_month} scans</td>
                        <td className="py-4 px-3 font-mono text-slate-500">{formatDate(user.created_at)}</td>
                        <td className="py-4 px-3 text-right">
                          <select
                            value={user.plan}
                            disabled={updatingId === user.id}
                            onChange={(e) => handleUpdateUserPlan(user.id, e.target.value)}
                            className="h-8 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs font-semibold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="free">Starter</option>
                            <option value="pro">Pro</option>
                            <option value="agency">Agency</option>
                            <option value="custom">Custom</option>
                            <option value="vit_free">VIT Free</option>
                            <option value="vit_pro">VIT Pro</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ========================================================================= */}
          {/* 3. WAITLIST CRM TAB                                                       */}
          {/* ========================================================================= */}
          {activeAdminTab === "waitlist" && (
            <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl text-white font-bold">Waitlist Leads CRM ({overview.waitlist_total})</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Review inbound founder signups and approve platform access.</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="size-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={waitlistSearch}
                    onChange={(e) => setWaitlistSearch(e.target.value)}
                    placeholder="Search name, email, company..."
                    className="h-10 pl-9 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                      <th className="pb-3 px-3">Lead Contact</th>
                      <th className="pb-3 px-3">Company / URL</th>
                      <th className="pb-3 px-3">Interested Tier</th>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredWaitlist.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-3">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{lead.email}</div>
                        </td>
                        <td className="py-4 px-3 text-slate-300">
                          <div>{lead.company || "—"}</div>
                          {lead.website && <span className="text-emerald-400 font-mono text-[11px]">{lead.website}</span>}
                        </td>
                        <td className="py-4 px-3">
                          <Badge variant="secondary" className="font-mono text-[10px] uppercase">{lead.interested_plan}</Badge>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-500">{formatDate(lead.created_at)}</td>
                        <td className="py-4 px-3 text-right space-x-2">
                          <Button
                            onClick={() => handleApproveWaitlist(lead.id)}
                            disabled={updatingId === lead.id}
                            className="h-8 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-3"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRejectWaitlist(lead.id)}
                            disabled={updatingId === lead.id}
                            className="h-8 text-xs font-bold border-slate-700 text-slate-400 hover:text-white px-3"
                          >
                            Pending
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ========================================================================= */}
          {/* 4. SCANS STREAM TAB                                                       */}
          {/* ========================================================================= */}
          {activeAdminTab === "scans" && (
            <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
              <div>
                <CardTitle className="text-2xl text-white font-bold">Recent Security Audits ({overview.recent_scans.length})</CardTitle>
                <CardDescription className="text-xs text-slate-400">Live stream of pipeline execution runs across the cluster.</CardDescription>
              </div>

              <div className="grid gap-3">
                {overview.recent_scans.map((scan) => (
                  <div key={scan.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">Scan {scan.id.slice(0, 8)}...</span>
                        <Badge variant={scan.status === "completed" ? "success" : scan.status === "running" ? "high" : "critical"}>
                          {scan.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">Mode: {scan.scan_mode} • Date: {formatDate(scan.created_at)}</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs text-slate-400">AI Launch Score</div>
                      <div className="text-lg font-extrabold text-amber-400">{scan.risk_score !== null ? `${scan.risk_score}/100` : "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ========================================================================= */}
          {/* 5. ENGINE & WORKER HEALTH TAB                                             */}
          {/* ========================================================================= */}
          {activeAdminTab === "health" && (
            <Card className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
              <div>
                <CardTitle className="text-2xl text-white font-bold">Security Engines & Pipeline Telemetry</CardTitle>
                <CardDescription className="text-xs text-slate-400">Cluster worker health, crawler status, and vulnerability database feeds.</CardDescription>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">OWASP ZAP 2.15</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <p className="text-xs text-slate-400">DAST active fuzzer, Spider crawler, and Header policy engine.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Nuclei CVE Engine</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <p className="text-xs text-slate-400">200+ fast vulnerability templates, exposed admin surfaces, sensitive files.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Semgrep SAST</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Static secret token scanner, dependency vulnerabilities, API route review.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Celery Distributed Queue</span>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Redis broker queue depth: 0 backlog • Worker concurrency: 4 threads.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Gemini 2.5 AI Synthesis</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Executive plain-English summaries and Cursor/Claude fix prompt generation.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Static Scanner IP</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">168.144.94.35</span>
                  </div>
                  <p className="text-xs text-slate-400">Dedicated outbound scanner IP for customer Cloudflare/AWS WAF whitelisting.</p>
                </div>
              </div>
            </Card>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* AESTHETIC ADMIN FOOTER (LOGO-FREE & EMOJI-FREE)                          */}
      {/* ========================================================================= */}
      <footer className="border-t border-emerald-500/20 bg-gradient-to-b from-[#070A12] to-[#04060C] py-6 px-4 sm:px-8 mt-auto text-xs text-slate-400">
        <div className="max-w-[1850px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left Brand Textmark & SOC Live Status */}
          <div className="flex items-center gap-3.5">
            <span className="font-mono font-extrabold text-xs tracking-widest text-white uppercase">
              HACK MY WEBSITE
            </span>
            <div className="h-3 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400">
              <span className="size-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>SOC MONITORING: LIVE</span>
            </div>
          </div>

          {/* Right Navigation Links */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <Link href="/workspace" className="text-slate-400 hover:text-emerald-400 transition-colors">User Workspace</Link>
            <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Landing Page</Link>
            <Link href="/sample-report" className="text-slate-400 hover:text-emerald-400 transition-colors">Sample Report</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

function displayPlan(plan: string) {
  if (plan === "free") return "Starter";
  if (plan === "vit_free") return "VIT Free";
  if (plan === "vit_pro") return "VIT Pro";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}
