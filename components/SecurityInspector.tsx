"use client";

import React, { useState, useRef } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Link as LinkIcon, 
  MessageSquare, 
  QrCode, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  PhoneCall,
  Sparkles
} from "lucide-react";
import { Language } from "@/lib/i18n";
import { decodeQrFromImageFile } from "@/lib/qrDecoder";

interface SecurityInspectorProps {
  inspectorMode: "omni" | "url" | "message" | "qr";
  setInspectorMode: (mode: "omni" | "url" | "message" | "qr") => void;
  omniUrl: string;
  setOmniUrl: (val: string) => void;
  omniMessage: string;
  setOmniMessage: (val: string) => void;
  omniQr: string;
  setOmniQr: (val: string) => void;
  urlInput: string;
  setUrlInput: (val: string) => void;
  messageInput: string;
  setMessageInput: (val: string) => void;
  qrInput: string;
  setQrInput: (val: string) => void;
  analysisLoading: boolean;
  currentResult: any;
  resultMode: string;
  onAnalyze: () => void;
  onClear: () => void;
  onApplyPreset: (type: "sbi" | "discom" | "legit" | "reverseQr") => void;
  language: Language;
  t: any;
}

export default function SecurityInspector({
  inspectorMode,
  setInspectorMode,
  omniUrl,
  setOmniUrl,
  omniMessage,
  setOmniMessage,
  omniQr,
  setOmniQr,
  urlInput,
  setUrlInput,
  messageInput,
  setMessageInput,
  qrInput,
  setQrInput,
  analysisLoading,
  currentResult,
  resultMode,
  onAnalyze,
  onClear,
  onApplyPreset,
  language,
  t
}: SecurityInspectorProps) {
  const [qrDecoding, setQrDecoding] = useState(false);
  const [qrDecodeMsg, setQrDecodeMsg] = useState<{ text: string; success: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrDecoding(true);
    setQrDecodeMsg(null);

    try {
      const decoded = await decodeQrFromImageFile(file);
      if (decoded) {
        if (inspectorMode === "omni") {
          setOmniQr(decoded);
        } else {
          setQrInput(decoded);
        }
        setQrDecodeMsg({ text: t.qrDecodedSuccess, success: true });
      } else {
        setQrDecodeMsg({ text: t.qrDecodeFail, success: false });
      }
    } catch (err) {
      setQrDecodeMsg({ text: t.qrDecodeFail, success: false });
    } finally {
      setQrDecoding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Inspection Container */}
      <div className="surface-card rounded-2xl p-6 space-y-6">
        {/* Top Controls: Mode Switcher & Presets */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-app-border/80 pb-4">
          {/* Segmented Mode Selector */}
          <div className="flex bg-app-surface-subtle p-1 rounded-xl border border-app-border text-xs self-start">
            {[
              { id: "omni", label: t.modeOmni, icon: Layers },
              { id: "url", label: t.modeUrl, icon: LinkIcon },
              { id: "message", label: t.modeMessage, icon: MessageSquare },
              { id: "qr", label: t.modeQr, icon: QrCode },
            ].map((mode) => {
              const Icon = mode.icon;
              const active = inspectorMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setInspectorMode(mode.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                    active
                      ? "bg-app-surface text-app-text font-bold shadow-xs"
                      : "text-app-muted hover:text-app-text"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Preset Buttons Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] text-app-muted">
            <span className="hidden xl:inline font-mono text-[10px] uppercase font-semibold">
              {t.presetsTitle}
            </span>
            <button
              onClick={() => onApplyPreset("sbi")}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle hover:bg-app-surface border border-app-border hover:border-app-muted text-app-text transition whitespace-nowrap font-medium"
            >
              {t.presetSbiClone}
            </button>
            <button
              onClick={() => onApplyPreset("discom")}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle hover:bg-app-surface border border-app-border hover:border-app-muted text-app-text transition whitespace-nowrap font-medium"
            >
              {t.presetDiscomHindi}
            </button>
            <button
              onClick={() => onApplyPreset("reverseQr")}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle hover:bg-app-surface border border-app-border hover:border-app-muted text-app-text transition whitespace-nowrap font-medium"
            >
              {t.presetReverseQr}
            </button>
            <button
              onClick={() => onApplyPreset("legit")}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle hover:bg-app-surface border border-app-border hover:border-app-muted text-app-text transition whitespace-nowrap font-medium"
            >
              {t.presetLegitBank}
            </button>
          </div>
        </div>

        {/* Inputs Workspace */}
        <div className="space-y-4">
          {/* Omni Mode Fields */}
          {inspectorMode === "omni" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Message Vector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                    <span>{t.inputMessageLabel}</span>
                  </label>
                  <span className="text-[10px] font-mono text-app-muted">NLP / Urgency</span>
                </div>
                <textarea
                  rows={4}
                  value={omniMessage}
                  onChange={(e) => setOmniMessage(e.target.value)}
                  placeholder={t.inputMessagePlaceholder}
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
                />
              </div>

              {/* URL Vector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-rose-500" />
                    <span>{t.inputUrlLabel}</span>
                  </label>
                  <span className="text-[10px] font-mono text-app-muted">Homograph / SSL</span>
                </div>
                <textarea
                  rows={4}
                  value={omniUrl}
                  onChange={(e) => setOmniUrl(e.target.value)}
                  placeholder={t.inputUrlPlaceholder}
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-xs font-mono text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
                />
              </div>

              {/* QR Vector with image upload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                    <QrCode className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{t.inputQrLabel}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-app-accent hover:underline flex items-center space-x-1 font-medium"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload QR</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={omniQr}
                  onChange={(e) => setOmniQr(e.target.value)}
                  placeholder={t.inputQrPlaceholder}
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-xs font-mono text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
                />
              </div>
            </div>
          )}

          {/* URL Mode */}
          {inspectorMode === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-rose-500" />
                <span>{t.inputUrlLabel}</span>
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t.inputUrlPlaceholder}
                className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
              />
            </div>
          )}

          {/* Message Mode */}
          {inspectorMode === "message" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                <span>{t.inputMessageLabel}</span>
              </label>
              <textarea
                rows={4}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={t.inputMessagePlaceholder}
                className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3.5 text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
              />
            </div>
          )}

          {/* QR Mode */}
          {inspectorMode === "qr" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-app-text flex items-center space-x-1.5">
                  <QrCode className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{t.inputQrLabel}</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-app-surface border border-app-border hover:bg-app-surface-subtle text-xs font-medium text-app-text flex items-center space-x-1.5 transition shadow-2xs"
                >
                  <Upload className="h-3 w-3" />
                  <span>{t.uploadQrPrompt}</span>
                </button>
              </div>

              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder={t.inputQrPlaceholder}
                className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent focus:bg-app-surface transition"
              />
            </div>
          )}

          {/* Hidden File Input for QR Decoding */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleQrFileUpload}
            className="hidden"
          />

          {/* QR Decode Message */}
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

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onClear}
              className="text-xs text-app-muted hover:text-app-text transition font-medium"
            >
              {t.clearFields}
            </button>

            <button
              onClick={onAnalyze}
              disabled={analysisLoading}
              className="px-6 py-2.5 rounded-xl bg-app-accent hover:opacity-90 text-white font-semibold text-xs shadow-sm flex items-center space-x-2 transition disabled:opacity-50"
            >
              {analysisLoading ? (
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
      </div>

      {/* Results Presentation (Minimalist Verdict Card) */}
      {currentResult && (
        <MinimalResultVerdict 
          result={currentResult} 
          mode={resultMode} 
          language={language} 
          t={t} 
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MINIMALIST VERDICT PRESENTER (High-Craft SaaS Card)
// -------------------------------------------------------------
function MinimalResultVerdict({ result, mode, language, t }: any) {
  const score = result.overallRiskScore ?? result.riskScore ?? result.compositeNlpScore ?? 0;
  const isHighRisk = score >= 65;
  const isSuspicious = score >= 35 && score < 65;
  const isSafe = score < 35;

  return (
    <div className={`p-6 rounded-2xl border transition-all space-y-6 shadow-sm ${
      isHighRisk 
        ? "border-red-500/30 bg-red-500/[0.02]" 
        : isSuspicious 
        ? "border-amber-500/30 bg-amber-500/[0.02]" 
        : "border-emerald-500/30 bg-emerald-500/[0.02]"
    }`}>
      {/* Top Verdict Row */}
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
              {isHighRisk 
                ? (language === "hi" ? "गंभीर खतरा" : "Critical Threat") 
                : isSuspicious 
                ? (language === "hi" ? "संदिग्ध" : "Suspicious") 
                : (language === "hi" ? "सत्यापित सुरक्षित" : "Verified Authentic")}
            </span>
            <span className="text-xs text-app-muted font-mono font-medium">
              {t.zeroTrustScoreLabel}: {result.metrics?.zeroTrustScore ?? Math.max(5, 100 - score)}/100
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-app-text mt-2 leading-snug">
            {language === "en" ? (result.threatSummaryEn || result.explanationEn) : (result.threatSummaryHi || result.explanationHi)}
          </h3>
        </div>

        {/* Minimal Threat Score Metric Gauge */}
        <div className="flex items-center space-x-3 bg-app-surface px-4 py-2.5 rounded-xl border border-app-border self-start sm:self-auto font-mono shadow-2xs">
          <div className="text-right">
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
      </div>

      {/* 4 Clean Metric Tiles */}
      {result.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricDomain}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.domainTrust}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricProtocol}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.protocolSecurity}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricUrgency}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.linguisticUrgency}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-app-surface border border-app-border shadow-2xs">
            <div className="text-[11px] text-app-muted font-medium">{t.metricImpersonation}</div>
            <div className="text-sm font-bold text-app-text mt-1">{result.metrics.impersonationRisk}%</div>
          </div>
        </div>
      )}

      {/* Technical Flags Pill List */}
      {(result.keyFlags || result.flags) && (
        <div className="space-y-2">
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

      {/* UPI Intent Breakdown if available */}
      {result.upiDetails && (
        <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-1.5 font-mono text-xs shadow-2xs">
          <div className="text-[10px] uppercase text-app-muted font-bold tracking-wider">
            UPI Protocol Parameters
          </div>
          <div className="text-app-text">
            Payee: <span className="font-semibold text-app-accent">{result.upiDetails.payeeName}</span> ({result.upiDetails.payeeVpa})
          </div>
          {result.upiDetails.amount && (
            <div className="text-app-text">
              Amount: <span className="font-semibold text-app-accent">₹{result.upiDetails.amount}</span>
            </div>
          )}
          {result.isReverseScam && (
            <div className="text-red-600 font-semibold pt-1 flex items-center space-x-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Reverse-Charge Anomaly: Scanning a QR can only debit funds, never receive funds!</span>
            </div>
          )}
        </div>
      )}

      {/* Action / Remediation */}
      <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2 text-xs shadow-2xs">
        <div className="font-bold text-app-text flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-emerald-500" />
          <span>{t.remediationTitle}</span>
        </div>
        <div className="text-app-secondary leading-relaxed">
          {language === "hi" 
            ? (isHighRisk 
                ? "अनधिकृत लेनदेन से बचने के लिए किसी भी लिंक पर क्लिक न करें और न ही यूपीआई पिन डालें।" 
                : "अपने आधिकारिक बैंक ऐप से सीधे विवरण सत्यापित करें।")
            : (result.actionChecklist?.immediateAction || "Do not input credentials or authorize payment.")}
        </div>
        <div className="text-[11px] font-mono text-app-muted pt-1 flex items-center justify-between">
          <span>{t.reportTo1930}</span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-app-text underline inline-flex items-center space-x-1"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
