"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Link as LinkIcon, 
  MessageSquare, 
  QrCode, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  PhoneCall,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Language } from "@/lib/i18n";
import { decodeQrFromImageFile } from "@/lib/qrDecoder";
import { saveUserScanRecord, subscribeToRealtimeThreatReports, ThreatReport } from "@/lib/firebase";
import { User } from "firebase/auth";
import QuickActionGrid from "@/components/QuickActionGrid";
import TwoColumnSection from "@/components/TwoColumnSection";

interface ScannerViewProps {
  user: User | null;
  scannerMode: "url" | "message" | "qr";
  setScannerMode: (mode: "url" | "message" | "qr") => void;
  language: Language;
  t: any;
  initialInput?: string;
  onOpenAiAdvisor?: () => void;
  onSelectTrackBanner?: () => void;
}

export default function ScannerView({
  user,
  scannerMode,
  setScannerMode,
  language,
  t,
  initialInput,
  onOpenAiAdvisor,
  onSelectTrackBanner
}: ScannerViewProps) {
  const [inputValue, setInputValue] = useState(initialInput || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [qrDecodeMsg, setQrDecodeMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [liveThreatReports, setLiveThreatReports] = useState<ThreatReport[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to live threat reports for TwoColumnSection feed
  useEffect(() => {
    const unsub = subscribeToRealtimeThreatReports((reports) => {
      setLiveThreatReports(reports);
    });
    return () => unsub();
  }, []);

  // Update when initialInput changes
  useEffect(() => {
    if (initialInput) {
      setInputValue(initialInput);
    }
  }, [initialInput]);

  // Clear inputs when switching mode unless initialInput was provided
  useEffect(() => {
    if (!initialInput) {
      setInputValue("");
    }
    setResult(null);
    setQrDecodeMsg(null);
  }, [scannerMode]);

  const presets = [
    {
      id: "sbi",
      mode: "url" as const,
      title: t.presetSbiTitle,
      desc: t.presetSbiDesc,
      payload: "http://sbl-kyc-update.xyz/login.php",
      badge: "Typosquatting",
      color: "border-rose-500/30 hover:border-rose-500",
      dot: "bg-rose-500"
    },
    {
      id: "discom",
      mode: "message" as const,
      title: t.presetDiscomTitle,
      desc: t.presetDiscomDesc,
      payload: "प्रिय ग्राहक आपका बिजली बिल बकाया है आज रात 9:30 बजे बिजली काट दी जाएगी तुरंत इस लिंक पर बिल भरें",
      badge: "Panic Trigger",
      color: "border-amber-500/30 hover:border-amber-500",
      dot: "bg-amber-500"
    },
    {
      id: "reverseQr",
      mode: "qr" as const,
      title: t.presetReverseQrTitle,
      desc: t.presetReverseQrDesc,
      payload: "upi://pay?pa=scammer89@ybl&pn=SBI%20Refund%20Dept&am=5000&cu=INR&tn=Scan%20to%20Receive%20Cashback",
      badge: "Reverse Debit",
      color: "border-emerald-500/30 hover:border-emerald-500",
      dot: "bg-emerald-500"
    },
    {
      id: "legit",
      mode: "url" as const,
      title: t.presetLegitTitle,
      desc: t.presetLegitDesc,
      payload: "https://www.onlinesbi.sbi/portal/web/home",
      badge: "Official Bank",
      color: "border-blue-500/30 hover:border-blue-500",
      dot: "bg-blue-500"
    }
  ];

  const handleApplyPreset = async (preset: typeof presets[0]) => {
    setScannerMode(preset.mode);
    setInputValue(preset.payload);
    setResult(null);
    setQrDecodeMsg(null);
    await triggerAnalysis(preset.mode, preset.payload);
  };

  const triggerAnalysis = async (mode: "url" | "message" | "qr", payload: string) => {
    if (!payload.trim()) return;
    setLoading(true);

    const body: any = { 
      mode,
      reportedBy: user ? {
        uid: user.uid,
        displayName: user.displayName || "Google User",
        email: user.email || "",
        photoURL: user.photoURL || ""
      } : undefined
    };

    if (mode === "url") body.url = payload;
    if (mode === "message") body.message = payload;
    if (mode === "qr") body.qrPayload = payload;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);

        // Save to user scan history in Firebase RTDB (Task 2)
        const score = data.data.overallRiskScore ?? data.data.riskScore ?? data.data.compositeNlpScore ?? 0;
        const tier = data.data.overallRiskTier ?? data.data.riskTier ?? (score >= 65 ? "HIGH_RISK" : score >= 35 ? "SUSPICIOUS" : "SAFE");
        const summary = data.data.threatSummaryEn || data.data.explanationEn || "Zero-Trust scan completed";
        const flags = data.data.keyFlags || data.data.flags || data.data.detectedKeywords || [];

        const targetUserId = user ? user.uid : "guest-user";
        await saveUserScanRecord(targetUserId, {
          userEmail: user?.email || "guest@local",
          userName: user?.displayName || "Guest Citizen",
          type: mode,
          target: payload.slice(0, 100),
          riskScore: score,
          riskLevel: tier,
          summary,
          flags: flags.slice(0, 5),
          metrics: data.data.metrics
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setQrDecodeMsg(null);

    try {
      const decoded = await decodeQrFromImageFile(file);
      if (decoded) {
        setInputValue(decoded);
        setQrDecodeMsg({ text: t.qrDecodedSuccess, success: true });
        await triggerAnalysis("qr", decoded);
      } else {
        setQrDecodeMsg({ text: t.qrDecodeFail, success: false });
      }
    } catch {
      setQrDecodeMsg({ text: t.qrDecodeFail, success: false });
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.displayName ? user.displayName.split(" ")[0] : t.workspaceAnalyst;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => onSelectTrackBanner ? onSelectTrackBanner() : null}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-app-surface border border-app-border text-xs text-app-secondary hover:text-app-text hover:border-app-muted transition shadow-2xs group cursor-pointer"
            >
              <span className="px-2 py-0.5 rounded-full bg-app-accent text-white font-mono text-[10px] font-bold">
                {t.bannerNew}
              </span>
              <span className="font-medium text-[11px] sm:text-xs">
                {t.bannerText}
              </span>
              <ArrowRight className="h-3 w-3 text-app-muted group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-text mt-2">
            {language === "hi" ? "नमस्ते" : "Hello"}, {userName}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Active inspection mode: <span className="font-semibold text-app-text font-mono capitalize">{scannerMode === "url" ? "Website Link Guard" : scannerMode === "message" ? "SMS / Message NLP" : "QR & UPI Intent Sentinel"}</span>
          </p>
        </div>

        {/* Live Active Pill Indicator & Ask AI Advisor */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs hover:shadow-xs group cursor-pointer"
            >
              <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shrink-0">
                <Sparkles className="h-2.5 w-2.5" />
              </div>
              <span className="text-[11px]">{t.askAiBtn}</span>
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs text-app-muted bg-app-surface px-3 py-1.5 rounded-xl border border-app-border shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px]">Realtime RTDB Active</span>
          </div>
        </div>
      </div>

      {/* 4 Clean Preset Cards (Hackathon Quick Demo) */}
      <div>
        <span className="text-[10px] font-mono uppercase font-bold text-app-muted tracking-wider block mb-2">
          {t.presetsTitle}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`p-3.5 rounded-xl border bg-app-surface text-left transition hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between ${p.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle font-medium text-app-secondary border border-app-border">
                    {p.badge}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${p.dot}`}></span>
                </div>
                <div className="text-xs font-bold text-app-text mt-2">
                  {p.title}
                </div>
                <div className="text-[11px] text-app-muted mt-0.5 line-clamp-1">
                  {p.desc}
                </div>
              </div>
              <div className="text-[10px] font-mono text-app-accent font-semibold pt-2 flex items-center space-x-1">
                <span>Test Live</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* The Minimalist Threat Scanner Card (Without internal tabs - Task 1) */}
      <div className="surface-card rounded-2xl p-6 space-y-4">
        {/* Mode Indicator Bar */}
        <div className="flex items-center justify-between border-b border-app-border/80 pb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-app-text">
            {scannerMode === "url" && (
              <>
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <div>
                  <span>Website Link & Domain Scanner</span>
                  <span className="text-[10px] text-app-muted block font-normal">Checks typosquatting, Punycode, TLDs & SSL</span>
                </div>
              </>
            )}
            {scannerMode === "message" && (
              <>
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span>SMS & Message NLP Intelligence</span>
                  <span className="text-[10px] text-app-muted block font-normal">Analyzes urgency, artificial panic & impersonation</span>
                </div>
              </>
            )}
            {scannerMode === "qr" && (
              <>
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <span>QR Code & UPI Intent Sentinel</span>
                  <span className="text-[10px] text-app-muted block font-normal">Detects reverse-charge debit scams & fake refund VPAs</span>
                </div>
              </>
            )}
          </div>

          {scannerMode === "qr" && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl border border-app-border hover:bg-app-surface-subtle text-xs font-semibold text-app-text flex items-center space-x-1.5 transition shadow-2xs"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t.uploadQrBtn}</span>
            </button>
          )}
        </div>

        {/* Hidden File Input for QR Image Reader */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleQrUpload}
          className="hidden"
        />

        {/* QR Decode Status Notification */}
        {qrDecodeMsg && (
          <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
            qrDecodeMsg.success
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
          }`}>
            {qrDecodeMsg.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            <span>{qrDecodeMsg.text}</span>
          </div>
        )}

        {/* Clean Input Area */}
        <div>
          {scannerMode === "message" ? (
            <textarea
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.inputMessagePlaceholder}
              className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3.5 text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={scannerMode === "url" ? t.inputUrlPlaceholder : t.inputQrPlaceholder}
              className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-4 py-3 text-xs font-mono text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
            />
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              setInputValue("");
              setResult(null);
              setQrDecodeMsg(null);
            }}
            className="text-xs text-app-muted hover:text-app-text font-medium transition"
          >
            {t.clearBtn}
          </button>

          <button
            onClick={() => triggerAnalysis(scannerMode, inputValue)}
            disabled={loading || !inputValue.trim()}
            className="px-6 py-2.5 rounded-xl bg-app-accent text-white font-semibold text-xs transition hover:opacity-90 disabled:opacity-40 flex items-center space-x-2 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t.analyzingBtn}</span>
              </>
            ) : (
              <>
                <Shield className="h-3.5 w-3.5" />
                <span>{t.analyzeBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Multi-Vector Zero-Trust Forensic Analysis Radar (Lazy Animation) */}
      {loading && (
        <div className="surface-card rounded-2xl p-6 border border-app-border space-y-4 animate-fade-in-up relative overflow-hidden shadow-2xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-pulse-glow" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              <span className="text-xs font-mono font-bold text-app-text uppercase tracking-wider">
                Multi-Vector Zero-Trust Forensic Analysis Active
              </span>
            </div>
            <span className="text-[10px] font-mono text-app-muted hidden sm:inline">Pre-Click Interception</span>
          </div>

          {/* Multi-Checkpoint Shimmer Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-500">1. Link Inspector</span>
                <RefreshCw className="h-3 w-3 text-rose-500 animate-spin" />
              </div>
              <div className="h-2 w-full rounded skeleton-shimmer" />
              <span className="text-[10px] text-app-muted block font-mono">Punycode & Typosquatting</span>
            </div>

            <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-500">2. Multilingual NLP</span>
                <RefreshCw className="h-3 w-3 text-purple-500 animate-spin" />
              </div>
              <div className="h-2 w-full rounded skeleton-shimmer" />
              <span className="text-[10px] text-app-muted block font-mono">Panic & Urgency Heuristics</span>
            </div>

            <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-500">3. UPI Sentinel</span>
                <RefreshCw className="h-3 w-3 text-emerald-500 animate-spin" />
              </div>
              <div className="h-2 w-full rounded skeleton-shimmer" />
              <span className="text-[10px] text-app-muted block font-mono">Reverse-Debit Trap Check</span>
            </div>
          </div>
        </div>
      )}

      {/* The High-Impact Verdict Result Card */}
      {result && !loading && (
        <VerdictCard
          result={result}
          language={language}
          t={t}
        />
      )}

      {/* Hero Quick Action 6-Card Row */}
      <div className="pt-2">
        <QuickActionGrid
          onSelectAction={(action) => {
            if (action === "omni" || action === "url") {
              setScannerMode("url");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (action === "message") {
              setScannerMode("message");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (action === "qr") {
              setScannerMode("qr");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          t={t}
        />
      </div>

      {/* Two Column Section: Live Threat Stream & Defense Engines */}
      <div className="pt-2">
        <TwoColumnSection
          threatFeed={liveThreatReports}
          onSelectThreat={(target, type) => {
            const mappedType = type === "omni" ? "url" : type;
            setScannerMode(mappedType);
            setInputValue(target);
            triggerAnalysis(mappedType, target);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onExploreLibrary={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSelectEngine={(mode) => {
            setScannerMode(mode);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onBroadcastModal={() => {
            if (onOpenAiAdvisor) onOpenAiAdvisor();
          }}
          t={t}
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// VERDICT CARD (High-Readability Hackathon Presentation UI)
// -------------------------------------------------------------
function VerdictCard({ result, language, t }: { result: any; language: Language; t: any }) {
  const score = result.overallRiskScore ?? result.riskScore ?? result.compositeNlpScore ?? 0;
  const isHighRisk = score >= 65;
  const isSuspicious = score >= 35 && score < 65;
  const isSafe = score < 35;

  return (
    <div className={`p-6 rounded-2xl border transition-all space-y-5 shadow-sm animate-in fade-in duration-300 ${
      isHighRisk 
        ? "border-red-500/30 bg-red-500/[0.02]" 
        : isSuspicious 
        ? "border-amber-500/30 bg-amber-500/[0.02]" 
        : "border-emerald-500/30 bg-emerald-500/[0.02]"
    }`}>
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isHighRisk 
                ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30" 
                : isSuspicious 
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" 
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            }`}>
              {isHighRisk ? t.verdictScam : isSuspicious ? t.verdictSuspicious : t.verdictSafe}
            </span>
            <span className="text-xs text-app-muted font-mono font-medium">
              Zero-Trust Index: {result.metrics?.zeroTrustScore ?? Math.max(5, 100 - score)}/100
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-app-text mt-2 leading-snug">
            {language === "en" ? (result.threatSummaryEn || result.explanationEn) : (result.threatSummaryHi || result.explanationHi)}
          </h2>
        </div>

        {/* Threat Score Metric */}
        <div className="bg-app-surface px-4 py-2.5 rounded-xl border border-app-border font-mono shadow-2xs text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-app-muted tracking-wider">
            {t.threatScoreLabel}
          </div>
          <div className={`text-2xl font-black ${
            isHighRisk ? "text-red-600" : isSuspicious ? "text-amber-500" : "text-emerald-500"
          }`}>
            {score}%
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      {result.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricDomain}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.domainTrust}%</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricProtocol}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.protocolSecurity}%</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricUrgency}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.linguisticUrgency}%</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricImpersonation}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.impersonationRisk}%</div>
          </div>
        </div>
      )}

      {/* Red Flags List */}
      {(result.keyFlags || result.flags) && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase font-bold text-app-muted tracking-wider">
            {t.flagsTitle}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(result.keyFlags || result.flags).map((flag: string, idx: number) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-app-surface border border-app-border text-app-secondary shadow-2xs">
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reverse-Charge UPI Details Callout */}
      {result.isReverseScam && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
          <div className="font-bold text-red-600 flex items-center space-x-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Reverse-Charge Fraud Detected!</span>
          </div>
          <p className="text-app-text text-[11px]">
            In UPI, you never scan a QR or enter a PIN to receive money. Scanning this code will debit <strong>₹{result.upiDetails?.amount || "funds"}</strong> from your account directly to the attacker.
          </p>
        </div>
      )}

      {/* Immediate Action Advice & Helpline */}
      <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-1.5 text-xs shadow-2xs">
        <div className="font-bold text-app-text flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-emerald-500" />
          <span>{t.remediationTitle}</span>
        </div>
        <p className="text-app-muted leading-relaxed">
          {language === "hi"
            ? (isHighRisk ? "किसी भी लिंक पर क्लिक न करें और न ही यूपीआई पिन डालें।" : "अपने आधिकारिक बैंक ऐप से सीधे विवरण सत्यापित करें।")
            : (result.actionChecklist?.immediateAction || "Do not input credentials or authorize payment. Report suspicious senders.")}
        </p>
        <div className="text-[11px] font-mono text-app-muted pt-1 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <PhoneCall className="h-3 w-3 text-emerald-500" />
            <span>{t.helpline1930}</span>
          </span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-app-accent underline inline-flex items-center space-x-0.5"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
