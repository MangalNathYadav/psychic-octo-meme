"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquareHeart, 
  Plus, 
  ThumbsUp, 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { SocialStory, subscribeToSocialStories, saveSocialStory, toggleLikeSocialStory } from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface SocialViewProps {
  user: User | null;
  onSignIn: () => void;
  language: Language;
  t: any;
}

export default function SocialView({ user, onSignIn, language, t }: SocialViewProps) {
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<SocialStory["scamType"]>("UPI_FRAUD");
  const [formStatus, setFormStatus] = useState<"PREVENTED" | "LOSS_INCURRED">("PREVENTED");
  const [formAmount, setFormAmount] = useState("");
  const [formStory, setFormStory] = useState("");
  const [formLesson, setFormLesson] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToSocialStories((list) => {
      setStories(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLike = async (storyId: string) => {
    const currentUserId = user ? user.uid : "local-user";
    await toggleLikeSocialStory(storyId, currentUserId);
  };

  const handleShareCopy = (story: SocialStory) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `ScamShield Awareness: "${story.title}"\n${story.story}\nLesson: ${story.lessonLearned}`
      );
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formStory.trim()) return;

    setSubmitting(true);
    try {
      await saveSocialStory({
        title: formTitle,
        authorName: anonymous ? "Anonymous Citizen" : (user?.displayName || "Concerned Citizen"),
        authorEmail: anonymous ? undefined : (user?.email || undefined),
        authorPhoto: anonymous ? undefined : (user?.photoURL || undefined),
        userId: user ? user.uid : "guest-user",
        scamType: formCategory,
        status: formStatus,
        lossAmount: formAmount ? (formStatus === "PREVENTED" ? `₹0 (Prevented ₹${formAmount})` : `₹${formAmount} Lost`) : (formStatus === "PREVENTED" ? "₹0 (Shielded in time)" : "Financial Loss"),
        story: formStory,
        lessonLearned: formLesson || "Always verify credentials with the official provider before authorizing transactions.",
        verified: false
      });

      setModalOpen(false);
      setFormTitle("");
      setFormStory("");
      setFormLesson("");
      setFormAmount("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStories = stories.filter((s) => {
    if (filter === "all") return true;
    if (filter === "prevented") return s.status === "PREVENTED";
    if (filter === "loss") return s.status === "LOSS_INCURRED";
    if (filter === s.scamType) return true;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border text-app-accent">
              Citizen Network
            </span>
            <span className="text-xs font-mono text-app-muted">
              Live Scam Awareness Wall
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-app-text mt-1">
            {t.socialTitle}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t.socialSubtitle}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-app-accent text-white font-semibold text-xs transition hover:opacity-90 flex items-center space-x-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{t.shareStoryBtn}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-app-muted">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "all" ? "bg-app-accent text-white border-app-accent shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          {t.socialFilterAll} ({stories.length})
        </button>
        <button
          onClick={() => setFilter("prevented")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "prevented" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          {t.socialFilterPrevented} ({stories.filter(s => s.status === "PREVENTED").length})
        </button>
        <button
          onClick={() => setFilter("loss")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "loss" ? "bg-red-600 text-white border-red-600 shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          {t.socialFilterLoss} ({stories.filter(s => s.status === "LOSS_INCURRED").length})
        </button>
        <button
          onClick={() => setFilter("UPI_FRAUD")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "UPI_FRAUD" ? "bg-app-accent text-white border-app-accent shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          UPI Traps
        </button>
        <button
          onClick={() => setFilter("ELECTRICITY_BILL")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "ELECTRICITY_BILL" ? "bg-app-accent text-white border-app-accent shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          Utility SMS
        </button>
        <button
          onClick={() => setFilter("WHATSAPP_CALL")}
          className={`px-3 py-1.5 rounded-xl border transition font-medium whitespace-nowrap ${
            filter === "WHATSAPP_CALL" ? "bg-app-accent text-white border-app-accent shadow-xs" : "bg-app-surface border-app-border text-app-secondary hover:text-app-text"
          }`}
        >
          Digital Arrest
        </button>
      </div>

      {/* Stories Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-fade-in-up">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card rounded-2xl p-5 border border-app-border space-y-3.5 shadow-2xs">
                <div className="flex justify-between items-center pb-3 border-b border-app-border/60">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full skeleton-shimmer shrink-0" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-32 rounded skeleton-shimmer" />
                      <div className="h-2.5 w-20 rounded skeleton-shimmer opacity-60" />
                    </div>
                  </div>
                  <div className="h-5 w-24 rounded-full skeleton-shimmer" />
                </div>
                <div className="h-4 w-3/5 rounded skeleton-shimmer" />
                <div className="h-12 w-full rounded-xl skeleton-shimmer opacity-70" />
              </div>
            ))}
          </div>
        ) : (
          filteredStories.map((story, idx) => (
            <div
              key={story.id}
              style={{ animationDelay: `${Math.min(idx * 50, 450)}ms` }}
              className="surface-card rounded-2xl p-5 hover:border-app-accent/40 transition-all space-y-3.5 shadow-2xs animate-fade-in-up"
            >
              {/* Story Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border/60 pb-3">
                <div className="flex items-center space-x-2.5">
                  {story.authorPhoto ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                    src={story.authorPhoto}
                    alt={story.authorName}
                    className="h-8 w-8 rounded-full object-cover border border-app-border shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-app-surface-subtle border border-app-border text-app-accent font-bold flex items-center justify-center text-xs shrink-0">
                    {story.authorName[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-app-text">{story.authorName}</span>
                    {story.verified && (
                      <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold" title="Verified incident">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-app-muted font-mono block">
                    {new Date(story.timestamp).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Status and Category Badges */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-app-surface-subtle border border-app-border text-app-muted">
                  {story.scamType.replace("_", " ")}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  story.status === "PREVENTED"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                }`}>
                  {story.lossAmount || (story.status === "PREVENTED" ? "Shielded" : "Loss Incurred")}
                </span>
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-sm font-bold text-app-text mb-1">
                {story.title}
              </h3>
              <p className="text-xs text-app-secondary leading-relaxed">
                {story.story}
              </p>
            </div>

            {/* Lesson Learned Card */}
            {story.lessonLearned && (
              <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-app-accent text-[11px]">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>Key Lesson / Protection Advice</span>
                </div>
                <p className="text-app-muted text-[11px] leading-relaxed">
                  {story.lessonLearned}
                </p>
              </div>
            )}

            {/* Card Actions: Helpful Like & Share */}
            <div className="flex items-center justify-between pt-1 border-t border-app-border/40 text-xs">
              <button
                onClick={() => handleLike(story.id)}
                className="flex items-center space-x-1.5 text-app-secondary hover:text-app-accent transition font-medium"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                <span>Helpful ({story.likesCount})</span>
              </button>

              <button
                onClick={() => handleShareCopy(story)}
                className="text-app-muted hover:text-app-text transition flex items-center space-x-1 text-[11px]"
              >
                <Share2 className="h-3 w-3" />
                <span>{copiedId === story.id ? "Copied!" : "Share Advice"}</span>
              </button>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Share Story Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-app-surface border border-app-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-app-border/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-app-text">
                  {t.shareModalTitle}
                </h3>
                <p className="text-[11px] text-app-muted">
                  Your story helps fellow citizens recognize deceptive patterns.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-app-muted hover:text-app-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-app-text block mb-1">
                  {t.modalTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Received fake Mumbai Police video call on WhatsApp"
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2 text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-app-text block mb-1">
                    {t.modalTypeLabel}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3 py-2 text-app-text focus:outline-none focus:border-app-accent"
                  >
                    <option value="UPI_FRAUD">UPI / QR Fraud</option>
                    <option value="PHISHING_LINK">Phishing Banking Link</option>
                    <option value="ELECTRICITY_BILL">Electricity Bill Notice</option>
                    <option value="WHATSAPP_CALL">WhatsApp / Digital Arrest</option>
                    <option value="JOB_SCAM">Part-Time Task Scam</option>
                    <option value="CUSTOMS_PARCEL">Customs Parcel Scam</option>
                    <option value="OTHER">Other Social Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-app-text block mb-1">
                    {t.modalStatusLabel}
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3 py-2 text-app-text focus:outline-none focus:border-app-accent"
                  >
                    <option value="PREVENTED">Shielded in Time (₹0 Lost)</option>
                    <option value="LOSS_INCURRED">Financial Loss Incurred</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-app-text block mb-1">
                  {t.modalAmountLabel}
                </label>
                <input
                  type="text"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2 text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>

              <div>
                <label className="font-semibold text-app-text block mb-1">
                  {t.modalStoryLabel}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  placeholder="Explain what the scammer claimed, what link/QR code they sent, and how you realized it was fraud..."
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>

              <div>
                <label className="font-semibold text-app-text block mb-1">
                  {t.modalLessonLabel}
                </label>
                <textarea
                  rows={2}
                  value={formLesson}
                  onChange={(e) => setFormLesson(e.target.value)}
                  placeholder="e.g. Always check the official website and never scan QR codes for receiving payments."
                  className="w-full bg-app-surface-subtle border border-app-border rounded-xl p-3 text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="rounded text-app-accent"
                />
                <label htmlFor="anonCheck" className="text-xs text-app-muted cursor-pointer">
                  Post anonymously (do not show my Google name)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-app-border/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-app-muted hover:text-app-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-app-accent text-white font-semibold rounded-xl text-xs hover:opacity-90 transition shadow-2xs"
                >
                  {submitting ? "Publishing..." : t.modalSubmitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
