import { ChevronRight, Sparkles, CheckCircle2, Clock, Calendar, Activity } from "lucide-react";

export function LearningTools() {
  return (
    <section className="w-full bg-[#f4f7fc]/60 border-y border-slate-200/60 py-20 sm:py-28 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column Text Content */}
        <div className="lg:col-span-5 flex flex-col items-start">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
            Avero Learning Platform
          </div>

          {/* Main Headline */}
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.12] text-[#2866e1] tracking-tight mb-6">
            Discover the features that power smarter learning
          </h2>

          {/* Description Paragraph */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-10">
            Every tool, one purpose — helping you learn efficiently and retain
            knowledge. Explore how Avero brings clarity, connection, and
            confidence to every step of your healthcare education journey.
          </p>

          {/* Action Button & Note */}
          <div className="flex flex-col items-start gap-3">
            <a
              href="#get-started"
              className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-base px-8 py-3.5 rounded-full transition-all shadow-md shadow-[#2866e1]/25 flex items-center gap-2 group"
            >
              <span>Try Avero Free</span>
              <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="text-slate-500 text-xs font-medium pl-3">
              No credit card required
            </span>
          </div>
        </div>

        {/* Right Column Bento Dashboard UI Graphic */}
        <div className="lg:col-span-7">
          <div className="relative border-2 border-[#2866e1]/20 rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Header Bar */}
              <div className="sm:col-span-12 flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3.5 px-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2866e1] text-white px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm font-[family-name:var(--font-montserrat)]">
                    Avero
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
                      PRO
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  On track · Ahead of pace
                </div>
              </div>

              {/* Widget 1: Active Recall Flashcard & Confidence Rating */}
              <div className="sm:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span>Q 14 / 20</span>
                    <span className="text-[#2866e1] font-semibold">Anatomy</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mb-3 leading-snug">
                    Which bone is the largest and strongest in the human body?
                  </div>

                  {/* Multiple Choice Graphic Preview */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-slate-600 flex items-center justify-between">
                      <span>A. Tibia</span>
                    </div>
                    <div className="text-[11px] bg-emerald-50 border border-emerald-300 rounded-lg p-2 text-emerald-800 font-semibold flex items-center justify-between">
                      <span>B. Femur</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">
                    Rate your confidence:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors text-center">
                      Low
                    </button>
                    <button className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors text-center">
                      Medium
                    </button>
                    <button className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-center">
                      High
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget 2: Clinical Pathway Flowchart Card */}
              <div className="sm:col-span-6 bg-[#2866e1] text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                      Clinical Summary
                    </span>
                    <Activity className="w-4 h-4 text-white/80" />
                  </div>
                  <h5 className="font-[family-name:var(--font-montserrat)] font-bold text-sm mb-3 leading-snug">
                    ACUTE CORONARY SYNDROME PATHWAY
                  </h5>
                  <div className="bg-white/10 rounded-xl p-3 text-xs leading-relaxed space-y-1.5 mb-3 border border-white/15">
                    <div className="font-semibold text-white">Initial Management:</div>
                    <div className="text-white/80 text-[11px]">• High-sensitivity Troponin check</div>
                    <div className="text-white/80 text-[11px]">• 12-lead ECG within 10 minutes</div>
                    <div className="text-white/80 text-[11px]">• Aspirin 300mg + Antiplatelet</div>
                  </div>
                </div>
                <div className="text-[10px] text-white/70 italic text-right">
                  Instructor Verified ✓
                </div>
              </div>

              {/* Widget 3: Exam Deadlines Tracker */}
              <div className="sm:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#2866e1]" />
                  <span>Next Deadline</span>
                </div>
                <div className="font-[family-name:var(--font-montserrat)] font-bold text-slate-900 text-sm mb-2">
                  Pathology Board Exam
                </div>
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 font-mono font-semibold flex items-center justify-between">
                  <span>May 31st</span>
                  <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[10px]">
                    12 days away
                  </span>
                </div>
              </div>

              {/* Widget 4: Weekly Study Planner */}
              <div className="sm:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2866e1]" />
                    Study Planner
                  </span>
                  <span className="text-[11px] text-[#2866e1] font-mono font-bold bg-[#2866e1]/10 px-2 py-0.5 rounded">
                    15.5 hrs / wk
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[
                    { day: "Mon", hrs: "2.5h" },
                    { day: "Tue", hrs: "2.5h" },
                    { day: "Wed", hrs: "3.5h" },
                    { day: "Thu", hrs: "3.5h" },
                    { day: "Fri", hrs: "2.0h" },
                    { day: "Sat", hrs: "1.5h" },
                    { day: "Sun", hrs: "0h" },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className="bg-slate-50 rounded-lg p-1.5 border border-slate-100"
                    >
                      <div className="text-[9px] font-mono text-slate-400 uppercase">
                        {item.day}
                      </div>
                      <div className="text-xs font-bold text-[#2866e1] mt-0.5">
                        {item.hrs}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
