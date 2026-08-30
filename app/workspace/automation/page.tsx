"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ArrowLeft,
  CheckCircle2,
  Github,
  Info,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Save,
  Send,
  ShieldCheck,
  ExternalLink,
  X,
  Bell,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { firebaseAuth } from "@/lib/firebase";
import { EmbeddableTrustBadge } from "@/components/embeddable-trust-badge";
import { getGitHubPolicy, testWebhookDispatcher, updateGitHubPolicy } from "@/lib/api";

const STORAGE_KEY = "hmw_automation_settings";

export default function AutomationHubPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"github" | "webhooks" | "trust_badge">("github");

  // GitHub App Connection States
  const [isConnected, setIsConnected] = useState(false);
  const [installationId, setInstallationId] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [appSlug, setAppSlug] = useState("hack-my-website");
  
  // Modal & Guide States
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [inputInstallationId, setInputInstallationId] = useState("");
  const [inputWebhookSecret, setInputWebhookSecret] = useState("");
  const [inputAppSlug, setInputAppSlug] = useState("hack-my-website");

  // CI/CD Settings
  const [mergeThreshold, setMergeThreshold] = useState(80);
  const [autoCreateIssues, setAutoCreateIssues] = useState(true);

  // Webhook States
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestMessage, setWebhookTestMessage] = useState<string | null>(null);

  // Save State
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Load saved settings from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.installationId) {
          setInstallationId(parsed.installationId);
          setIsConnected(true);
        }
        if (parsed.webhookSecret) setWebhookSecret(parsed.webhookSecret);
        if (parsed.appSlug) setAppSlug(parsed.appSlug);
        if (typeof parsed.mergeThreshold === "number") setMergeThreshold(parsed.mergeThreshold);
        if (typeof parsed.autoCreateIssues === "boolean") setAutoCreateIssues(parsed.autoCreateIssues);
        if (parsed.slackWebhookUrl) setSlackWebhookUrl(parsed.slackWebhookUrl);
        if (parsed.discordWebhookUrl) setDiscordWebhookUrl(parsed.discordWebhookUrl);
      }
    } catch (e) {
      console.error("Failed to load automation settings from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const idToken = await user.getIdToken();
        setToken(idToken);

        // Fetch saved policies from server database
        try {
          const serverPolicy = await getGitHubPolicy(idToken);
          if (serverPolicy) {
            if (typeof serverPolicy.min_launch_score === "number") {
              setMergeThreshold(serverPolicy.min_launch_score);
            }
            if (typeof serverPolicy.auto_create_issues === "boolean") {
              setAutoCreateIssues(serverPolicy.auto_create_issues);
            }
            if (serverPolicy.installation_id) {
              setInstallationId(serverPolicy.installation_id);
              setIsConnected(true);
            }
            if (serverPolicy.app_slug) {
              setAppSlug(serverPolicy.app_slug);
            }
            if (serverPolicy.slack_webhook_url) {
              setSlackWebhookUrl(serverPolicy.slack_webhook_url);
            }
            if (serverPolicy.discord_webhook_url) {
              setDiscordWebhookUrl(serverPolicy.discord_webhook_url);
            }
          }
        } catch (err) {
          console.warn("Could not fetch remote GitHub policy, using local storage fallback", err);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveAllSettings = async () => {
    setSavingSettings(true);
    setSaveSuccessMessage(null);

    const payload = {
      installationId,
      webhookSecret,
      appSlug,
      mergeThreshold,
      autoCreateIssues,
      slackWebhookUrl,
      discordWebhookUrl,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    try {
      if (token) {
        await updateGitHubPolicy(token, {
          min_launch_score: mergeThreshold,
          auto_create_issues: autoCreateIssues,
          installation_id: installationId || null,
          webhook_secret: webhookSecret || null,
          app_slug: appSlug || "hack-my-website",
          slack_webhook_url: slackWebhookUrl || null,
          discord_webhook_url: discordWebhookUrl || null,
        });
      }
      setSaveSuccessMessage("Automation and CI/CD policies saved and synced successfully!");
    } catch (e) {
      setSaveSuccessMessage(`Saved locally (Sync warning: ${e instanceof Error ? e.message : "Network error"})`);
    } finally {
      setSavingSettings(false);
      setTimeout(() => setSaveSuccessMessage(null), 4500);
    }
  };

  const handleConnectSave = async () => {
    if (!inputInstallationId.trim()) return;
    const instId = inputInstallationId.trim();
    const secret = inputWebhookSecret.trim();
    const slug = inputAppSlug.trim() || "hack-my-website";

    setInstallationId(instId);
    setWebhookSecret(secret);
    setAppSlug(slug);
    setIsConnected(true);
    setShowConnectModal(false);

    const existing = localStorage.getItem(STORAGE_KEY);
    const parsed = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...parsed,
        installationId: instId,
        webhookSecret: secret,
        appSlug: slug,
      })
    );

    if (token) {
      try {
        await updateGitHubPolicy(token, {
          min_launch_score: mergeThreshold,
          auto_create_issues: autoCreateIssues,
          installation_id: instId,
          webhook_secret: secret || null,
          app_slug: slug,
        });
      } catch (err) {
        console.error("Failed to sync GitHub connection to database", err);
      }
    }
  };

  const handleDisconnect = async () => {
    if (confirm("Disconnect this GitHub App installation? PR security checks will pause.")) {
      setIsConnected(false);
      setInstallationId("");
      setWebhookSecret("");

      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        delete parsed.installationId;
        delete parsed.webhookSecret;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      if (token) {
        try {
          await updateGitHubPolicy(token, {
            min_launch_score: mergeThreshold,
            auto_create_issues: autoCreateIssues,
            installation_id: null,
            webhook_secret: null,
          });
        } catch (err) {
          console.error("Failed to clear installation from database", err);
        }
      }
    }
  };

  const handleTestWebhook = async (type: "slack" | "discord") => {
    const url = type === "slack" ? slackWebhookUrl.trim() : discordWebhookUrl.trim();
    if (!url) {
      setWebhookTestMessage(`Please enter a valid ${type === "slack" ? "Slack" : "Discord"} webhook URL first.`);
      return;
    }

    setTestingWebhook(true);
    setWebhookTestMessage(null);

    try {
      if (!token) {
        throw new Error("You must be signed in to dispatch test alerts.");
      }

      const res = await testWebhookDispatcher({
        token,
        webhookUrl: url,
        channelType: type,
      });

      setWebhookTestMessage(`${res.message || `Test alert dispatched to ${type === "slack" ? "Slack" : "Discord"} successfully!`}`);
    } catch (e) {
      setWebhookTestMessage(`Webhook delivery failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setTestingWebhook(false);
      setTimeout(() => setWebhookTestMessage(null), 6000);
    }
  };

  const handleSignOut = async () => {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-6 text-slate-300">
        <Card className="p-8 rounded-2xl border border-slate-800 bg-[#0B0F19] text-center space-y-3">
          <LoaderCircle className="size-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-xs font-mono">Loading Automation Hub & CI/CD policies...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 flex flex-col antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b241c] via-[#080f19] to-[#04060b]">
      
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
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CI/CD Hub READY</span>
            </div>
          </div>

          {/* Center Navigation Tab Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
            <Link
              href="/workspace"
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
            >
              <LayoutDashboard className="size-3.5 shrink-0" />
              <span>Workspace Overview</span>
            </Link>

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
              <span>GitHub CI/CD Gate</span>
              {isConnected && <span className="size-2 rounded-full bg-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("webhooks")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "webhooks"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <Bell className="size-3.5 shrink-0" />
              <span>Slack & Discord Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("trust_badge")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "trust_badge"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <ShieldCheck className="size-3.5 shrink-0" />
              <span>Trust Badge</span>
            </button>
          </nav>

          {/* Right Action Controls & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleSaveAllSettings}
              disabled={savingSettings}
              className="h-8 px-3 rounded-xl font-mono uppercase tracking-wider text-[11px] bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-sm shadow-emerald-500/20"
            >
              {savingSettings ? <LoaderCircle className="size-3.5 animate-spin mr-1" /> : <Save className="size-3.5 mr-1" />}
              Save Policies
            </Button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                {userEmail ? userEmail[0].toUpperCase() : "U"}
              </div>
              <span className="font-bold text-white truncate max-w-[100px] hidden lg:inline">
                {userEmail ?? "User"}
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

      {/* MAIN CANVAS */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16 space-y-8">

        {/* Body Content */}
        <div className="max-w-6xl w-full mx-auto px-6 sm:px-8 pt-8 space-y-8 text-left">
          
          {saveSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 font-mono font-bold">
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* GITHUB APP TAB */}
          {activeTab === "github" && (
            <div className="space-y-8">
              <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white shrink-0">
                      <Github className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Official GitHub App Integration</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Connect Hack My Website to your GitHub organization to run security check suites on pull requests.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {isConnected ? (
                      <>
                        <Badge variant="success" className="px-3 py-1 text-xs font-mono font-bold">
                          ● Connected
                        </Badge>
                        <Button
                          variant="outline"
                          onClick={handleDisconnect}
                          className="h-9 rounded-xl text-xs border-rose-500/30 text-rose-400 hover:bg-rose-950/30"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setInputInstallationId(installationId);
                          setInputWebhookSecret(webhookSecret);
                          setInputAppSlug(appSlug);
                          setShowConnectModal(true);
                        }}
                        className="h-10 px-5 rounded-xl font-mono uppercase tracking-wider text-xs bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                      >
                        Connect GitHub App
                      </Button>
                    )}
                  </div>
                </div>

                {isConnected && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500">Installation ID:</span>{" "}
                      <span className="text-emerald-400 font-bold">{installationId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">App Slug:</span>{" "}
                      <span className="text-white font-bold">{appSlug}</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* CI/CD Gate Policy Controls */}
              <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">PR Merge Gate & Score Threshold</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure automated security gates to block unsafe pull requests before they reach staging or production.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold font-mono uppercase text-slate-300">
                        Minimum Required AI Launch Score:
                      </label>
                      <span className="text-xl font-extrabold font-mono text-emerald-400">
                        {mergeThreshold}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={mergeThreshold}
                      onChange={(e) => setMergeThreshold(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white">Auto-Create GitHub Issues for Findings</div>
                      <p className="text-xs text-slate-400">
                        Automatically create issues with Claude/Cursor fix suggestions for Critical and High vulnerabilities.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoCreateIssues(!autoCreateIssues)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${autoCreateIssues ? "bg-emerald-500" : "bg-slate-800"}`}
                    >
                      <div className={`size-4 rounded-full bg-white transition-transform ${autoCreateIssues ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* WEBHOOKS TAB */}
          {activeTab === "webhooks" && (
            <div className="space-y-8">
              <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Incident & Audit Dispatchers</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Receive instant notifications in your developer chat channels when audits complete or vulnerabilities are detected.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white font-mono">Slack Incoming Webhook URL</span>
                      <Button
                        variant="outline"
                        onClick={() => handleTestWebhook("slack")}
                        disabled={testingWebhook || !slackWebhookUrl.trim()}
                        className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                      >
                        <Send className="size-3.5 mr-1.5 text-emerald-400" />
                        Send Test Alert
                      </Button>
                    </div>
                    <Input
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                      className="h-11 rounded-xl border-slate-800 bg-[#06080D] text-xs text-white placeholder:text-slate-600 font-mono"
                    />
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white font-mono">Discord Channel Webhook URL</span>
                      <Button
                        variant="outline"
                        onClick={() => handleTestWebhook("discord")}
                        disabled={testingWebhook || !discordWebhookUrl.trim()}
                        className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                      >
                        <Send className="size-3.5 mr-1.5 text-emerald-400" />
                        Send Test Alert
                      </Button>
                    </div>
                    <Input
                      value={discordWebhookUrl}
                      onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/12345/XXXX"
                      className="h-11 rounded-xl border-slate-800 bg-[#06080D] text-xs text-white placeholder:text-slate-600 font-mono"
                    />
                  </div>
                </div>

                {webhookTestMessage && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                    {webhookTestMessage}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TRUST BADGE TAB */}
          {activeTab === "trust_badge" && (
            <div className="space-y-8">
              <Card className="rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Embeddable Safe Harbor Trust Badge</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Display real-time security verification and your AI Launch Score directly on your SaaS landing page or app footer.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">Live Badge Preview</div>
                  <div className="flex justify-center p-6 bg-[#06080D] rounded-xl border border-slate-800">
                    <EmbeddableTrustBadge domainName="hackmywebsite.io" securityScore={92} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">HTML Embed Code</div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                    {`<a href="https://hackmywebsite.io" target="_blank" rel="noopener noreferrer">\n  <img src="https://hackmywebsite.io/api/v1/badge/yourdomain.com" alt="Hack My Website Security Verified" />\n</a>`}
                  </pre>
                </div>
              </Card>
            </div>
          )}

        </div>
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
              <span>CI/CD ENGINE: 100% OPERATIONAL</span>
            </div>
          </div>

          {/* Right Navigation Links */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <Link href="/workspace" className="text-slate-400 hover:text-emerald-400 transition-colors">Workspace</Link>
            <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Landing Page</Link>
            <Link href="/sample-report" className="text-slate-400 hover:text-emerald-400 transition-colors">Sample Report</Link>
            <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <Card className="max-w-lg w-full rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Github className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect GitHub App CI/CD Gate</h3>
                  <p className="text-[11px] text-slate-400">Follow 3 quick steps to protect your pull requests</p>
                </div>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    Step 1: Install Official GitHub App
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-400">
                    Required
                  </Badge>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Install the official <strong>HackMyWebsite Security Gate</strong> app on your target organization or repository.
                </p>
                <a
                  href="https://github.com/apps/hackmywebsite-security-gate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:text-white text-xs font-mono font-bold transition-all"
                >
                  <span>Open GitHub App Installation Page</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px] block">
                  Step 2: Enter Installation ID
                </span>
                <Input
                  value={inputInstallationId}
                  onChange={(e) => setInputInstallationId(e.target.value.trim())}
                  placeholder="e.g. 154714995"
                  className="h-10 rounded-xl border-slate-800 bg-[#06080D] text-white font-mono text-xs"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px] block">
                  Step 3: Webhook Verification Secret
                </span>
                <Input
                  type="password"
                  value={inputWebhookSecret}
                  onChange={(e) => setInputWebhookSecret(e.target.value.trim())}
                  placeholder="e.g. hmw_secret_key_2026"
                  className="h-10 rounded-xl border-slate-800 bg-[#06080D] text-white font-mono text-xs"
                />
                <div className="pt-1 text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                  <Info className="size-3 text-slate-400 shrink-0" />
                  <span>Payload URL: <code className="text-slate-300">https://hackmywebsite.io/api/v1/webhooks/github</code></span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="outline" onClick={() => setShowConnectModal(false)} className="h-10 text-xs border-slate-700 text-slate-300">
                Cancel
              </Button>
              <Button onClick={handleConnectSave} className="h-10 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md">
                Save & Connect Repository
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
