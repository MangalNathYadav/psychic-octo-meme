"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  ArrowRight, 
  Link as LinkIcon, 
  MessageSquare, 
  QrCode,
  LogIn
} from "lucide-react";
import { UserScanRecord, subscribeToUserScans, deleteUserScanRecord } from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface HistoryViewProps {
  user: User | null;
  onSelectScanForReinspect: (target: string, type: "url" | "message" | "qr") => void;
  onSignIn: () => void;
  language: Language;
  t: any;
}

export default function HistoryView({
  user,
  onSelectScanForReinspect,
  onSignIn,
  language,
  t
}: HistoryViewProps) {
  const [scans, setScans] = useState<UserScanRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "scams" | "safe">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const targetUserId = user ? user.uid : "guest-user";

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToUserScans(targetUserId, (list) => {
      setScans(list);
      setLoading(false);
    });
    return () => unsub();
  }, [targetUserId]);

  const handleDelete = async (scanId: string) => {
    await deleteUserScanRecord(targetUserId, scanId);
  };

  const filteredScans = scans.filter((s) => {
    if (filter === "scams" && s.riskScore < 50) return false;
    if (filter === "safe" && s.riskScore >= 50) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.target.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border text-app-accent">
              Personal Vault
            </span>
            <span className="text-xs font-mono text-app-muted">
              Firebase RTDB Sync
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-app-text mt-1">
            {t.historyTitle}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t.historySubtitle}
          </p>
        </div>

        {/* User Account / Google Sign-in Prompt if guest */}
        {!user && (
          <button
            onClick={onSignIn}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs self-start sm:self-auto"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-500" />
            <span>{t.signIn}</span>
          </button>
        )}
      </div>

      {/* Guest Notice Banner if not logged in */}
      {!user && (
        <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border flex items-center justify-between gap-3 text-xs">
          <p className="text-app-muted">
            {t.historySignInPrompt}
          </p>
          <button
            onClick={onSignIn}
            className="text-app-accent font-semibold underline whitespace-nowrap"
          >
            Sign in now
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="surface-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex bg-app-surface-subtle p-0.5 rounded-xl border border-app-border text-xs self-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "all" ? "bg-app-surface text-app-text font-bold shadow-2xs" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterAll} ({scans.length})
          </button>
          <button
            onClick={() => setFilter("scams")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "scams" ? "bg-app-surface text-app-text font-bold shadow-2xs text-red-600" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterScams} ({scans.filter(s => s.riskScore >= 50).length})
          </button>
          <button
            onClick={() => setFilter("safe")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "safe" ? "bg-app-surface text-app-text font-bold shadow-2xs text-emerald-600" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterSafe} ({scans.filter(s => s.riskScore < 50).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past scans..."
            className="w-full bg-app-surface-subtle border border-app-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent"
          />
        </div>
      </div>

      {/* Scans List */}
      <div className="space-y-3">
        {loading ? (
          /* Lazy Loading Shimmer Skeletons */
          <div className="space-y-3 animate-fade-in-up">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card rounded-2xl p-4.5 border border-app-border space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl skeleton-shimmer shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-60 rounded skeleton-shimmer" />
                      <div className="h-2.5 w-32 rounded skeleton-shimmer opacity-60" />
                    </div>
                  </div>
                  <div className="h-6 w-24 rounded-full skeleton-shimmer" />
                </div>
                <div className="h-3 w-4/5 rounded skeleton-shimmer opacity-70" />
              </div>
            ))}
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="surface-card rounded-2xl p-12 text-center space-y-3 animate-fade-in-up">
            <div className="h-12 w-12 rounded-2xl bg-app-surface-subtle border border-app-border flex items-center justify-center mx-auto text-app-muted">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-app-text">No scans found</h3>
            <p className="text-xs text-app-muted max-w-sm mx-auto">
              {t.historyEmpty}
            </p>
          </div>
        ) : (
          filteredScans.map((scan, idx) => {
            const isHigh = scan.riskScore >= 65;
            const isSusp = scan.riskScore >= 35 && scan.riskScore < 65;

            return (
              <div
                key={scan.id}
                style={{ animationDelay: `${Math.min(idx * 45, 400)}ms` }}
                className="surface-card rounded-2xl p-4.5 hover:border-app-accent/40 transition-all hover:shadow-xs space-y-3 group animate-fade-in-up"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border/60 pb-3">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                      scan.type === "url" 
                        ? "bg-rose-500/10 text-rose-600" 
                        : scan.type === "message" 
                        ? "bg-purple-500/10 text-purple-600" 
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {scan.type === "url" ? <LinkIcon className="h-4 w-4" /> : scan.type === "message" ? <MessageSquare className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-mono text-xs font-bold text-app-text truncate">
                        {scan.target}
                      </div>
                      <span className="text-[10px] text-app-muted font-mono block">
                        {new Date(scan.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isHigh
                        ? "bg-red-500/15 text-red-600 border border-red-500/30"
                        : isSusp
                        ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                    }`}>
                      {scan.riskScore}% {isHigh ? "SCAM" : isSusp ? "SUSPICIOUS" : "SAFE"}
                    </span>

                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-1.5 rounded-lg text-app-muted hover:text-red-500 hover:bg-app-surface-subtle transition"
                      title="Delete from history"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-app-secondary leading-relaxed">
                  {scan.summary}
                </p>

                {/* Flags and Re-inspect */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex flex-wrap gap-1">
                    {scan.flags?.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-app-surface-subtle text-app-muted font-mono border border-app-border text-[10px]">
                        {f}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectScanForReinspect(scan.target, scan.type === "omni" ? "url" : scan.type)}
                    className="text-app-accent hover:underline font-semibold flex items-center space-x-1 shrink-0 self-end sm:self-auto"
                  >
                    <span>Re-inspect in Scanner</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
