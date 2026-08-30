"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, ChevronRight, RotateCcw, Plus, Brain, Target, ShieldCheck, BookOpen } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const showcaseCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const benefitCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header and main showcase card animation
      gsap.fromTo(
        showcaseCardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: showcaseCardRef.current,
            start: "top 85%",
          },
        }
      );

      // Progress bar fill animation inside mockup card
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { width: "0%" },
          {
            width: "95%",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: progressBarRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 3 Benefit Cards staggered entrance
      if (benefitCardsRef.current) {
        gsap.fromTo(
          benefitCardsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: benefitCardsRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-3 sm:mb-4">
          Organized, explanation-driven study system
        </h2>
        <p className="text-slate-600 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto">
          We turn scattered professional examination past questions into structured subject categories.
        </p>
      </div>

      {/* Main Feature Showcase Card */}
      <div
        ref={showcaseCardRef}
        className="w-full max-w-6xl mx-auto bg-[#f8faf9] border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-sm mb-8 sm:mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-3xl text-[#0f172a] tracking-tight mb-3 sm:mb-4">
              Turn past examination papers into subject confidence
            </h3>
            <p className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed mb-6 sm:mb-8">
              Study one subject at a time with verified correct answers, clear academic explanations, and key learning points.
            </p>

            {/* Bullet Point 1 */}
            <div className="flex items-start gap-3 sm:gap-3.5 mb-4 sm:mb-5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Subject-Categorized Past Questions:
                </strong>{" "}
                <span className="text-slate-600">
                  Scattered past papers organized into Anatomy, Pharmacology, Medical-Surgical Nursing, and Nursing Fundamentals.
                </span>
              </div>
            </div>

            {/* Bullet Point 2 */}
            <div className="flex items-start gap-3 sm:gap-3.5 mb-4 sm:mb-5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Academic Explanations &amp; Rationales:
                </strong>{" "}
                <span className="text-slate-600">
                  Understand not just the correct answer, but the clinical reasoning required for council examinations.
                </span>
              </div>
            </div>

            {/* Bullet Point 3 */}
            <div className="flex items-start gap-3 sm:gap-3.5 mb-6 sm:mb-8">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs sm:text-base leading-snug">
                <strong className="text-[#0f172a] font-semibold">
                  Extracted Learning Points:
                </strong>{" "}
                <span className="text-slate-600">
                  Extract high-yield takeaways from every question so you know exactly what examiners expect you to master.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/signup"
              className="inline-flex items-center gap-2 border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-sm"
            >
              Try Avero Academy Free
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

          {/* Right Column Graphic Mockup */}
          <div className="lg:col-span-6 relative bg-[#2866e1] rounded-2xl p-4 sm:p-7 md:p-9 shadow-xl flex flex-col items-center justify-center">
            {/* Quiz Complete Card Mockup */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 text-center border border-slate-100">
              {/* Score header */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Pharmacology Council Review</span>
                <span className="font-mono text-slate-700">40 of 40</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                <div ref={progressBarRef} className="bg-emerald-500 h-full rounded-full"></div>
              </div>
              <div className="text-xs font-bold text-emerald-700 mb-4 sm:mb-5">
                38 Correct · 2 Incorrect (95% Mastery)
              </div>

              {/* Headline */}
              <h4 className="font-[family-name:var(--font-montserrat)] font-extrabold text-xl sm:text-2xl text-slate-900 mb-5">
                Subject session complete!
              </h4>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5">
                <div className="bg-emerald-50 border border-emerald-200/70 p-2.5 sm:p-3.5 rounded-xl text-center">
                  <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    Correct Rationale
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-800">
                    95% <span className="text-xs font-medium text-emerald-600">(38)</span>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200/70 p-2.5 sm:p-3.5 rounded-xl text-center">
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                    Learning Points
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-amber-800">
                    40 <span className="text-xs font-medium text-amber-600">Saved</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                  Review missed concepts
                </button>
                <button className="w-full py-2.5 px-4 rounded-lg bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Next subject (Anatomy)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Complementary Benefit Cards */}
      <div ref={benefitCardsRef} className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 sm:mb-5">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-base sm:text-lg text-[#0f172a] mb-2">
            Subject-Categorized Past Papers
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Unmix scattered examination papers so you can focus and master one subject at a time before moving to the next.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 sm:mb-5">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-base sm:text-lg text-[#0f172a] mb-2">
            Extracted Key Learning Points
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Gain explicit insights into what council examiners test and expect you to retain for professional practice.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 sm:mb-5">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="font-[family-name:var(--font-montserrat)] font-bold text-base sm:text-lg text-[#0f172a] mb-2">
            Verified Academic Accuracy
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every question, answer key, and explanation is rigorously verified to eliminate misleading or unsupported information.
          </p>
        </div>
      </div>
    </section>
  );
}
