"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  MessageSquareHeart, 
  Radio, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Shield, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Check, 
  Send,
  Eye,
  Sliders,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { 
  UserProfile, 
  ThreatReport, 
  SocialStory, 
  getAllUsersForAdmin, 
  updateUserRole,
  subscribeToRealtimeThreatReports, 
  saveThreatReport, 
  subscribeToSocialStories, 
  verifySocialStory, 
  deleteSocialStory 
} from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface AdminViewProps {
  user: User | null;
  language: Language;
  t: any;
}

export default function AdminView({ user, language, t }: AdminViewProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"users" | "logs" | "stories" | "broadcast">("users");

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Threat Logs State
  const [threatLogs, setThreatLogs] = useState<ThreatReport[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "high" | "safe">("all");
  const [logSearch, setLogSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<ThreatReport | null>(null);

  // Stories State
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [storyFilter, setStoryFilter] = useState<"all" | "unverified" | "prevented" | "loss">("all");

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("");
  const [broadcastType, setBroadcastType] = useState<"url" | "message" | "qr">("url");
  const [broadcastScore, setBroadcastScore] = useState<number>(92);
  const [broadcastSummary, setBroadcastSummary] = useState("");
  const [broadcastFlags, setBroadcastFlags] = useState("Typosquatting Link, Domain Age < 7 Days, Panic Prompt");
  const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Load Users
  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      const list = await getAllUsersForAdmin();
      // If active user is signed in, ensure they are in the list
      if (user && !list.some(u => u.uid === user.uid)) {
        list.unshift({
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0] || "Active Admin",
          email: user.email || "",
          photoURL: user.photoURL || undefined,
          role: "admin",
          totalScans: 12,
          lastLogin: new Date().toISOString(),
          joinedAt: new Date().toISOString()
        });
      }
      setUsers(list);
      setLoadingUsers(false);
    }
    fetchUsers();
  }, [user]);

  // Subscribe to Threat Logs
  useEffect(() => {
    const unsub = subscribeToRealtimeThreatReports((reports) => {
      setThreatLogs(reports);
    });
    return () => unsub();
  }, []);

  // Subscribe to Social Stories
  useEffect(() => {
    const unsub = subscribeToSocialStories((list) => {
      setStories(list);
    });
    return () => unsub();
  }, []);

  // Toggle user role
  const handleRoleToggle = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "analyst" : "admin";
    await updateUserRole(uid, newRole as any);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole as any } : u));
  };

  // Moderate story: Verify / Unverify
  const handleToggleVerifyStory = async (storyId: string, currentVerified: boolean) => {
    await verifySocialStory(storyId, !currentVerified);
  };

  // Moderate story: Delete
  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to permanently remove this scam incident story?")) {
      await deleteSocialStory(storyId);
    }
  };

  // Handle Threat Broadcast Submit
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastTarget || !broadcastSummary) return;

    setBroadcastSubmitting(true);
    const flagsList = broadcastFlags.split(",").map(f => f.trim()).filter(Boolean);

    await saveThreatReport({
      type: broadcastType,
      target: broadcastTarget,
      riskScore: broadcastScore,
      riskLevel: broadcastScore >= 70 ? "HIGH_RISK" : broadcastScore >= 35 ? "SUSPICIOUS" : "SAFE",
      summary: `[ADMIN BROADCAST] ${broadcastTitle}: ${broadcastSummary}`,
      flags: flagsList.length > 0 ? flagsList : ["Admin Broadcast Advisory"]
    });

    setBroadcastSubmitting(false);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);

    // Reset fields
    setBroadcastTitle("");
    setBroadcastTarget("");
    setBroadcastSummary("");
  };

  // Incident preset loader
  const loadBroadcastPreset = (title: string, target: string, type: "url" | "message" | "qr", score: number, summary: string, flags: string) => {
    setBroadcastTitle(title);
    setBroadcastTarget(target);
    setBroadcastType(type);
    setBroadcastScore(score);
    setBroadcastSummary(summary);
    setBroadcastFlags(flags);
  };

  // Filters
  const filteredUsers = users.filter(u => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const filteredLogs = threatLogs.filter(l => {
    if (logFilter === "high" && l.riskScore < 50) return false;
    if (logFilter === "safe" && l.riskScore >= 50) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return l.target.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredStories = stories.filter(s => {
    if (storyFilter === "unverified" && s.verified) return false;
    if (storyFilter === "prevented" && s.status !== "PREVENTED") return false;
    if (storyFilter === "loss" && s.status !== "LOSS_INCURRED") return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="surface-card rounded-2xl p-6 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20">
                SecOps Console
              </span>
              <span className="text-xs font-mono text-app-muted">
                Admin Control Plane · IEEE Track 04.1
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-app-text mt-1.5 tracking-tight">
              {t.adminTitle || "Admin & Operations Console"}
            </h1>
            <p className="text-xs text-app-muted mt-0.5">
              {t.adminSubtitle || "Manage users, monitor network threat logs, and moderate scam awareness stories"}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full Access Mode</span>
            </span>
          </div>
        </div>

        {/* Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-app-border/80 text-center font-mono">
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Monitored Scans</div>
            <div className="text-lg font-bold text-app-text">{threatLogs.length + 182}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Threats Blocked</div>
            <div className="text-lg font-bold text-rose-500">142</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Active Accounts</div>
            <div className="text-lg font-bold text-purple-500">{users.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Stories Live</div>
            <div className="text-lg font-bold text-emerald-500">{stories.length}</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-app-surface-subtle border border-app-border">
        <button
          onClick={() => setActiveAdminTab("users")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "users"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <Users className="h-3.5 w-3.5 text-purple-500" />
          <span>{t.adminTabUsers || "User Accounts"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("logs")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "logs"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          <span>{t.adminTabLogs || "Threat Scan Logs"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {threatLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("stories")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "stories"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <MessageSquareHeart className="h-3.5 w-3.5 text-rose-500" />
          <span>{t.adminTabStories || "Stories Moderation"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {stories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("broadcast")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "broadcast"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <Radio className="h-3.5 w-3.5 text-amber-500" />
          <span>{t.adminTabBroadcast || "Live Threat Broadcast"}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: USER ACCOUNTS & ROLES */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent"
              />
            </div>
            <div className="text-xs text-app-muted font-mono">
              Showing {filteredUsers.length} registered SecOps users
            </div>
          </div>

          <div className="surface-card rounded-2xl overflow-hidden shadow-2xs border border-app-border divide-y divide-app-border">
            {loadingUsers ? (
              <div className="p-4 space-y-4 animate-fade-in-up">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl skeleton-shimmer shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-36 rounded skeleton-shimmer" />
                        <div className="h-2.5 w-48 rounded skeleton-shimmer opacity-60" />
                      </div>
                    </div>
                    <div className="h-7 w-28 rounded-xl skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.map((u, idx) => (
              <div
                key={u.uid}
                style={{ animationDelay: `${Math.min(idx * 40, 350)}ms` }}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-app-surface-subtle/40 transition animate-fade-in-up"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-app-surface-subtle border border-app-border text-app-text font-bold font-mono text-sm flex items-center justify-center shrink-0">
                    {u.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs sm:text-sm text-app-text">{u.displayName}</span>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.2 rounded-full border ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-app-muted font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
                      {u.email || "Guest Authenticated Identity"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-app-muted block uppercase">Scans Done</span>
                    <span className="font-bold text-app-text">{u.totalScans} scans</span>
                  </div>

                  <button
                    onClick={() => handleRoleToggle(u.uid, u.role)}
                    className="px-3 py-1.5 rounded-xl border border-app-border hover:bg-app-surface text-xs font-semibold text-app-text transition shadow-2xs flex items-center space-x-1.5"
                    title="Change user privileges"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-app-accent" />
                    <span>Switch to {u.role === "admin" ? "Analyst" : "Admin"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: THREAT SCAN AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "logs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setLogFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "all"
                    ? "bg-app-accent text-white"
                    : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
                }`}
              >
                All Logs ({threatLogs.length})
              </button>
              <button
                onClick={() => setLogFilter("high")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "high"
                    ? "bg-rose-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-rose-600 border border-app-border"
                }`}
              >
                High Risk Threats
              </button>
              <button
                onClick={() => setLogFilter("safe")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "safe"
                    ? "bg-emerald-600 text-white"
                    : "bg-app-surface text-app-muted hover:text-emerald-600 border border-app-border"
                }`}
              >
                Verified Safe
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search target or summary..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent"
              />
            </div>
          </div>

          <div className="surface-card rounded-2xl overflow-hidden shadow-2xs border border-app-border divide-y divide-app-border">
            {filteredLogs.map((log, idx) => {
              const isHigh = log.riskScore >= 70;
              return (
                <div
                  key={log.id}
                  style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                  className="p-4 space-y-2 hover:bg-app-surface-subtle/40 transition animate-fade-in-up"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}>
                          Score: {log.riskScore}/100 · {log.riskLevel}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-app-surface-subtle text-app-muted border border-app-border">
                          {log.type.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-app-muted">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-app-text font-bold truncate">
                        {log.target}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-app-secondary leading-relaxed">
                    {log.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {log.flags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted border border-app-border"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: COMMUNITY STORIES MODERATION */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "stories" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStoryFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "all"
                    ? "bg-app-accent text-white"
                    : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
                }`}
              >
                All Stories ({stories.length})
              </button>
              <button
                onClick={() => setStoryFilter("unverified")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "unverified"
                    ? "bg-amber-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-amber-600 border border-app-border"
                }`}
              >
                Pending Verification
              </button>
              <button
                onClick={() => setStoryFilter("prevented")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "prevented"
                    ? "bg-emerald-600 text-white"
                    : "bg-app-surface text-app-muted hover:text-emerald-600 border border-app-border"
                }`}
              >
                Shielded (Prevented)
              </button>
              <button
                onClick={() => setStoryFilter("loss")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "loss"
                    ? "bg-rose-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-rose-600 border border-app-border"
                }`}
              >
                Loss Incurred
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredStories.map((story, idx) => (
              <div
                key={story.id}
                style={{ animationDelay: `${Math.min(idx * 40, 350)}ms` }}
                className="surface-card rounded-2xl p-5 shadow-2xs border border-app-border space-y-3 hover:border-app-accent/30 transition animate-fade-in-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                        story.status === "PREVENTED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      }`}>
                        {story.status === "PREVENTED" ? "Shielded" : "Loss Incurred"}
                      </span>
                      <span className="text-[10px] font-mono text-app-muted">
                        Category: {story.scamType}
                      </span>
                      {story.verified && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified Real Incident</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-app-text">{story.title}</h3>
                    <div className="text-[11px] text-app-muted">
                      Shared by <strong className="text-app-text">{story.authorName}</strong> · {story.lossAmount || "₹0"}
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggleVerifyStory(story.id, !!story.verified)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center space-x-1.5 shadow-2xs ${
                        story.verified
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                      }`}
                      title={story.verified ? "Remove verified badge" : "Mark as verified incident"}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{story.verified ? "Unverify" : "Verify Badge"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition border border-rose-500/20"
                      title="Delete story"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-app-secondary leading-relaxed bg-app-surface-subtle p-3 rounded-xl border border-app-border">
                  {story.story}
                </p>

                <div className="text-[11px] text-app-muted flex items-center justify-between">
                  <span><strong>Lesson:</strong> {story.lessonLearned}</span>
                  <span className="font-mono">{story.likesCount} Helpful votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: LIVE THREAT BROADCAST DISPATCHER */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "broadcast" && (
        <div className="space-y-6">
          {/* Quick Presets */}
          <div className="surface-card rounded-2xl p-5 shadow-2xs space-y-3 border border-app-border">
            <div className="flex items-center space-x-2 text-app-text font-bold text-xs">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Broadcast Incident Presets (1-Click Fill)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "BESCOM Urgent Power Disconnection SMS Wave",
                  "http://bescom-bill-clearance.live/pay",
                  "url",
                  94,
                  "Fraudulent electricity notice threatening cutoff tonight. Redirects to fake payment gateway.",
                  "Disposable TLD .live, Homograph BESCOM, Urgent 24h Deadline"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">⚡ BESCOM Utility Threat</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Threatening electricity cut tonight at 9:30 PM with fake link.</div>
              </button>

              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "SBI YONO APK Trojan Dropper on WhatsApp",
                  "Dear customer your YONO account is locked. Download SBI-KYC.apk to unfreeze.",
                  "message",
                  96,
                  "Malicious Android APK payload circulating on WhatsApp claiming to be State Bank of India update.",
                  "Malicious APK Vector, Bank Impersonation, Account Lock Panic"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">📱 Fake SBI YONO APK</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Trojan dropper claiming to unfreeze netbanking via APK.</div>
              </button>

              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "Marketplace Reverse UPI Cashback Trap",
                  "upi://pay?pa=cashback-rewards@ybl&pn=PhonePe%20Rewards&am=2500&cu=INR",
                  "qr",
                  91,
                  "Deceptive QR code claiming to credit ₹2,500 cashback; actually issues debit intent.",
                  "Reverse Debit Intent, Fictitious Cashback Hook, Unverified VPA"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">💳 Reverse UPI QR Trap</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Marketplace QR code masquerading as incoming cashback.</div>
              </button>
            </div>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handleBroadcastSubmit} className="surface-card rounded-2xl p-6 shadow-2xs space-y-4 border border-app-border">
            <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2">
              <Radio className="h-4 w-4 text-app-accent" />
              <h2>Broadcast Real-Time Threat Advisory to Network</h2>
            </div>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Threat advisory broadcasted successfully! Added to real-time telemetry stream.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. BESCOM Power Cut Wave"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Attack Vector Type</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                >
                  <option value="url">Phishing / Typosquatting Website (URL)</option>
                  <option value="message">SMS / WhatsApp Social Engineering (Message)</option>
                  <option value="qr">Reverse UPI Intent / QR Code (QR)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-text">Target URL / Text / UPI URI</label>
              <input
                type="text"
                required
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                placeholder="e.g. http://sbl-kyc.xyz or SMS message string"
                className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Assigned Risk Score (0 - 100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={broadcastScore}
                  onChange={(e) => setBroadcastScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Detected Heuristics / Flags (Comma-separated)</label>
                <input
                  type="text"
                  value={broadcastFlags}
                  onChange={(e) => setBroadcastFlags(e.target.value)}
                  placeholder="e.g. Typosquatting, Urgent Deadline, Fake VPA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-text">Forensic Summary & Citizen Guidance</label>
              <textarea
                required
                rows={3}
                value={broadcastSummary}
                onChange={(e) => setBroadcastSummary(e.target.value)}
                placeholder="Describe how the attack operates and what citizens should avoid..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={broadcastSubmitting}
                className="px-5 py-2.5 rounded-xl bg-app-accent hover:bg-app-accent-hover text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{broadcastSubmitting ? "Broadcasting..." : "Broadcast Threat to Network"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
