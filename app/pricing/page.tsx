"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Check, X, ArrowRight, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const heroRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      if (comparisonRef.current) {
        gsap.fromTo(
          comparisonRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center selection:bg-[#2866e1]/20 selection:text-[#0f172a] w-full bg-[#f5f8ff] bg-dot-pattern">
      <Header />

      {/* Page Hero Header */}
      <section ref={heroRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
          Transparent Pricing
        </div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-5xl md:text-6xl text-[#0f172a] tracking-tight mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
          Invest in your clinical confidence
        </h1>
        <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Start for free with core course practice, upgrade when you need unlimited active recall power and board exam preparation.
        </p>

        {/* Billing Toggle (Monthly / Annual) */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className={`text-xs sm:text-sm font-medium ${billingCycle === "monthly" ? "text-slate-900 font-bold" : "text-slate-500"}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors relative focus:outline-none"
          >
            <div
              className={`w-6 h-6 bg-[#2866e1] rounded-full transition-transform ${billingCycle === "annual" ? "translate-x-6" : "translate-x-0"}`}
            ></div>
          </button>
          <span className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${billingCycle === "annual" ? "text-slate-900 font-bold" : "text-slate-500"}`}>
            Annual Billing
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Embed Interactive Pricing Grid Component */}
      <Pricing />

      {/* Detailed Plan Comparison Table */}
      <section ref={comparisonRef} className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-[#0f172a] tracking-tight mb-3">
            Compare Plan Features
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Detailed breakdown of what is included in each Avero tier.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <th className="p-4 sm:p-5 w-2/5">Feature</th>
                  <th className="p-4 sm:p-5 text-center">Free Starter</th>
                  <th className="p-4 sm:p-5 text-center bg-[#2866e1]/5 text-[#2866e1]">Pro Student</th>
                  <th className="p-4 sm:p-5 text-center">Educator / School</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Daily Practice Quizzes</td>
                  <td className="p-4 sm:p-5 text-center text-slate-600">1 per day</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 bg-[#2866e1]/5">Unlimited</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Instructor Explanations &amp; Rationales</td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#2866e1]/5"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Knowledge Gap Analytics</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">Basic</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-[#2866e1] bg-[#2866e1]/5">Advanced</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-[#2866e1]">Cohort Level</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Repeat Missed Questions Mode</td>
                  <td className="p-4 sm:p-5 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#2866e1]/5"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Exam Deadline Planner</td>
                  <td className="p-4 sm:p-5 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#2866e1]/5"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Class Roster &amp; Faculty Admin Studio</td>
                  <td className="p-4 sm:p-5 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#2866e1]/5"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">LMS Integration (Canvas/Blackboard)</td>
                  <td className="p-4 sm:p-5 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#2866e1]/5"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Embed FAQ Section */}
      <FAQ />

      <Footer />
    </main>
  );
}
