"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import PaywallModal from "@/components/PaywallModal";

export default function StudentBillingSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Error fetching user profile:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading billing settings...</span>
      </div>
    );
  }

  const isPro = user?.isPro;
  const planName = isPro ? "Avero Pro Membership" : "Freemium Plan";
  const expiresDate = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8 animate-in fade-in max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Membership & Billing Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Subscription Plan
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          View your membership status, benefits, and upgrade options.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Membership</span>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{planName}</h2>
              {isPro ? (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Pro
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                  Freemium Tier
                </span>
              )}
            </div>
          </div>

          {!isPro ? (
            <button
              onClick={() => setShowPaywallModal(true)}
              className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Upgrade to Pro
            </button>
          ) : (
            <Link
              href="/pricing"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Change Plan
            </Link>
          )}
        </div>

        {/* Expiration / Renewal Details */}
        {isPro && expiresDate && (
          <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-center gap-3 text-xs text-slate-700">
            <Calendar className="w-4 h-4 text-[#2866e1] shrink-0" />
            <span>
              Your Pro membership active period is valid through <strong className="text-slate-900">{expiresDate}</strong>.
            </span>
          </div>
        )}

        {/* Benefits Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Features Included</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-medium text-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-emerald-600" : "text-slate-400"}`} />
              <span>Free Sample Past Questions</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-medium text-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-emerald-600" : "text-slate-300"}`} />
              <span>{isPro ? "Unlimited Question Bookmarks" : "Bookmarking (Pro Only)"}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-medium text-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-emerald-600" : "text-slate-300"}`} />
              <span>{isPro ? "Active-Recall Flashcards" : "Flashcards (Pro Only)"}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-medium text-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-emerald-600" : "text-slate-300"}`} />
              <span>{isPro ? "Daily Study Planner & Reminders" : "Study Planner (Pro Only)"}</span>
            </div>
          </div>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        title="Upgrade to Avero Pro"
      />
    </div>
  );
}
