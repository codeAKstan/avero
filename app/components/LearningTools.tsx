"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, CheckCircle2, Clock, Calendar, Activity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LearningTools() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left text column entrance
      gsap.fromTo(
        textColRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textColRef.current,
            start: "top 85%",
          },
        }
      );

      // Bento cards staggered entrance
      if (bentoGridRef.current) {
        const cards = bentoGridRef.current.querySelectorAll(".bento-card");
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bentoGridRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#f4f7fc]/60 border-y border-slate-200/60 py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
        {/* Left Column Text Content */}
        <div ref={textColRef} className="lg:col-span-5 flex flex-col items-start">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-3.5 sm:px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
            Avero Academy Platform
          </div>

          {/* Main Headline */}
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl lg:text-[48px] leading-[1.12] text-[#2866e1] tracking-tight mb-4 sm:mb-6">
            Organized subjects that power council exam success
          </h2>

          {/* Description Paragraph */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-10">
            From Anatomy to Pharmacology, Fundamentals of Nursing, and Medical-Surgical Nursing — Avero Academy brings clarity, structure, and academic rationales to every step of your preparation.
          </p>

          {/* Action Button & Note */}
          <div className="flex flex-col items-start gap-2.5 sm:gap-3 w-full sm:w-auto">
            <a
              href="/signup"
              className="w-full sm:w-auto justify-center bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-sm sm:text-base px-7 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all shadow-md shadow-[#2866e1]/25 flex items-center gap-2 group"
            >
              <span>Try Avero Academy Free</span>
              <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="text-slate-500 text-xs font-medium pl-1 sm:pl-3">
              No credit card required
            </span>
          </div>
        </div>

        {/* Right Column Bento Dashboard UI Graphic */}
        <div className="lg:col-span-7">
          <div className="relative border-2 border-[#2866e1]/20 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 shadow-2xl overflow-hidden">
            <div ref={bentoGridRef} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              {/* Header Bar */}
              <div className="bento-card sm:col-span-12 flex items-center justify-between bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 sm:px-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2866e1] text-white px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm font-[family-name:var(--font-montserrat)]">
                    Avero Academy
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 sm:px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  NURSING
                </div>
              </div>

              {/* Widget 1: Active Recall Flashcard & Confidence Rating */}
              <div className="bento-card sm:col-span-6 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-[#2866e1]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span>Q 14 / 50</span>
                    <span className="text-[#2866e1] font-semibold">Pharmacology</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mb-3 leading-snug">
                    Which organ is primarily responsible for the metabolism of most pharmacological agents?
                  </div>

                  {/* Multiple Choice Graphic Preview */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-slate-600 flex items-center justify-between">
                      <span>A. Kidneys</span>
                    </div>
                    <div className="text-[11px] bg-emerald-50 border border-emerald-300 rounded-lg p-2 text-emerald-800 font-semibold flex items-center justify-between">
                      <span>B. Liver</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">
                    Rate your confidence:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button className="py-1.5 px-1.5 sm:px-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors text-center">
                      Low
                    </button>
                    <button className="py-1.5 px-1.5 sm:px-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors text-center">
                      Medium
                    </button>
                    <button className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-center">
                      High
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget 2: Clinical Pathway Flowchart Card */}
              <div className="bento-card sm:col-span-6 bg-[#2866e1] text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                      Clinical Summary
                    </span>
                    <Activity className="w-4 h-4 text-white/80" />
                  </div>
                  <h5 className="font-[family-name:var(--font-montserrat)] font-bold text-xs sm:text-sm mb-3 leading-snug">
                    FUNDAMENTALS OF NURSING
                  </h5>
                  <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 text-xs leading-relaxed space-y-1.5 mb-3 border border-white/15">
                    <div className="font-semibold text-white">Council Learning Points:</div>
                    <div className="text-white/80 text-[10px] sm:text-[11px]">• Aseptic technique &amp; infection control</div>
                    <div className="text-white/80 text-[10px] sm:text-[11px]">• Vital signs interpretation &amp; triage</div>
                    <div className="text-white/80 text-[10px] sm:text-[11px]">• Medication administration 5 Rights</div>
                  </div>
                </div>
                <div className="text-[10px] text-white/70 italic text-right">
                  Exam Verified ✓
                </div>
              </div>

              {/* Widget 3: Exam Deadlines Tracker */}
              <div className="bento-card sm:col-span-5 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between hover:border-[#2866e1]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#2866e1]" />
                  <span>Next Examination</span>
                </div>
                <div className="font-[family-name:var(--font-montserrat)] font-bold text-slate-900 text-xs sm:text-sm mb-2">
                  Nursing Council Board Exam
                </div>
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-2.5 font-mono font-semibold flex items-center justify-between">
                  <span>May 31st</span>
                  <span className="bg-amber-200/80 text-amber-900 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px]">
                    12 days away
                  </span>
                </div>
              </div>

              {/* Widget 4: Weekly Study Planner */}
              <div className="bento-card sm:col-span-7 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between hover:border-[#2866e1]/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2866e1]" />
                    Subject Schedule
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#2866e1] font-mono font-bold bg-[#2866e1]/10 px-2 py-0.5 rounded">
                    15.5 hrs / wk
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[
                    { day: "Mon", hrs: "Anatomy" },
                    { day: "Tue", hrs: "Pharm" },
                    { day: "Wed", hrs: "Fund." },
                    { day: "Thu", hrs: "MedSurg" },
                    { day: "Fri", hrs: "Pharm" },
                    { day: "Sat", hrs: "Review" },
                    { day: "Sun", hrs: "Rest" },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className="bg-slate-50 rounded-lg p-1 sm:p-1.5 border border-slate-100"
                    >
                      <div className="text-[8px] sm:text-[9px] font-mono text-slate-400 uppercase">
                        {item.day}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-[#2866e1] mt-0.5 truncate">
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
