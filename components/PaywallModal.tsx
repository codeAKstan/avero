"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, Lock, Loader2, ArrowRight } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function PaywallModal({
  isOpen,
  onClose,
  title = "Unlock Avero Pro Membership",
  description = "Get unlimited access to practice questions, spaced-repetition flashcards, study planner, and full exam simulations.",
}: PaywallModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<"pro_monthly" | "pro_annual" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState<number>(5000);
  const [annualPrice, setAnnualPrice] = useState<number>(50000);

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
      .catch((err) => console.error("Error loading pricing settings in PaywallModal:", err));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment.");
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "An error occurred launching payment.");
      setLoadingPlan(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
              <span>Pro Membership Required</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
              {description}
            </p>
          </div>
        </div>

        {/* Pro Benefits List */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unlock 100% of all past questions & rationales</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Save & bookmark questions for quick revision</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Full spaced-repetition flashcards engine</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Habit-building daily study planner & push reminders</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Timed exam simulation mode with score analytics</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Pricing Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Monthly Plan */}
          <button
            onClick={() => handleCheckout("pro_monthly")}
            disabled={loadingPlan !== null}
            className="p-4 bg-white border-2 border-slate-200 hover:border-[#2866e1] rounded-2xl text-left transition relative group cursor-pointer"
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Pass</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">₦{monthlyPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Flexible monthly billing</div>
            
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#2866e1]">
              {loadingPlan === "pro_monthly" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Select Monthly</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </>
              )}
            </div>
          </button>

          {/* Annual Plan */}
          <button
            onClick={() => handleCheckout("pro_annual")}
            disabled={loadingPlan !== null}
            className="p-4 bg-gradient-to-br from-[#2866e1]/5 to-blue-50 border-2 border-[#2866e1] rounded-2xl text-left transition relative group cursor-pointer"
          >
            <div className="absolute -top-2.5 right-3 bg-[#2866e1] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Save 17%
            </div>
            <div className="text-[11px] font-bold text-[#2866e1] uppercase tracking-wider">Annual Pass</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">₦{annualPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ yr</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Full year unlimited access</div>

            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#2866e1]">
              {loadingPlan === "pro_annual" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Select Annual</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
