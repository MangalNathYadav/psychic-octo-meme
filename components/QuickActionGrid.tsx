"use client";

import React from "react";
import { 
  ShieldCheck, 
  Link as LinkIcon, 
  MessageSquare, 
  QrCode, 
  Zap, 
  BarChart3, 
  Layers, 
  Globe, 
  ScanLine 
} from "lucide-react";

interface QuickActionGridProps {
  onSelectAction: (action: "omni" | "url" | "message" | "qr" | "simulation" | "benchmark") => void;
  t: any;
}

export default function QuickActionGrid({ onSelectAction, t }: QuickActionGridProps) {
  const actions = [
    {
      id: "omni",
      title: t.cardInstantScan,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
          <Layers className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "Multi-vector"
    },
    {
      id: "url",
      title: t.cardDomainGuard,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500/10 via-red-500/10 to-orange-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
          <Globe className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "Homograph"
    },
    {
      id: "message",
      title: t.cardMessageNlp,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-purple-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "Hindi/NLP"
    },
    {
      id: "qr",
      title: t.cardQrSentinel,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
          <QrCode className="h-6 w-6" />
          <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "Reverse UPI"
    },
    {
      id: "simulation",
      title: t.cardAttackSimulator,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
          <Zap className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "4-Stage"
    },
    {
      id: "benchmark",
      title: t.cardModelBenchmark,
      icon: (
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
          <BarChart3 className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-zinc-900"></span>
        </div>
      ),
      badge: "100 Samples"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((act) => (
        <button
          key={act.id}
          onClick={() => onSelectAction(act.id as any)}
          className="group action-card-tile rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
        >
          {act.icon}
          <div>
            <div className="text-xs font-semibold text-app-text group-hover:text-app-accent transition-colors">
              {act.title}
            </div>
            <div className="text-[10px] text-app-muted font-mono mt-0.5">
              {act.badge}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
