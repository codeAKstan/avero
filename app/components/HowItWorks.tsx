"use client";

import { useEffect, useRef } from "react";
import { BookOpen, FileCheck2, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (stepsContainerRef.current) {
        gsap.fromTo(
          stepsContainerRef.current.children,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-20 md:py-28">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-3.5 sm:px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-3 sm:mb-4">
          Simple 3-Step Process
        </div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-3 sm:mb-4">
          How Avero works in 3 simple steps
        </h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
          No question banks to dig through, no guessing what&apos;s relevant. Just pick a subject and start testing yourself.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div ref={stepsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
        {/* Step 01 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-200">
                01
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg sm:text-xl text-[#0f172a] mb-2 sm:mb-3">
              Pick a subject or topic
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Browse by subject, system, or chapter — mapped to what your course actually covers.
            </p>
          </div>
          <div className="text-xs font-semibold text-[#2866e1] flex items-center gap-1">
            <span>Mapped to Your Syllabus</span>
          </div>
        </div>

        {/* Step 02 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-200">
                02
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg sm:text-xl text-[#0f172a] mb-2 sm:mb-3">
              Take the quiz
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Every question is generated from your school&apos;s real course material and checked by instructors before it reaches you.
            </p>
          </div>
          <div className="text-xs font-semibold text-[#2866e1] flex items-center gap-1">
            <span>Instructor Verified</span>
          </div>
        </div>

        {/* Step 03 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-200">
                03
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg sm:text-xl text-[#0f172a] mb-2 sm:mb-3">
              See where you stand
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Get an instant explanation for every answer, and track which topics you need to revisit before the exam.
            </p>
          </div>
          <div className="text-xs font-semibold text-[#2866e1] flex items-center gap-1">
            <span>Instant Feedback & Analytics</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="mt-12 sm:mt-16 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-full transition-all shadow-md shadow-[#2866e1]/25"
        >
          <span>Start Studying for Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
