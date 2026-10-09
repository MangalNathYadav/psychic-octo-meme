"use client";

import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  signInWithGoogle, 
  signOutUser, 
  subscribeToAuthChanges 
} from "@/lib/firebase";
import { translations, Language, Theme } from "@/lib/i18n";
import Sidebar, { NavTab } from "@/components/Sidebar";
import dynamic from "next/dynamic";
import ViewSkeleton from "@/components/ViewSkeleton";
import { Menu, Shield } from "lucide-react";

const ScannerView = dynamic(() => import("@/components/ScannerView"), {
  loading: () => <ViewSkeleton type="scanner" />
});

const AttackSimulator = dynamic(() => import("@/components/AttackSimulator"), {
  loading: () => <ViewSkeleton type="simulator" />
});

const HistoryView = dynamic(() => import("@/components/HistoryView"), {
  loading: () => <ViewSkeleton type="history" />
});

const SocialView = dynamic(() => import("@/components/SocialView"), {
  loading: () => <ViewSkeleton type="social" />
});

const DocumentationView = dynamic(() => import("@/components/DocumentationView"), {
  loading: () => <ViewSkeleton type="docs" />
});

const AboutView = dynamic(() => import("@/components/AboutView"), {
  loading: () => <ViewSkeleton type="about" />
});

const AdminView = dynamic(() => import("@/components/AdminView"), {
  loading: () => <ViewSkeleton type="admin" />
});

const AiAdvisorModal = dynamic(() => import("@/components/AiAdvisorModal"));

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("scanner");
  const [scannerMode, setScannerMode] = useState<"url" | "message" | "qr">("url");
  const [docsSection, setDocsSection] = useState<string>("overview");
  const [reinspectInput, setReinspectInput] = useState<string | undefined>(undefined);
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState(false);

  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[language];

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("scamshield-theme") as Theme;
    const initial = (savedTheme && ["light", "green", "purple", "yellow", "black"].includes(savedTheme))
      ? savedTheme
      : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    document.body.setAttribute("data-theme", initial);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("scamshield-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  // Auth subscription
  useEffect(() => {
    const unsubAuth = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn("Google sign-in notice:", err);
      alert(language === "hi" 
        ? "गूगल साइन-इन: कृपया सुनिश्चित करें कि फ़ायरबेस कंसोल में गूगल ऑथ सक्षम है।" 
        : "Google Sign-In note: " + (err.message || "Ensure Google provider is enabled in Firebase Console."));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn("Sign out notice:", err);
    }
  };

  const handleReinspect = (target: string, type: "url" | "message" | "qr") => {
    setScannerMode(type);
    setReinspectInput(target);
    setActiveTab("scanner");
  };

  return (
    <div className="min-h-screen flex font-sans bg-app-bg text-app-text transition-colors duration-200">
      {/* Streamlined Collapsible Left Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scannerMode={scannerMode}
        setScannerMode={setScannerMode}
        docsSection={docsSection}
        setDocsSection={setDocsSection}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        onThemeChange={handleThemeChange}
        user={user}
        authLoading={authLoading}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        t={t}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
      } pl-0`}>
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-app-surface border-b border-app-border sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-app-text hover:bg-app-surface-subtle border border-app-border"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-1.5">
              <div className="h-6 w-6 rounded-lg bg-app-accent text-white flex items-center justify-center font-bold">
                <Shield className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-sm text-app-text">ScamShield AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">
              Track 04.1
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* TAB 1: THREAT SCANNER (PRIMARY TOOL) - Task 1 */}
          {activeTab === "scanner" && (
            <ScannerView
              user={user}
              scannerMode={scannerMode}
              setScannerMode={setScannerMode}
              language={language}
              t={t}
              initialInput={reinspectInput}
              onOpenAiAdvisor={() => setAiAdvisorOpen(true)}
              onSelectTrackBanner={() => setActiveTab("docs")}
            />
          )}

          {/* TAB 2: ATTACK SIMULATOR (4-STAGE SCAM ANATOMY) */}
          {activeTab === "simulator" && (
            <AttackSimulator
              language={language}
              t={t}
            />
          )}

          {/* TAB 3: SCAN HISTORY VAULT (Task 2) */}
          {activeTab === "history" && (
            <HistoryView
              user={user}
              onSelectScanForReinspect={handleReinspect}
              onSignIn={handleGoogleSignIn}
              language={language}
              t={t}
            />
          )}

          {/* TAB 4: COMMUNITY SCAM STORIES WALL (Task 3) */}
          {activeTab === "social" && (
            <SocialView
              user={user}
              onSignIn={handleGoogleSignIn}
              language={language}
              t={t}
            />
          )}

          {/* TAB 5: DOCUMENTATION & SPECIFICATIONS (Task 4) */}
          {activeTab === "docs" && (
            <DocumentationView
              language={language}
              t={t}
            />
          )}

          {/* TAB 6: ABOUT TEAM D43M0N$ (Task 5) */}
          {activeTab === "about" && (
            <AboutView
              language={language}
              t={t}
            />
          )}

          {/* TAB 7: ADMIN & OPERATIONS CONSOLE (Task 7) */}
          {activeTab === "admin" && (
            <AdminView
              user={user}
              language={language}
              t={t}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-app-border/80 py-4 px-4 sm:px-8 text-xs text-app-muted bg-app-surface/50">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {language === "hi" ? "राष्ट्रीय साइबर अपराध हेल्पलाइन: " : "National Cyber Crime Helpline: "}
                <strong className="text-app-text font-bold">1930</strong> ·{" "}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-app-text"
                >
                  cybercrime.gov.in
                </a>
              </span>
            </div>
            <div className="font-mono text-[11px]">
              {t.footerRights}
            </div>
          </div>
        </footer>
      </div>

      {/* Global AI Cyber Advisor Slide-over / Modal */}
      <AiAdvisorModal
        isOpen={aiAdvisorOpen}
        onClose={() => setAiAdvisorOpen(false)}
        language={language}
      />
    </div>
  );
}
