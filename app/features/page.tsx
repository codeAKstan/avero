"use client";

import { useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Features } from "../components/Features";
import { LearningTools } from "../components/LearningTools";
import { CheckCircle2, ArrowRight, Brain, Target, ShieldCheck, BookOpen, Clock, Users, FileText } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const spotlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Feature spotlights entrance
      if (spotlightsRef.current) {
        gsap.fromTo(
          spotlightsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: spotlightsRef.current,
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
      <section ref={heroRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
          Core Platform Features
        </div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-5xl md:text-6xl text-[#0f172a] tracking-tight mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
          Engineered for active recall &amp; exam mastery
        </h1>
        <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Explore the complete suite of study tools built to help medical, nursing, and healthcare students test themselves on what actually matters.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md flex items-center gap-2"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Embed Interactive Features Component */}
      <Features />

      {/* Deep-Dive Feature Spotlights */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-t border-slate-200/60">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-[#0f172a] tracking-tight mb-4">
            Everything you need to study smarter
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Avero aligns directly with your curriculum, eliminating generic question banks and saving hours of revision time.
          </p>
        </div>

        <div ref={spotlightsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Spotlight 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Curriculum Alignment
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Questions are created straight from your professor&apos;s lectures, slides, and syllabus so you never waste time studying irrelevant topics.
            </p>
          </div>

          {/* Spotlight 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Active Recall Engine
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Force active memory retrieval through dynamic testing scenarios instead of passive rereading or highlighting.
            </p>
          </div>

          {/* Spotlight 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Knowledge Gap Analytics
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track your scores over time with automatic performance tagging that isolates weak subjects before final exams.
            </p>
          </div>

          {/* Spotlight 4 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Instructor Rationales
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get detailed clinical explanations for correct and incorrect options backed by course instructors and faculty.
            </p>
          </div>

          {/* Spotlight 5 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Exam Deadline Planner
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organize your weekly review pace based on upcoming shelf exams, USMLE Step dates, or NCLEX board schedules.
            </p>
          </div>

          {/* Spotlight 6 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-[#0f172a] mb-2">
              Educator Roster Tools
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Faculty tools allow professors to manage class rosters, review student analytics, and align coursework effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Embed Learning Tools Bento Section */}
      <LearningTools />

      <Footer />
    </main>
  );
}
