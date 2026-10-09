"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Zap, 
  BookOpen, 
  Clock, 
  MessageSquareHeart, 
  Users, 
  ShieldAlert, 
  PhoneCall, 
  PanelLeftClose, 
  PanelLeftOpen, 
  LogOut,
  ChevronDown,
  Link as LinkIcon,
  MessageSquare,
  QrCode,
  Lock,
  Cpu,
  BarChart3,
  Scale,
  Menu,
  X
} from "lucide-react";
import { Language, Theme } from "@/lib/i18n";
import { User } from "firebase/auth";

export type NavTab = "scanner" | "simulator" | "history" | "social" | "docs" | "about" | "admin";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  scannerMode: "url" | "message" | "qr";
  setScannerMode: (mode: "url" | "message" | "qr") => void;
  docsSection: string;
  setDocsSection: (sec: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  user: User | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  t: any;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  scannerMode,
  setScannerMode,
  docsSection,
  setDocsSection,
  language,
  setLanguage,
  theme,
  onThemeChange,
  user,
  authLoading,
  onSignIn,
  onSignOut,
  isCollapsed,
  setIsCollapsed,
  mobileOpen = false,
  setMobileOpen,
  t
}: SidebarProps) {
  const [scannerMenuOpen, setScannerMenuOpen] = useState(true);
  const [docsMenuOpen, setDocsMenuOpen] = useState(true);

  const handleSelectScannerSub = (mode: "url" | "message" | "qr") => {
    setActiveTab("scanner");
    setScannerMode(mode);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleSelectDocsSub = (sec: string) => {
    setActiveTab("docs");
    setDocsSection(sec);
    if (setMobileOpen) setMobileOpen(false);
    if (typeof window !== "undefined") {
      const el = document.getElementById(sec);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (setMobileOpen) setMobileOpen(false);
  };

  const scannerSubItems = [
    { mode: "url" as const, label: t.navScannerUrl, icon: LinkIcon, color: "text-rose-500" },
    { mode: "message" as const, label: t.navScannerMessage, icon: MessageSquare, color: "text-purple-500" },
    { mode: "qr" as const, label: t.navScannerQr, icon: QrCode, color: "text-emerald-500" },
  ];

  const docsSubItems = [
    { sec: "overview", label: t.navDocsProblem, icon: BookOpen },
    { sec: "architecture", label: t.navDocsArchitecture, icon: Lock },
    { sec: "engines", label: t.navDocsEngines, icon: Cpu },
    { sec: "benchmark", label: t.navDocsBenchmark, icon: BarChart3 },
    { sec: "legal", label: t.navDocsLegal, icon: Scale },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-app-surface border-r border-app-border transition-all duration-300 ease-in-out select-none ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-app-border/80">
          {(!isCollapsed || mobileOpen) && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-xl bg-app-accent text-white flex items-center justify-center shadow-sm shrink-0 font-bold transition-transform hover:scale-105">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm tracking-tight text-app-text">
                    ScamShield
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-accent border border-app-border">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-app-muted truncate font-mono">
                  IEEE Track 04.1
                </span>
              </div>
            </div>
          )}

          {isCollapsed && !mobileOpen && (
            <div className="h-8 w-8 mx-auto rounded-xl bg-app-accent text-white flex items-center justify-center shadow-sm font-bold">
              <Shield className="h-4 w-4" />
            </div>
          )}

          <div className="flex items-center space-x-1">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden md:flex p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-surface-subtle transition ${
                isCollapsed ? "mx-auto mt-2" : ""
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-surface-subtle transition"
              title="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 text-xs">
        {/* 1. THREAT SCANNER (Accordion with Link, SMS, QR sub-items) - Task 1 */}
        <div className="space-y-0.5">
          <div
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
              activeTab === "scanner"
                ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
                : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
            }`}
            onClick={() => {
              setActiveTab("scanner");
              if (!isCollapsed) setScannerMenuOpen(!scannerMenuOpen);
            }}
            title={t.navScanner}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Shield className={`h-4 w-4 shrink-0 ${activeTab === "scanner" ? "text-app-accent" : "text-app-muted"}`} />
              {!isCollapsed && <span className="truncate">{t.navScanner}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`h-3.5 w-3.5 text-app-muted transition-transform duration-200 ${
                  scannerMenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {/* Sub-items (Website Link, SMS/Message, QR Code & UPI) */}
          {!isCollapsed && scannerMenuOpen && (
            <div className="pl-6 pr-1 pt-1 space-y-0.5 animate-in fade-in duration-200">
              {scannerSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === "scanner" && scannerMode === sub.mode;
                return (
                  <button
                    key={sub.mode}
                    onClick={() => handleSelectScannerSub(sub.mode)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                      isSubActive
                        ? "bg-app-surface text-app-text font-bold shadow-2xs border border-app-border"
                        : "text-app-muted hover:text-app-text hover:bg-app-surface-subtle/40"
                    }`}
                  >
                    <SubIcon className={`h-3.5 w-3.5 shrink-0 ${sub.color}`} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. ATTACK SIMULATOR */}
        <button
          onClick={() => handleTabClick("simulator")}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition ${
            activeTab === "simulator"
              ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
              : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
          }`}
          title={t.navSimulator}
        >
          <Zap className={`h-4 w-4 shrink-0 ${activeTab === "simulator" ? "text-amber-500" : "text-app-muted"}`} />
          {(!isCollapsed || mobileOpen) && <span>{t.navSimulator}</span>}
        </button>

        {/* 3. SCAN HISTORY (Task 2) */}
        <button
          onClick={() => handleTabClick("history")}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition ${
            activeTab === "history"
              ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
              : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
          }`}
          title={t.navHistory}
        >
          <Clock className={`h-4 w-4 shrink-0 ${activeTab === "history" ? "text-indigo-500" : "text-app-muted"}`} />
          {(!isCollapsed || mobileOpen) && <span>{t.navHistory}</span>}
        </button>

        {/* 4. COMMUNITY STORIES (Task 3) */}
        <button
          onClick={() => handleTabClick("social")}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition ${
            activeTab === "social"
              ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
              : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
          }`}
          title={t.navSocial}
        >
          <MessageSquareHeart className={`h-4 w-4 shrink-0 ${activeTab === "social" ? "text-rose-500" : "text-app-muted"}`} />
          {(!isCollapsed || mobileOpen) && <span>{t.navSocial}</span>}
        </button>

        {/* 5. DOCUMENTATION (Accordion with Section Links) - Task 4 */}
        <div className="space-y-0.5 pt-1">
          <div
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
              activeTab === "docs"
                ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
                : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
            }`}
            onClick={() => {
              handleTabClick("docs");
              if (!isCollapsed || mobileOpen) setDocsMenuOpen(!docsMenuOpen);
            }}
            title={t.navDocs}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <BookOpen className={`h-4 w-4 shrink-0 ${activeTab === "docs" ? "text-app-accent" : "text-app-muted"}`} />
              {(!isCollapsed || mobileOpen) && <span className="truncate">{t.navDocs}</span>}
            </div>
            {(!isCollapsed || mobileOpen) && (
              <ChevronDown
                className={`h-3.5 w-3.5 text-app-muted transition-transform duration-200 ${
                  docsMenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {/* Sub-items for documentation sections */}
          {(!isCollapsed || mobileOpen) && docsMenuOpen && (
            <div className="pl-6 pr-1 pt-1 space-y-0.5 animate-in fade-in duration-200">
              {docsSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === "docs" && docsSection === sub.sec;
                return (
                  <button
                    key={sub.sec}
                    onClick={() => handleSelectDocsSub(sub.sec)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                      isSubActive
                        ? "bg-app-surface text-app-text font-bold shadow-2xs border border-app-border"
                        : "text-app-muted hover:text-app-text hover:bg-app-surface-subtle/40"
                    }`}
                  >
                    <SubIcon className="h-3 w-3 shrink-0 text-app-muted" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. ABOUT TEAM (Task 5) */}
        <button
          onClick={() => handleTabClick("about")}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition ${
            activeTab === "about"
              ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
              : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
          }`}
          title={t.navAbout}
        >
          <Users className={`h-4 w-4 shrink-0 ${activeTab === "about" ? "text-app-accent" : "text-app-muted"}`} />
          {(!isCollapsed || mobileOpen) && <span>{t.navAbout}</span>}
        </button>

        {/* 7. ADMIN CONSOLE (Task 7) */}
        <button
          onClick={() => handleTabClick("admin")}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition ${
            activeTab === "admin"
              ? "bg-app-surface-subtle text-app-text font-bold shadow-xs border border-app-border/60"
              : "text-app-secondary hover:text-app-text hover:bg-app-surface-subtle/50"
          }`}
          title={t.navAdmin}
        >
          <ShieldAlert className={`h-4 w-4 shrink-0 ${activeTab === "admin" ? "text-purple-600" : "text-app-muted"}`} />
          {(!isCollapsed || mobileOpen) && (
            <div className="flex items-center justify-between w-full">
              <span>{t.navAdmin}</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20 font-bold">
                Admin
              </span>
            </div>
          )}
        </button>

        {/* Helpline Card */}
        {!isCollapsed && (
          <div className="pt-4">
            <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1.5 transition-transform hover:scale-[1.02]">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-app-text">
                <PhoneCall className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Cyber Helpline: 1930</span>
              </div>
              <p className="text-[10px] text-app-muted leading-tight">
                Report financial cyber fraud within the 2-hour Golden Hour window.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls: Themes, Language, Auth */}
      <div className="p-3 border-t border-app-border bg-app-surface-subtle/30 space-y-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between gap-1 pt-1">
            {/* Color Theme Selector Swatches */}
            <div className="flex items-center bg-app-surface p-1 rounded-lg border border-app-border gap-1">
              <button
                onClick={() => onThemeChange("light")}
                title={t.themeCleanLight}
                className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                  theme === "light" ? "ring-2 ring-app-accent shadow-xs scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-white border border-zinc-300 shadow-2xs"></div>
              </button>
              <button
                onClick={() => onThemeChange("green")}
                title={t.themeGlassMint}
                className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                  theme === "green" ? "ring-2 ring-emerald-500 shadow-xs scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-400"></div>
              </button>
              <button
                onClick={() => onThemeChange("purple")}
                title={t.themeLavender}
                className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                  theme === "purple" ? "ring-2 ring-purple-500 shadow-xs scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-purple-400"></div>
              </button>
              <button
                onClick={() => onThemeChange("yellow")}
                title={t.themeSolarAmber}
                className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                  theme === "yellow" ? "ring-2 ring-amber-500 shadow-xs scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-amber-400"></div>
              </button>
              <button
                onClick={() => onThemeChange("black")}
                title={t.themeObsidianDark}
                className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                  theme === "black" ? "ring-2 ring-zinc-400 shadow-xs scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-zinc-900 border border-zinc-700"></div>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex bg-app-surface p-0.5 rounded-lg border border-app-border text-[11px] font-medium">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-md transition ${
                  language === "en" ? "bg-app-surface-subtle text-app-text font-bold shadow-2xs" : "text-app-muted hover:text-app-text"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded-md transition ${
                  language === "hi" ? "bg-app-surface-subtle text-app-text font-bold shadow-2xs" : "text-app-muted hover:text-app-text"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        )}

        {/* User Account / Auth */}
        <div className="pt-1">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-app-surface border border-app-border">
              <div className="flex items-center space-x-2 overflow-hidden">
                {user.photoURL ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="h-7 w-7 rounded-full object-cover shrink-0 border border-app-border"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-app-accent text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {user.displayName ? user.displayName[0] : "A"}
                  </div>
                )}
                {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-app-text truncate">
                      {user.displayName || "Analyst"}
                    </span>
                    <span className="text-[10px] text-app-muted truncate font-mono">
                      {user.email || "SecOps"}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={onSignOut}
                  title={t.signOut}
                  className="p-1.5 rounded-lg text-app-muted hover:text-red-500 hover:bg-app-surface-subtle transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={authLoading}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-app-text text-xs font-medium transition shadow-2xs ${
                isCollapsed ? "px-1" : ""
              }`}
              title={t.signIn}
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              {!isCollapsed && <span>{authLoading ? t.connecting : t.signIn}</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
