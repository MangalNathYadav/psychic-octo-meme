"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface TopHeaderProps {
  user: User | null;
  language: Language;
  onOpenAiAdvisor: () => void;
  onSelectTrackBanner: () => void;
  t: any;
}

export default function TopHeader({
  user,
  language,
  onOpenAiAdvisor,
  onSelectTrackBanner,
  t
}: TopHeaderProps) {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting(language === "hi" ? t.workspaceGreetingMorning : "Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting(language === "hi" ? t.workspaceGreetingAfternoon : "Good afternoon");
    } else {
      setGreeting(language === "hi" ? t.workspaceGreetingEvening : "Good evening");
    }
  }, [language, t]);

  const userName = user?.displayName ? user.displayName.split(" ")[0] : t.workspaceAnalyst;

  return (
    <div className="space-y-4">
      {/* Top Banner Announcement (Matching ElevenLabs top badge pill) */}
      <div className="flex items-center">
        <button
          onClick={onSelectTrackBanner}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-app-surface border border-app-border text-xs text-app-secondary hover:text-app-text hover:border-app-muted transition shadow-2xs group"
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

      {/* Workspace Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-app-muted tracking-wide uppercase font-semibold">
            {t.workspaceSub}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-text mt-0.5">
            {greeting}, {userName}
          </h1>
        </div>

        {/* Right Action: Have a question? [Ask AI Advisor] */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs text-app-muted hidden md:inline">
            {t.haveQuestion}
          </span>
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs hover:shadow-xs group"
          >
            <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shrink-0">
              <Sparkles className="h-2.5 w-2.5" />
            </div>
            <span>{t.askAiBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
