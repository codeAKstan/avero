"use client";

import { useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HowItWorks } from "../components/HowItWorks";
import { BookOpen, FileCheck2, BarChart3, ArrowRight, CheckCircle2, School, GraduationCap } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HowItWorksPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const detailedStepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Detailed step sections entrance
      if (detailedStepsRef.current) {
        gsap.fromTo(
          detailedStepsRef.current.children,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: detailedStepsRef.current,
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

      {/* Hero Header */}
      <section ref={heroRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
          Step-by-step Guide
        </div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-5xl md:text-6xl text-[#0f172a] tracking-tight mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
          How Avero works in practice
        </h1>
        <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          No generic question banks. Learn how Avero maps your actual course materials directly into active recall practice quizzes.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md flex items-center gap-2"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Embed 3-Step Process Component */}
      <HowItWorks />

      {/* Deep-Dive Steps Breakdown */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-t border-slate-200/60">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-[#0f172a] tracking-tight mb-4">
            A deeper look at the Avero workflow
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Designed specifically to align students and instructors around course goals.
          </p>
        </div>

        <div ref={detailedStepsRef} className="space-y-12 sm:space-y-16">
          {/* Step 1 Deep Dive */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-start">
              <span className="font-mono text-4xl sm:text-5xl font-extrabold text-[#2866e1] mb-2">01</span>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-[#0f172a] mb-3">
                Course Syllabus &amp; Topic Selection
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Log into Avero, select your institution and course module. Content is broken down by unit, system, and lecture topic.
              </p>
            </div>
            <div className="md:col-span-8 bg-slate-50 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Mapped to your professor&apos;s assigned syllabus and textbook chapters</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Filter practice sets by organ system, pathology topic, or specific lecture</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>No digging through non-relevant national question banks</span>
              </div>
            </div>
          </div>

          {/* Step 2 Deep Dive */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-start">
              <span className="font-mono text-4xl sm:text-5xl font-extrabold text-[#2866e1] mb-2">02</span>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-[#0f172a] mb-3">
                Active Testing &amp; Verification
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Answer exam-formatted questions designed to test clinical reasoning. Questions undergo instructor review to guarantee accuracy.
              </p>
            </div>
            <div className="md:col-span-8 bg-slate-50 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Active recall testing strengthens long-term memory retrieval</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Verified by course faculty and subject matter experts</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Confidence rating system tags high vs low certainty responses</span>
              </div>
            </div>
          </div>

          {/* Step 3 Deep Dive */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-start">
              <span className="font-mono text-4xl sm:text-5xl font-extrabold text-[#2866e1] mb-2">03</span>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-[#0f172a] mb-3">
                Review Rationale &amp; Track Progress
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Understand the exact reason behind correct answers with detailed clinical rationales. Track progress over time to eliminate knowledge gaps.
              </p>
            </div>
            <div className="md:col-span-8 bg-slate-50 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Instant explanations for every single option</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Knowledge gap analytics automatically highlight weak topics</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>&quot;Repeat Missed&quot; quiz mode ensures 100% concept mastery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Educators Section */}
      <section id="for-educators" className="w-full bg-[#0f172a] text-white py-16 sm:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-blue-400/30 mb-4">
              <School className="w-3.5 h-3.5" />
              For Faculty &amp; Educators
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-white tracking-tight mb-4">
              Empower your students with course-aligned review
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Avero provides faculty members with cohort analytics, roster management, and question review tools to ensure students engage with assigned materials before clinical rounds.
            </p>
            <Link
              href="/signup"
              className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all flex items-center gap-2"
            >
              <span>Explore Educator Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="md:col-span-6 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">✓</div>
              <div className="text-xs sm:text-sm text-slate-200">Class roster &amp; cohort performance dashboard</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">✓</div>
              <div className="text-xs sm:text-sm text-slate-200">Instructor question approval and rationale edits</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">✓</div>
              <div className="text-xs sm:text-sm text-slate-200">Identify class-wide knowledge gaps prior to exam week</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
