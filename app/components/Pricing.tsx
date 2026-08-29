import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-4">
          Flexible Plans
        </div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl mx-auto">
          Start for free, upgrade when you need unlimited power.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Card 1: Free Starter */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
              Free Starter
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-[family-name:var(--font-montserrat)] font-extrabold text-4xl text-slate-900">
                $0
              </span>
              <span className="text-slate-500 text-sm font-medium">/ month</span>
            </div>
            <p className="text-slate-500 text-xs mb-6">
              Perfect for exploring active learning on your first course.
            </p>

            <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
              {[
                "Access to core subjects",
                "Basic answer explanations",
                "Active recall practice sets",
                "Standard progress tracking",
                "Instructor rationales",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/signup"
            className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm text-center transition-colors block"
          >
            Get Started Free
          </Link>
        </div>

        {/* Card 2: Pro Student (Featured) */}
        <div className="bg-white border-2 border-[#2866e1] rounded-3xl p-8 shadow-xl relative flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2866e1] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
            Most Popular
          </div>

          <div>
            <div className="text-xs font-bold font-mono text-[#2866e1] uppercase tracking-wider mb-2">
              Pro Student
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-[family-name:var(--font-montserrat)] font-extrabold text-4xl text-slate-900">
                $6
              </span>
              <span className="text-slate-500 text-sm font-medium">/ month</span>
            </div>
            <p className="text-slate-500 text-xs mb-6">
              Everything you need to master medical school & board exams.
            </p>

            <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
              {[
                "Everything on free",
                "Targeted knowledge gap analytics",
                "Unlimited quizzes",
                "Study schedule",
                "Daily notifications",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                  <div className="w-4 h-4 rounded-full bg-[#2866e1] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/signup"
            className="w-full py-3.5 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm text-center transition-all shadow-md shadow-[#2866e1]/25 block"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* Card 3: Educator & School */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
              Educator & School
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-[family-name:var(--font-montserrat)] font-extrabold text-4xl text-slate-900">
                Custom
              </span>
            </div>
            <p className="text-slate-500 text-xs mb-6">
              Tailored for medical universities and nursing faculties.
            </p>

            <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
              {[
                "Class roster & cohort management",
                "Syllabus alignment dashboard",
                "Instructor approval tools",
                "Dedicated university support manager",
                "Custom LMS integration (Canvas, Blackboard)",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/signup"
            className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm text-center transition-colors block"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
