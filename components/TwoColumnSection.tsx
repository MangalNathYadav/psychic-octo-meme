"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Globe, 
  QrCode, 
  MessageSquare, 
  ArrowUpRight, 
  ChevronRight
} from "lucide-react";
import { ThreatReport } from "@/lib/firebase";

interface TwoColumnSectionProps {
  threatFeed: ThreatReport[];
  onSelectThreat: (target: string, type: "url" | "message" | "qr" | "omni") => void;
  onExploreLibrary: () => void;
  onSelectEngine: (mode: "url" | "qr" | "message") => void;
  onBroadcastModal: () => void;
  t: any;
}

export default function TwoColumnSection({
  threatFeed,
  onSelectThreat,
  onExploreLibrary,
  onSelectEngine,
  onBroadcastModal,
  t
}: TwoColumnSectionProps) {
  const [filter, setFilter] = useState<"all" | "high" | "upi" | "phish">("all");

  const allItems = (threatFeed || []).map((t, idx) => ({
    id: t.id || `live-${idx}`,
    title: t.summary ? t.summary.slice(0, 36) + "..." : "Citizen Threat Report",
    target: t.target,
    type: t.type,
    category: t.type === "qr" ? "upi" : t.riskScore >= 80 ? "high" : "phish",
    riskScore: t.riskScore,
    desc: t.userNotes || t.summary || "Real-time threat captured via ScamShield Zero-Trust network",
    avatarGradient: t.type === "qr" ? "from-emerald-500 to-teal-600" : t.type === "message" ? "from-purple-500 to-pink-600" : "from-rose-500 to-red-600",
    verifiedThreat: t.riskScore >= 70,
    isLegit: t.riskLevel === "SAFE" || t.riskScore < 30,
    badge: t.riskLevel === "SAFE" ? "Verified Safe" : t.type === "qr" ? "Reverse Trap" : "Threat Sig."
  }));

  const filteredItems = allItems.filter(item => {
    if (filter === "all") return true;
    if (filter === "high") return item.riskScore >= 80;
    if (filter === "upi") return item.type === "qr";
    if (filter === "phish") return item.category === "phish";
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Latest from the library (7 cols) */}
      <div className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-app-text tracking-tight">
              {t.libraryTitle}
            </h2>
            <p className="text-[11px] text-app-muted">
              Live verified threat signatures curated by ScamShield zero-trust pipeline
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-app-surface-subtle p-0.5 rounded-lg border border-app-border text-[11px] self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 rounded-md transition ${
                filter === "all" ? "bg-app-surface text-app-text font-semibold shadow-2xs" : "text-app-muted hover:text-app-text"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-2 py-1 rounded-md transition ${
                filter === "high" ? "bg-app-surface text-app-text font-semibold shadow-2xs" : "text-app-muted hover:text-app-text"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter("upi")}
              className={`px-2 py-1 rounded-md transition ${
                filter === "upi" ? "bg-app-surface text-app-text font-semibold shadow-2xs" : "text-app-muted hover:text-app-text"
              }`}
            >
              UPI Fraud
            </button>
            <button
              onClick={() => setFilter("phish")}
              className={`px-2 py-1 rounded-md transition ${
                filter === "phish" ? "bg-app-surface text-app-text font-semibold shadow-2xs" : "text-app-muted hover:text-app-text"
              }`}
            >
              Phishing
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="divide-y divide-app-border/60">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectThreat(item.target, item.type)}
              className="py-3 px-2 rounded-xl hover:bg-app-surface-subtle/80 transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                {/* Colorful circular avatar (matching ElevenLabs screenshot style) */}
                <div className={`relative h-10 w-10 rounded-full bg-gradient-to-tr ${item.avatarGradient} flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  {item.isLegit ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : item.type === "qr" ? (
                    <QrCode className="h-5 w-5" />
                  ) : item.type === "message" ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : (
                    <Globe className="h-5 w-5" />
                  )}

                  {/* Verification Checkmark Pill / Star */}
                  {item.verifiedThreat && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[9px] font-bold shadow-xs">
                      ★
                    </span>
                  )}
                  {item.isLegit && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                      ✓
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-app-text group-hover:text-app-accent transition-colors truncate">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                      item.isLegit 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                        : "bg-red-500/10 text-red-600 border border-red-500/20"
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-app-muted truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action / Risk Pill */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  item.isLegit 
                    ? "text-emerald-600 bg-emerald-500/10" 
                    : item.riskScore >= 80 
                    ? "text-red-600 bg-red-500/10" 
                    : "text-amber-600 bg-amber-500/10"
                }`}>
                  {item.riskScore}%
                </span>
                <ChevronRight className="h-4 w-4 text-app-muted group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-app-border/80">
          <button
            onClick={onExploreLibrary}
            className="px-3 py-1.5 rounded-xl border border-app-border hover:bg-app-surface-subtle text-xs font-semibold text-app-text transition shadow-2xs"
          >
            {t.exploreLibrary}
          </button>

          <button
            onClick={onBroadcastModal}
            className="text-xs text-app-accent hover:underline font-semibold flex items-center space-x-1"
          >
            <span>+ {t.broadcastIncidentBtn}</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Create or clone a voice -> Defense Engines (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight">
            {t.quickActionsTitle}
          </h2>
          <p className="text-[11px] text-app-muted">
            Specialized Zero-Trust forensic inspectors for high-risk vectors
          </p>
        </div>

        {/* 3 Wide Rectangular Cards (matching ElevenLabs right column) */}
        <div className="space-y-3">
          {/* Card 1: Domain & Homograph Guard */}
          <div
            onClick={() => onSelectEngine("url")}
            className="surface-card-interactive rounded-2xl p-4 flex items-center space-x-4 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Globe className="h-6 w-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-app-text group-hover:text-app-accent transition-colors">
                  {t.cardForensicsTitle}
                </h3>
                <ArrowUpRight className="h-3 w-3 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-app-muted leading-snug mt-0.5">
                {t.cardForensicsDesc}
              </p>
            </div>
          </div>

          {/* Card 2: Reverse-Charge UPI Sentinel */}
          <div
            onClick={() => onSelectEngine("qr")}
            className="surface-card-interactive rounded-2xl p-4 flex items-center space-x-4 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <QrCode className="h-6 w-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-app-text group-hover:text-app-accent transition-colors">
                  {t.cardReverseQrTitle}
                </h3>
                <ArrowUpRight className="h-3 w-3 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-app-muted leading-snug mt-0.5">
                {t.cardReverseQrDesc}
              </p>
            </div>
          </div>

          {/* Card 3: Multilingual Panic NLP */}
          <div
            onClick={() => onSelectEngine("message")}
            className="surface-card-interactive rounded-2xl p-4 flex items-center space-x-4 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-app-text group-hover:text-app-accent transition-colors">
                  {t.cardPanicNlpTitle}
                </h3>
                <ArrowUpRight className="h-3 w-3 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-app-muted leading-snug mt-0.5">
                {t.cardPanicNlpDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
