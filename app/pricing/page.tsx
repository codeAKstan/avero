"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  Zap,
} from "lucide-react";

export default function PricingPage() {
  const [monthlyPrice, setMonthlyPrice] = useState(5000);
  const [annualPrice, setAnnualPrice] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<"pro_monthly" | "pro_annual" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (typeof data.settings.monthlyPriceNaira === "number") {
            setMonthlyPrice(data.settings.monthlyPriceNaira);
          }
          if (typeof data.settings.annualPriceNaira === "number") {
            setAnnualPrice(data.settings.annualPriceNaira);
          }
        }
      })
      .catch((err) => console.error("Error loading pricing settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (plan: "pro_monthly" | "pro_annual") => {
    try {
      setLoadingPlan(plan);
      setErrorMessage("");

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to launch Paystack checkout.");
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "An error occurred initiating transaction.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Invest in Your Board Exam Success
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Unlock unlimited access to thousands of past questions, active-recall flashcards, and personalized study planning.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-semibold max-w-lg mx-auto text-center">
            {errorMessage}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Freemium Tier Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Access</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Freemium Plan</h3>
                <p className="text-xs text-slate-500">Essential starter preview for students</p>
              </div>

              <div className="py-2">
                <div className="text-4xl font-extrabold text-slate-900">₦0</div>
                <div className="text-xs text-slate-400 font-medium">Free forever</div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access to free sample courses & past questions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Practice mode (up to course question limits)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <XCircleIcon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Save / bookmark challenging questions</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <XCircleIcon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Active-recall flashcards engine</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <XCircleIcon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Habit-building daily study planner & reminders</span>
                </div>
              </div>
            </div>

            <Link
              href="/signup"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Membership Card */}
          <div className="bg-gradient-to-b from-white to-blue-50/40 border-2 border-[#2866e1] rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2866e1] text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-2xl tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2866e1] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Full Platform Access
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Avero Pro Pass</h3>
                <p className="text-xs text-slate-500">For serious nursing board candidates</p>
              </div>

              <div className="py-2">
                {loading || monthlyPrice === null || annualPrice === null ? (
                  <div className="h-12 flex items-center text-slate-400 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading prices...
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-extrabold text-slate-900">
                      ₦{monthlyPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ month</span>
                    </div>
                    <div className="text-xs text-[#2866e1] font-bold mt-1">
                      Or ₦{annualPrice.toLocaleString()} / year (Save 17%)
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200/60 pt-4 space-y-3 text-xs text-slate-800 font-semibold">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                  <span>100% Unlimited access to all past question banks</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                  <span>Save & bookmark questions for targeted revision</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                  <span>Full spaced-repetition active recall flashcards</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                  <span>Habit-building daily study planner & push reminders</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                  <span>Timed exam simulation mode with score reports</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCheckout("pro_monthly")}
                disabled={loadingPlan !== null || monthlyPrice === null}
                className="w-full py-3.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {loadingPlan === "pro_monthly" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Subscribe Monthly {monthlyPrice !== null ? `(₦${monthlyPrice.toLocaleString()})` : ""}
                  </>
                )}
              </button>

              <button
                onClick={() => handleCheckout("pro_annual")}
                disabled={loadingPlan !== null || annualPrice === null}
                className="w-full py-2.5 bg-blue-100/70 hover:bg-blue-200/80 text-[#2866e1] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {loadingPlan === "pro_annual" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe Annual {annualPrice !== null ? `(₦${annualPrice.toLocaleString()})` : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-200/60 pt-8 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit Encrypted Paystack Payments</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Cards, Bank Transfer & USSD Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={`fill-current ${className || "w-4 h-4"}`} viewBox="0 0 24 24">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  );
}
