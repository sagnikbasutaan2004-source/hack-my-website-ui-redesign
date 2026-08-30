"use client";

import React, { useMemo, useState } from "react";
import {
  Globe,
  Lock,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Code2,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface GraphFinding {
  id: string;
  title: string;
  severity: string;
  affected_url?: string | null;
}

export interface AttackSurfaceGraphProps {
  targetUrl: string;
  findings: GraphFinding[];
  onSelectFindingUrl: (url: string) => void;
  selectedUrlFilter?: string | null;
}

interface EndpointNode {
  id: string;
  path: string;
  fullUrl: string;
  category: "public" | "auth" | "api" | "admin" | "asset";
  findings: GraphFinding[];
  highestSeverity: string | null;
}

export function AttackSurfaceGraph({
  targetUrl,
  findings,
  onSelectFindingUrl,
  selectedUrlFilter,
}: AttackSurfaceGraphProps) {
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  // Derive endpoint nodes from findings and standard discovery
  const nodes = useMemo<EndpointNode[]>(() => {
    const map = new Map<string, EndpointNode>();

    // Add root node
    map.set(targetUrl, {
      id: "root",
      path: "/",
      fullUrl: targetUrl,
      category: "public",
      findings: [],
      highestSeverity: null,
    });

    // Populate endpoints from findings
    findings.forEach((f) => {
      const url = f.affected_url || targetUrl;
      let path = "/";
      try {
        path = new URL(url).pathname || "/";
      } catch {
        path = url.replace(/https?:\/\/[^/]+/, "") || "/";
      }

      if (!map.has(url)) {
        let category: EndpointNode["category"] = "public";
        const lowerPath = path.toLowerCase();
        if (lowerPath.includes("auth") || lowerPath.includes("login") || lowerPath.includes("signup") || lowerPath.includes("session")) {
          category = "auth";
        } else if (lowerPath.includes("/api/") || lowerPath.includes("graphql") || lowerPath.includes("webhook")) {
          category = "api";
        } else if (lowerPath.includes("admin") || lowerPath.includes("portal") || lowerPath.includes("dashboard")) {
          category = "admin";
        } else if (lowerPath.includes(".js") || lowerPath.includes(".css") || lowerPath.includes("assets")) {
          category = "asset";
        }

        map.set(url, {
          id: url,
          path,
          fullUrl: url,
          category,
          findings: [],
          highestSeverity: null,
        });
      }

      const node = map.get(url)!;
      node.findings.push(f);

      const sevRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
      const currentHighest = node.highestSeverity ? sevRank[node.highestSeverity.toLowerCase()] || 0 : -1;
      const fRank = sevRank[f.severity.toLowerCase()] || 0;
      if (fRank > currentHighest) {
        node.highestSeverity = f.severity.toLowerCase();
      }
    });

    return Array.from(map.values());
  }, [targetUrl, findings]);

  const categories = [
    { key: "auth", label: "Auth & Identity", icon: Lock, color: "text-amber-400 border-amber-500/30 bg-amber-950/10" },
    { key: "api", label: "API & Data Routes", icon: Zap, color: "text-sky-400 border-sky-500/30 bg-sky-950/10" },
    { key: "admin", label: "Admin & Internal", icon: ShieldAlert, color: "text-rose-400 border-rose-500/30 bg-rose-950/10" },
    { key: "public", label: "Public Surface", icon: Globe, color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/10" },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Attack Surface Explorer
            </span>
            <span className="text-xs font-mono text-slate-500">
              {nodes.length} assets mapped
            </span>
          </div>
          <h3 className="text-lg font-bold font-mono text-white tracking-tight">
            Interactive Attack Surface & Route Graph
          </h3>
          <p className="text-xs text-slate-400">
            Click any endpoint node to inspect associated vulnerabilities and defense telemetry.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          {selectedUrlFilter ? (
            <button
              onClick={() => onSelectFindingUrl("")}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Reset Filter
            </button>
          ) : null}
          <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer ${
                viewMode === "graph"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🌐 Graph Nodes
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📋 Tree List
            </button>
          </div>
        </div>
      </div>

      {/* Visual Hub Grid (Graph Mode) */}
      {viewMode === "graph" ? (
        <div className="space-y-6">
          {/* Target Host Root Anchor */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  Root Target Domain
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">
                  {targetUrl}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase border-slate-800 text-slate-400">
              Host Apex
            </Badge>
          </div>

          {/* Category Hubs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const catNodes = nodes.filter((n) => n.category === cat.key);
              const CatIcon = cat.icon;
              const hasCritical = catNodes.some((n) => n.highestSeverity === "critical");
              const hasHigh = catNodes.some((n) => n.highestSeverity === "high");

              return (
                <div
                  key={cat.key}
                  className={`p-4 rounded-xl border space-y-3 transition-all ${cat.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CatIcon className="h-4 w-4" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800">
                      {catNodes.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {catNodes.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No routes recorded</p>
                    ) : (
                      catNodes.map((n) => {
                        const isSelected = selectedUrlFilter === n.fullUrl;
                        return (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => onSelectFindingUrl(n.fullUrl)}
                            className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-emerald-500/20 border border-emerald-500/60 text-white"
                                : "bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300"
                            }`}
                          >
                            <span className="font-mono text-xs truncate max-w-[140px]" title={n.fullUrl}>
                              {n.path}
                            </span>
                            {n.findings.length > 0 ? (
                              <Badge
                                variant={
                                  n.highestSeverity === "critical"
                                    ? "critical"
                                    : n.highestSeverity === "high"
                                    ? "high"
                                    : n.highestSeverity === "medium"
                                    ? "medium"
                                    : "outline"
                                }
                                className="text-[9px] font-mono px-1.5 py-0 uppercase shrink-0"
                              >
                                {n.findings.length}
                              </Badge>
                            ) : (
                              <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {nodes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectFindingUrl(n.fullUrl)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedUrlFilter === n.fullUrl
                  ? "bg-slate-900 border-emerald-500/60 text-white"
                  : "bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-[10px] uppercase text-slate-400">
                  {n.category}
                </span>
                <span className="font-mono text-xs font-semibold">{n.fullUrl}</span>
              </div>
              <div className="flex items-center gap-2">
                {n.findings.length > 0 ? (
                  <Badge
                    variant={
                      n.highestSeverity === "critical"
                        ? "critical"
                        : n.highestSeverity === "high"
                        ? "high"
                        : n.highestSeverity === "medium"
                        ? "medium"
                        : "outline"
                    }
                    className="text-[10px] font-mono uppercase"
                  >
                    {n.findings.length} findings
                  </Badge>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Clean
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
