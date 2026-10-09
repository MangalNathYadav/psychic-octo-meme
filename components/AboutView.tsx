"use client";

import React from "react";
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Terminal, 
  Globe, 
  Layers, 
  Award, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  Shield, 
  CheckCircle2, 
  HeartHandshake,
  Mail,
  GraduationCap
} from "lucide-react";
import { Language } from "@/lib/i18n";

interface AboutViewProps {
  language: Language;
  t: any;
}

export default function AboutView({ language, t }: AboutViewProps) {
  const teamMembers = [
    {
      name: "Aastik Tripathi",
      regNo: "26BCY10090",
      role: language === "hi" ? "लीड सिक्योरिटी आर्किटेक्ट" : "Lead Security Architect",
      badge: "Team Lead",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      avatarBg: "from-blue-600 to-indigo-600",
      initials: "AT",
      focus: language === "hi"
        ? "होमोफ़ोन लिंक विश्लेषण, ज़ीरो-ट्रस्ट स्कोरिंग एल्गोरिद्म और कोर आर्किटेक्चर पाइपलाइन।"
        : "Homograph typosquatting link analysis, Punycode heuristics, Zero-Trust threat scoring engine & core pipeline architecture.",
      skills: ["Zero-Trust Security", "Homograph Analysis", "System Design", "Cryptography"]
    },
    {
      name: "Palak Kalra",
      regNo: "26BCY10001",
      role: language === "hi" ? "एनएलपी व भाषाई विशेषज्ञ" : "NLP & Linguistic Intelligence",
      badge: "AI / NLP Lead",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      avatarBg: "from-purple-600 to-pink-600",
      initials: "PK",
      focus: language === "hi"
        ? "बहुभाषी पैनिक कीवर्ड विश्लेषण (हिंदी देवनागरी, हिंग्लिश व अंग्रेजी) और मनोवैज्ञानिक दबाव डिटेक्शन।"
        : "Multilingual urgency analysis (Hindi देवनागरी, Hinglish & English), psychological panic modeling & authority impersonation detection.",
      skills: ["Multilingual NLP", "Hindi/Hinglish Text Heuristics", "Social Engineering Profiling", "Sentiment Scoring"]
    },
    {
      name: "Yash Raj Kushwaha",
      regNo: "26BCE10122",
      role: language === "hi" ? "फुल-स्टैक व क्लाउड इंजीनियर" : "Full-Stack Integration & Cloud",
      badge: "Full-Stack Lead",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      avatarBg: "from-emerald-600 to-teal-600",
      initials: "YK",
      focus: language === "hi"
        ? "Next.js 15, रिएक्ट 19, मिनिमलिस्ट डिज़ाइन सिस्टम, फ़ायरबेस रीयलटाइम डेटाबेस और टेलीमेट्री।"
        : "Next.js 15 App Router, React 19, minimalist glassmorphic design system, Firebase Realtime Database telemetry & persistent scan history.",
      skills: ["Next.js 15", "React 19", "Firebase RTDB", "Tailwind CSS", "Cloud Architecture"]
    },
    {
      name: "Mangal Nath Yadav",
      regNo: "26BHI10047",
      role: language === "hi" ? "यूपीआई व क्यूआर प्रोटोकॉल" : "UPI & QR Protocol Sentinel",
      badge: "FinTech Protocols",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      avatarBg: "from-amber-600 to-orange-600",
      initials: "MY",
      focus: language === "hi"
        ? "यूपीआई पेमेंट इंटेंट यूआरआई रिवर्स-चार्ज निरीक्षण, मर्चेंट सत्यापन और क्लाइंट क्यूआर डिकोडिंग।"
        : "UPI payment intent URI reverse-charge heuristics, merchant VPA authentication, client-side QR image matrix decoding & fraud prevention.",
      skills: ["UPI Intent Protocols", "QR Image Matrix Decoding", "NPCI Guidelines", "Reverse Debit Heuristics"]
    }
  ];

  const techStack = [
    { name: "Next.js 15", category: "Core Framework", desc: "App Router with hybrid SSR/CSR & optimized bundles" },
    { name: "React 19", category: "UI Engine", desc: "Modern concurrent rendering & fine-grained state hooks" },
    { name: "Tailwind CSS", category: "Design System", desc: "Semantic color tokens with 5 adaptive accessible themes" },
    { name: "Firebase RTDB", category: "Realtime Telemetry", desc: "Low-latency threat report feeds & user scan history vaults" },
    { name: "Firebase Auth", category: "Identity", desc: "Seamless Google SSO with anonymous guest state support" },
    { name: "jsQR Engine", category: "Client Forensic", desc: "Pure client-side Canvas QR matrix parsing without server leak" },
    { name: "Multilingual NLP", category: "AI Detection", desc: "Hindi (देवनागरी), Hinglish & English urgency heuristic analyzer" },
    { name: "Zero-Trust Engine", category: "Security Logic", desc: "Dynamic composite risk assessment with deterministic rules" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Hero Header Card */}
      <div className="surface-card rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-app-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-app-accent/10 text-app-accent border border-app-accent/20">
                Team D43M0N$
              </span>
              <span className="text-xs font-mono text-app-muted">
                IEEE STB11518 · VIT Bhopal University
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                Track 04.1
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {t.aboutTitle || "About Team D43M0N$"}
            </h1>

            <p className="text-xs sm:text-sm text-app-secondary leading-relaxed">
              {t.aboutMission || "Our Mission: Shifting cyber defense in India from reactive post-theft disputes to autonomous, pre-click Zero-Trust protection against social engineering attacks."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border shrink-0 text-center space-y-1">
            <div className="text-[10px] font-mono uppercase text-app-muted font-bold">Hackathon 2026</div>
            <div className="text-lg font-extrabold text-app-text tracking-tight">Build Beyond Boundaries</div>
            <div className="text-[11px] font-mono text-app-accent font-semibold">Track 04 · Cybersecurity</div>
          </div>
        </div>
      </div>

      {/* Problem Statement 04.1 Challenge Overview */}
      <div className="surface-card rounded-2xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2">
          <Shield className="h-4 w-4 text-app-accent" />
          <h2>Problem Statement 04.1: &quot;The Scam That Almost Worked&quot;</h2>
        </div>
        <p className="text-xs text-app-secondary leading-relaxed">
          Financial cyber fraud in India has scaled exponentially because attackers don&apos;t attempt to break cryptographic bank encryptions; instead, they exploit <strong>psychological pressure points</strong>. Victims are terrified by manufactured deadlines (&quot;Electricity disconnected in 30 minutes&quot; or &quot;Netbanking permanently blocked&quot;) and tricked into typing UPI PINs to &quot;receive&quot; funds. <strong>ScamShield AI</strong> provides the critical missing defensive layer: an autonomous guardian that halts the user <em>before</em> they tap or authorize.
        </p>
      </div>

      {/* Team Member Cards Grid (4 members) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-app-text font-bold text-sm">
          <Users className="h-4 w-4 text-app-accent" />
          <h2>Core Developers & Security Researchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.regNo}
              className="surface-card rounded-2xl p-5 shadow-2xs border border-app-border hover:border-app-accent/40 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${member.avatarBg} text-white font-bold font-mono text-sm flex items-center justify-center shadow-xs shrink-0`}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-app-text">{member.name}</h3>
                      </div>
                      <div className="text-xs text-app-accent font-semibold mt-0.5">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${member.badgeColor}`}>
                    {member.badge}
                  </span>
                </div>

                <div className="mt-3.5 pt-3 border-t border-app-border/60">
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-app-muted mb-2">
                    <GraduationCap className="h-3.5 w-3.5 text-app-muted" />
                    <span>Reg. No: <strong className="text-app-text">{member.regNo}</strong></span>
                    <span>· VIT Bhopal University</span>
                  </div>
                  <p className="text-xs text-app-secondary leading-relaxed">
                    {member.focus}
                  </p>
                </div>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {member.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-app-surface-subtle text-app-muted border border-app-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack & Architecture Grid */}
      <div className="surface-card rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2">
          <Code2 className="h-4 w-4 text-app-accent" />
          <h2>Engine Architecture & Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1 transition hover:bg-app-surface"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-app-text">{tech.name}</span>
                <span className="text-[9px] font-mono uppercase text-app-muted px-1.5 py-0.2 rounded bg-app-surface border border-app-border">
                  {tech.category}
                </span>
              </div>
              <p className="text-[11px] text-app-muted leading-tight">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card rounded-2xl p-5 shadow-2xs space-y-2 border border-app-border">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-xs text-app-text">Zero-Trust Pre-Click Interception</h3>
          <p className="text-[11px] text-app-muted leading-relaxed">
            Never trust user input or link assertions. Decouples link payload, parses Punycode, and audits domain age before any browser navigation occurs.
          </p>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-2xs space-y-2 border border-app-border">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-xs text-app-text">Multilingual Linguistic Shield</h3>
          <p className="text-[11px] text-app-muted leading-relaxed">
            Detects psychological pressure triggers in Hindi (देवनागरी), Hinglish, and English, calculating urgency scores and unmasking fake government authority.
          </p>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-2xs space-y-2 border border-app-border">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-xs text-app-text">Pure Client-Side Privacy</h3>
          <p className="text-[11px] text-app-muted leading-relaxed">
            All QR image matrix scans and SMS text heuristic evaluations run entirely within the client&apos;s browser sandbox—ensuring private messages are never leaked.
          </p>
        </div>
      </div>

      {/* Institutional Credits & Statutory Advisory */}
      <div className="surface-card rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-app-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-xs text-app-text">IEEE Student Branch STB11518</span>
          </div>
          <p className="text-[11px] text-app-muted">
            Vellore Institute of Technology (VIT) Bhopal University, Kothrikalan, Sehore, Madhya Pradesh - 466114.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs"
          >
            <span>National Helpline 1930</span>
            <ExternalLink className="h-3 w-3 text-app-muted" />
          </a>
        </div>
      </div>
    </div>
  );
}
