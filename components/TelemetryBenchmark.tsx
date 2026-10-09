"use client";

import React, { useState } from "react";
import { 
  Radio, 
  BarChart3, 
  RefreshCw, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ExternalLink,
  Shield,
  Layers
} from "lucide-react";
import { ThreatReport } from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface TelemetryBenchmarkProps {
  threatFeed: ThreatReport[];
  benchmarkData: any;
  benchmarkLoading: boolean;
  onRunBenchmark: () => void;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  onSubmitManualReport: (target: string, notes: string) => Promise<void>;
  user: User | null;
  language: Language;
  t: any;
}

export default function TelemetryBenchmark({
  threatFeed,
  benchmarkData,
  benchmarkLoading,
  onRunBenchmark,
  reportModalOpen,
  setReportModalOpen,
  onSubmitManualReport,
  user,
  language,
  t
}: TelemetryBenchmarkProps) {
  const [telemetrySubTab, setTelemetrySubTab] = useState<"stream" | "benchmark">("stream");
  const [targetInput, setTargetInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitManualReport(targetInput, notesInput);
      setTargetInput("");
      setNotesInput("");
      setReportModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="surface-card rounded-2xl p-6 space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase text-app-accent font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border">
              Realtime Forensics
            </span>
            <span className="text-xs font-mono text-app-muted">
              Firebase RTDB & Evaluation Suite
            </span>
          </div>
          <h2 className="text-lg font-bold text-app-text mt-1.5">
            {t.telemetryTitle}
          </h2>
          <p className="text-xs text-app-muted mt-0.5">
            {t.telemetrySubtitle}
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex bg-app-surface-subtle p-1 rounded-xl border border-app-border text-xs self-start sm:self-auto">
          <button
            onClick={() => setTelemetrySubTab("stream")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              telemetrySubTab === "stream" 
                ? "bg-app-surface text-app-text font-bold shadow-xs" 
                : "text-app-muted hover:text-app-text"
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span>{t.tabLiveStream}</span>
          </button>
          <button
            onClick={() => setTelemetrySubTab("benchmark")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              telemetrySubTab === "benchmark" 
                ? "bg-app-surface text-app-text font-bold shadow-xs" 
                : "text-app-muted hover:text-app-text"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t.tabBenchmarkSuite}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Realtime Stream */}
      {telemetrySubTab === "stream" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-app-muted">
              {threatFeed.length} active telemetry events synchronized
            </span>
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-app-accent hover:opacity-90 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.broadcastIncidentBtn}</span>
            </button>
          </div>

          <div className="divide-y divide-app-border/80 border border-app-border rounded-xl overflow-hidden bg-app-surface">
            {threatFeed.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-app-surface hover:bg-app-surface-subtle/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        item.riskLevel === "HIGH_RISK"
                          ? "bg-red-500/10 text-red-600 border border-red-500/20"
                          : item.riskLevel === "SUSPICIOUS"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      }`}
                    >
                      {item.riskScore}%
                    </span>
                    <span className="font-mono text-app-text font-semibold truncate max-w-sm">
                      {item.target}
                    </span>
                  </div>
                  <p className="text-[11px] text-app-muted truncate max-w-xl">
                    {item.summary}
                  </p>
                  {item.flags && item.flags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.flags.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-secondary border border-app-border">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-app-muted font-mono whitespace-nowrap self-start sm:self-center">
                  {typeof item.timestamp === "string"
                    ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Just now"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Benchmark & Confusion Matrix */}
      {telemetrySubTab === "benchmark" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-app-secondary max-w-xl leading-relaxed">
              Automated evaluation of ScamShield detection pipeline against 100 sanitized test samples (50 malicious phishing & reverse UPI scams + 50 verified legitimate interactions).
            </p>
            <button
              onClick={onRunBenchmark}
              disabled={benchmarkLoading}
              className="px-4 py-2 rounded-xl bg-app-accent hover:opacity-90 text-white text-xs font-semibold transition flex items-center space-x-2 shrink-0 shadow-2xs disabled:opacity-50"
            >
              {benchmarkLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Activity className="h-3.5 w-3.5" />
              )}
              <span>{t.runBenchmarkBtn}</span>
            </button>
          </div>

          {benchmarkData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border">
                  <div className="text-[11px] text-app-muted font-mono font-medium">{t.accuracy}</div>
                  <div className="text-2xl font-bold text-emerald-500 mt-1">{benchmarkData.accuracy}%</div>
                </div>
                <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border">
                  <div className="text-[11px] text-app-muted font-mono font-medium">{t.precision}</div>
                  <div className="text-2xl font-bold text-app-text mt-1">{benchmarkData.precision}%</div>
                </div>
                <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border">
                  <div className="text-[11px] text-app-muted font-mono font-medium">{t.recall}</div>
                  <div className="text-2xl font-bold text-app-text mt-1">{benchmarkData.recall}%</div>
                </div>
                <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border">
                  <div className="text-[11px] text-app-muted font-mono font-medium">{t.f1Score}</div>
                  <div className="text-2xl font-bold text-app-text mt-1">{benchmarkData.f1Score}%</div>
                </div>
              </div>

              {/* 2x2 Confusion Matrix */}
              <div className="p-5 rounded-2xl border border-app-border bg-app-surface-subtle/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-app-text">{t.matrixTitle}</h4>
                  <span className="text-[11px] font-mono text-app-muted">100 Test Samples (50 Scam / 50 Legit)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-app-surface border border-emerald-500/30">
                    <div className="text-emerald-500 font-bold text-base">TP: {benchmarkData.truePositives}</div>
                    <div className="text-[10px] text-app-muted mt-0.5">True Positive (Phishing detected)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-app-surface border border-amber-500/30">
                    <div className="text-amber-500 font-bold text-base">FP: {benchmarkData.falsePositives}</div>
                    <div className="text-[10px] text-app-muted mt-0.5">False Positive (False alarm)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-app-surface border border-red-500/30">
                    <div className="text-red-500 font-bold text-base">FN: {benchmarkData.falseNegatives}</div>
                    <div className="text-[10px] text-app-muted mt-0.5">False Negative (Missed threat)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-app-surface border border-emerald-500/30">
                    <div className="text-emerald-500 font-bold text-base">TN: {benchmarkData.trueNegatives}</div>
                    <div className="text-[10px] text-app-muted mt-0.5">True Negative (Legit verified)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for reporting threat */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-app-surface border border-app-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-app-text">
                {t.modalBroadcastTitle}
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg text-app-muted hover:text-app-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-app-text block mb-1">
                  {t.modalTarget}
                </label>
                <input
                  type="text"
                  required
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="e.g. sbl-card-verify.xyz or scammer@ybl"
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2 text-xs text-app-text font-mono focus:outline-none focus:border-app-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-app-text block mb-1">
                  {t.modalNotes}
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Received unsolicited SMS threatening power disconnection."
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-app-muted hover:text-app-text"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-app-accent hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-2xs"
                >
                  {submitting ? "..." : t.modalSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
