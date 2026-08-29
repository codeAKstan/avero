import { CheckCircle2, ChevronRight, RotateCcw, Plus, Sparkles, Brain, Target, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-4">
          Get smarter every study session
        </h2>
        <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl mx-auto">
          Built for active learning, not endless scrolling.
        </p>
      </div>

      {/* Main Feature Showcase Card */}
      <div className="w-full max-w-6xl mx-auto bg-[#f8faf9] border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-3xl text-[#0f172a] tracking-tight mb-4">
              Turn knowledge into confidence
            </h3>
            <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed mb-8">
              Dynamic questions reinforce key concepts, helping you{" "}
              <span className="italic font-medium text-slate-900">retain</span>{" "}
              what really matters.
            </p>

            {/* Bullet Point 1 */}
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-sm sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Learn actively, not passively:
                </strong>{" "}
                <span className="text-slate-600">
                  Every quiz strengthens recall and clinical reasoning instead of
                  just testing memory.
                </span>
              </div>
            </div>

            {/* Bullet Point 2 */}
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-sm sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Master what matters most:
                </strong>{" "}
                <span className="text-slate-600">
                  The Avero algorithm prioritizes your knowledge gaps, so you make
                  every minute count.
                </span>
              </div>
            </div>

            {/* Bullet Point 3 */}
            <div className="flex items-start gap-3.5 mb-8">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-sm sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Instant clinical rationale:
                </strong>{" "}
                <span className="text-slate-600">
                  Understand the exact reason behind correct answers with instructor-backed explanations.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white font-semibold text-base px-7 py-3 rounded-full transition-all duration-200 shadow-sm"
            >
              Try Avero Free
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

          {/* Right Column Graphic Mockup */}
          <div className="lg:col-span-6 relative bg-[#2866e1] rounded-2xl p-6 sm:p-9 shadow-xl flex flex-col items-center justify-center">


            {/* Quiz Complete Card Mockup */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 text-center border border-slate-100">
              {/* Score header */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Progress</span>
                <span className="font-mono text-slate-700">40 of 40</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                <div className="w-[95%] bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
              </div>
              <div className="text-xs font-bold text-emerald-700 mb-5">
                38 Correct · 2 Incorrect
              </div>

              {/* Headline */}
              <h4 className="font-[family-name:var(--font-montserrat)] font-extrabold text-2xl text-slate-900 mb-6">
                Quiz complete!
              </h4>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-200/70 p-3.5 rounded-xl text-center">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    Correct
                  </div>
                  <div className="text-xl font-extrabold text-emerald-800">
                    95% <span className="text-xs font-medium text-emerald-600">(38)</span>
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-200/70 p-3.5 rounded-xl text-center">
                  <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
                    Incorrect
                  </div>
                  <div className="text-xl font-extrabold text-rose-800">
                    5% <span className="text-xs font-medium text-rose-600">(2)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button className="w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  Repeat missed
                </button>
                <button className="w-full py-2.5 px-4 rounded-lg bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                  New quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Complementary Benefit Cards */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
            <Brain className="w-6 h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
            Active Recall & Practice
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            Engage deeply with your course materials through targeted practice that strengthens long-term recall and reasoning.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
            Targeted Knowledge Gap Analysis
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            Avero tracks your performance over time, automatically prioritizing missed concepts so you study efficiently.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
            Instructor Aligned Content
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every question comes straight from your assigned course material, ensuring 100% relevance to your actual exams.
          </p>
        </div>
      </div>
    </section>
  );
}
