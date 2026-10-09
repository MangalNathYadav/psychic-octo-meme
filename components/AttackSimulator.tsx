"use client";

import React, { useState } from "react";
import { 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  CreditCard,
  Lock,
  ChevronRight
} from "lucide-react";
import { Language } from "@/lib/i18n";

interface AttackSimulatorProps {
  language: Language;
  t: any;
}

export default function AttackSimulator({ language, t }: AttackSimulatorProps) {
  const [simStep, setSimStep] = useState<number>(1);

  const steps = [
    { step: 1, title: t.simStage1, sub: t.simStage1Sub, color: "text-blue-500" },
    { step: 2, title: t.simStage2, sub: t.simStage2Sub, color: "text-amber-500" },
    { step: 3, title: t.simStage3, sub: t.simStage3Sub, color: "text-rose-500" },
    { step: 4, title: t.simStage4, sub: t.simStage4Sub, color: "text-red-600" },
  ];

  return (
    <div className="surface-card rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-app-border/80 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-app-accent font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border">
            IEEE Technical Tenet · Track 04.1
          </span>
          <span className="text-xs font-mono text-app-muted">
            Problem Statement 04.1
          </span>
        </div>
        <h2 className="text-lg font-bold text-app-text mt-2">
          {t.simTitle}
        </h2>
        <p className="text-xs text-app-muted mt-1 max-w-2xl leading-relaxed">
          {t.simSubtitle}
        </p>
      </div>

      {/* Stepper Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {steps.map((st) => (
          <button
            key={st.step}
            onClick={() => setSimStep(st.step)}
            className={`p-3.5 rounded-xl border text-left transition ${
              simStep === st.step
                ? "border-app-accent bg-app-surface-subtle shadow-xs"
                : "border-app-border hover:border-app-muted bg-app-surface"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase ${st.color}`}>
                Stage 0{st.step}
              </span>
              {simStep === st.step && (
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent animate-ping"></span>
              )}
            </div>
            <div className="text-xs font-bold text-app-text mt-1 truncate">
              {st.title}
            </div>
            <div className="text-[11px] text-app-muted mt-0.5 line-clamp-1">
              {st.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Step Detail Content Workspace */}
      <div className="p-6 rounded-2xl border border-app-border bg-app-surface-subtle/70 space-y-5">
        {/* Stage 1: Initial Contact */}
        {simStep === 1 && (
          <div key="step-1" className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-500 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                Stage 01 · Attack Vector Delivery
              </span>
            </div>
            <h3 className="text-base font-bold text-app-text">
              {language === "hi" ? "अज्ञात नंबर से अवांछित संदेश प्राप्ति" : "Unsolicited notification via SMS / WhatsApp"}
            </h3>
            <p className="text-xs text-app-secondary leading-relaxed">
              {language === "hi"
                ? "हमलावर सामान्य 10-अंकीय मोबाइल नंबर या फर्जी सेंडर आईडी (उदा. VK-SBINB) से बल्क एसएमएस भेजता है।"
                : "The attack sequence initiates with an unprompted message delivered through high-open-rate channels (SMS, WhatsApp, or Telegram) using randomized sender numbers."}
            </p>

            {/* Simulated Phone Notification */}
            <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2 max-w-lg shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-app-muted font-mono">
                <span className="flex items-center space-x-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-app-accent" />
                  <span>Incoming SMS · +91-98765-43210</span>
                </span>
                <span>Just now</span>
              </div>
              <div className="p-3 rounded-lg bg-app-surface-subtle border border-app-border text-xs text-app-text font-mono leading-relaxed">
                &quot;SBI Alert: Dear customer your YONO account will be blocked tonight. Update PAN immediately to avoid disruption: http://sbl-kyc-update.xyz/login.php&quot;
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Psychological Panic & Autonomous Interception */}
        {simStep === 2 && (
          <div key="step-2" className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Stage 02 · Cognitive Exploitation
              </span>
            </div>
            <h3 className="text-base font-bold text-app-text">
              {language === "hi" ? "मनोवैज्ञानिक दबाव और 24 घंटे की फर्जी हड़बड़ी" : "Manufactured Panic & Artificial 24-Hour Expiry"}
            </h3>
            <p className="text-xs text-app-secondary leading-relaxed">
              {language === "hi"
                ? "हमलावर कृत्रिम तात्कालिकता पैदा करता है। वित्तीय नुकसान या सेवा बंद होने का डर नागरिक के स्वाभाविक सत्यापन तंत्र को दरकिनार कर देता है।"
                : "Attackers manufacture psychological panic. The fear of account deactivation or power disconnection overrides rational inspection instincts, forcing rapid decision making."}
            </p>

            {/* Pre-Click Interception Banner (THE CORE VALUE PROPOSITION) */}
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>{t.simInterceptTitle}</span>
              </div>
              <p className="text-xs text-app-text leading-relaxed">
                {t.simInterceptDesc}
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{t.simNeutralized}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Credential Harvesting */}
        {simStep === 3 && (
          <div key="step-3" className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-rose-500 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Stage 03 (If Unintercepted) · Credential Siphon
              </span>
            </div>
            <h3 className="text-base font-bold text-app-text">
              {language === "hi" ? "क्लोन वेबसाइट पर क्रेडेंशियल की चोरी" : "Credential Harvesting via Pixel-Perfect Bank Clone"}
            </h3>
            <p className="text-xs text-app-secondary leading-relaxed">
              {language === "hi"
                ? "पीड़ित http://sbl-kyc-update.xyz पर जाकर नेटबैंकिंग क्रेडेंशियल और ओटीपी दर्ज कर देता है, जो हमलावर के सर्वर पर सीधे कैप्चर हो जाते हैं।"
                : "The victim lands on a counterfeit domain mimicking official banking typography and enters NetBanking credentials, card PIN, and OTP directly into the attacker's harvesting script."}
            </p>

            <div className="p-4 rounded-xl bg-app-surface border border-rose-500/30 space-y-2 text-xs">
              <div className="font-mono text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Counterfeit Endpoint: sbl-kyc-update.xyz/login.php</span>
              </div>
              <ul className="list-disc list-inside text-app-muted space-y-1 text-[11px]">
                <li>Punycode/Lookalike: &apos;l&apos; substituted for &apos;i&apos; (sbl vs sbi)</li>
                <li>Free/Disposable TLD (.xyz) registered within the last 48 hours</li>
                <li>Captured payload: NetBanking User ID, Password, SMS OTP relay</li>
              </ul>
            </div>
          </div>
        )}

        {/* Stage 4: Capital Extraction */}
        {simStep === 4 && (
          <div key="step-4" className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-red-600 px-2 py-0.5 rounded bg-red-600/10 border border-red-600/20">
                Stage 04 · Transaction Finality
              </span>
            </div>
            <h3 className="text-base font-bold text-app-text">
              {language === "hi" ? "अनधिकृत यूपीआई लेनदेन और तत्काल धन की निकासी" : "Irreversible Real-Time Capital Extraction via UPI"}
            </h3>
            <p className="text-xs text-app-secondary leading-relaxed">
              {language === "hi"
                ? "चोरी किए गए क्रेडेंशियल से हमलावर कुछ ही सेकंडों में यूपीआई ट्रांसफर कर लेता है। नुकसान के बाद रिकवरी अत्यंत कठिन होती है।"
                : "With live credentials and relayed 2FA OTP, the attacker executes immediate UPI fund transfers to secondary mule accounts. In India's instant payment ecosystem, transfers settle in milliseconds."}
            </p>

            <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2 text-xs">
              <div className="font-bold text-app-text flex items-center space-x-1.5">
                <CreditCard className="h-4 w-4 text-app-accent" />
                <span>Golden Hour Response Protocol</span>
              </div>
              <p className="text-app-muted leading-relaxed text-[11px]">
                If a transaction occurred, immediately dial <strong>1930</strong> or report on <strong>cybercrime.gov.in</strong>. Every minute counts to freeze funds in the beneficiary mule account before ATM cash-out.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setSimStep(Math.max(1, simStep - 1))}
          disabled={simStep === 1}
          className="px-3.5 py-1.5 rounded-xl border border-app-border text-xs text-app-text hover:bg-app-surface-subtle disabled:opacity-30 transition font-medium"
        >
          Previous Stage
        </button>
        <span className="text-xs font-mono text-app-muted">
          Stage {simStep} of 4
        </span>
        <button
          onClick={() => setSimStep(Math.min(4, simStep + 1))}
          disabled={simStep === 4}
          className="px-4 py-1.5 rounded-xl bg-app-accent text-white text-xs hover:opacity-90 disabled:opacity-30 transition font-semibold"
        >
          Next Stage
        </button>
      </div>
    </div>
  );
}
