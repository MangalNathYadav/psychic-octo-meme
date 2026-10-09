"use client";

import React from "react";
import { 
  FileText, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  PhoneCall, 
  Lock, 
  Layers, 
  Terminal,
  Cpu
} from "lucide-react";
import { Language } from "@/lib/i18n";

interface ProjectDossierProps {
  language: Language;
  t: any;
}

export default function ProjectDossier({ language, t }: ProjectDossierProps) {
  const team = [
    {
      name: "Aastik Tripathi",
      reg: "26BCY10090",
      role: language === "hi" ? "लीड सिक्योरिटी आर्किटेक्ट" : "Security Architecture & Lead",
      focus: "Homograph link analysis, Zero-Trust threat scoring engine & system architecture"
    },
    {
      name: "Palak Kalra",
      reg: "26BCY10001",
      role: language === "hi" ? "एनएलपी व भाषाई विशेषज्ञ" : "NLP & Linguistic Intelligence",
      focus: "Multilingual urgency analysis (Hindi देवनागरी, Hinglish & English) & panic modeling"
    },
    {
      name: "Yash Raj Kushwaha",
      reg: "26BCE10122",
      role: language === "hi" ? "फुल-स्टैक व क्लाउड इंजीनियर" : "Full-Stack Integration",
      focus: "Next.js 15, minimalist design system, Firebase Realtime Database & telemetry sync"
    },
    {
      name: "Mangal Nath Yadav",
      reg: "26BHI10047",
      role: language === "hi" ? "यूपीआई व क्यूआर प्रोटोकॉल" : "UPI & QR Protocols",
      focus: "UPI payment intent URI reverse-charge inspection & client QR decoding"
    }
  ];

  return (
    <div className="surface-card rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-app-border/80 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-app-accent font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border">
            IEEE VIT Bhopal STB11518
          </span>
          <span className="text-xs font-mono text-app-muted">
            Build Beyond Boundaries
          </span>
        </div>
        <h2 className="text-lg font-bold text-app-text mt-2">
          {t.dossierTitle}
        </h2>
        <p className="text-xs text-app-muted mt-0.5">
          {t.dossierSubtitle}
        </p>
      </div>

      {/* Problem Context */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2 text-xs">
          <h3 className="font-bold text-app-text flex items-center space-x-2">
            <Lock className="h-4 w-4 text-app-accent" />
            <span>{t.problemContextTitle}</span>
          </h3>
          <p className="text-app-secondary leading-relaxed">
            {t.problemContextText}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono text-app-muted">
            <div className="p-2.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-app-text font-bold block">Vector Focus</span>
              <span>UPI Reverse Traps & Homographs</span>
            </div>
            <div className="p-2.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-app-text font-bold block">Intervention Window</span>
              <span>Pre-Click / Pre-PIN Authorization</span>
            </div>
            <div className="p-2.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-app-text font-bold block">Verification Engine</span>
              <span>Multi-Vector Zero-Trust Heuristics</span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="font-bold text-app-text text-xs mb-3 flex items-center space-x-2">
            <Users className="h-4 w-4 text-app-accent" />
            <span>{t.teamTitle}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {team.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle transition space-y-1.5 shadow-2xs">
                <div className="font-bold text-app-text text-xs">{m.name}</div>
                <div className="font-mono text-[11px] text-app-accent font-semibold">{m.reg}</div>
                <div className="text-[10px] font-medium text-app-secondary">{m.role}</div>
                <p className="text-[10px] text-app-muted leading-tight pt-1 border-t border-app-border/60">
                  {m.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Helplines and References */}
        <div className="p-4 rounded-xl bg-app-surface border border-app-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-app-text">National Cyber Crime Reporting Portal</span>
              <p className="text-[11px] text-app-muted">Toll-free emergency helpline: 1930 · Available 24x7</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-app-accent hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://sancharsaathi.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-app-accent hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Chakshu Portal</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
