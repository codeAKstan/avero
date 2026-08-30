"use client";

import { useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BookOpen, CheckCircle2, Target, Award, ShieldCheck, FileCheck2, ArrowRight, Brain, Layers, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Summary quote card reveal
      if (summaryRef.current) {
        gsap.fromTo(
          summaryRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: summaryRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Pillars grid stagger
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pillarsRef.current,
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
          <GraduationCap className="w-3.5 h-3.5" />
          About AVERO ACADEMY
        </div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-5xl md:text-6xl text-[#0f172a] tracking-tight mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
          Transforming scattered past papers into professional council mastery
        </h1>
        <p className="text-slate-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          AVERO ACADEMY is an educational platform designed to help students prepare effectively for professional examinations, initially focusing on nursing students preparing for professional council examinations.
        </p>
      </section>

      {/* Summary Highlight Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 mb-16 sm:mb-20">
        <div
          ref={summaryRef}
          className="bg-[#2866e1] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden text-center"
        >
          <p className="font-[family-name:var(--font-montserrat)] font-bold text-lg sm:text-2xl md:text-3xl leading-snug text-white max-w-4xl mx-auto mb-4">
            &ldquo;AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system that helps students prepare smarter and more confidently.&rdquo;
          </p>
          <span className="text-white/80 font-mono text-xs sm:text-sm uppercase tracking-widest">
            — The Avero Academy Mission
          </span>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </section>

      {/* The Core Problem & Our Approach Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 border-t border-slate-200/60">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="text-xs font-mono font-bold text-[#2866e1] uppercase tracking-wider mb-2">
              Our Core Approach
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-[#0f172a] mb-4 leading-tight">
              Why subject-based studying changes council exam preparation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              Traditionally, nursing students preparing for council examinations are forced to revise from unorganized, mixed past examination papers. Questions from Anatomy, Pharmacology, and Medical-Surgical Nursing are scrambled together, making structured revision difficult.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Avero Academy reorganizes past examination papers into their individual subject categories so students can practice one subject at a time, backed by clear academic rationales and extracted learning points.
            </p>
            <Link
              href="/signup"
              className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Nursing Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-slate-900 mb-2 border-b border-slate-100 pb-3">
              Initial Nursing Subject Coverage
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <strong className="text-slate-900 text-sm font-semibold">Anatomy &amp; Physiology:</strong>
                <p className="text-slate-600 text-xs">Organ systems, structural histology, and physiological mechanisms.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <strong className="text-slate-900 text-sm font-semibold">Fundamentals of Nursing:</strong>
                <p className="text-slate-600 text-xs">Core nursing principles, ethics, hygiene, vital signs, and clinical procedures.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <strong className="text-slate-900 text-sm font-semibold">Pharmacology:</strong>
                <p className="text-slate-600 text-xs">Drug classifications, dosage calculations, side effects, and administration.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <strong className="text-slate-900 text-sm font-semibold">Medical-Surgical Nursing:</strong>
                <p className="text-slate-600 text-xs">Adult healthcare, disease management, perioperative care, and pathophysiology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 8 Focus Pillars of Avero Academy */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-t border-slate-200/60">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-[#2866e1] uppercase tracking-wider mb-2">
            Our Quality Standards
          </div>
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-[#0f172a] tracking-tight mb-4">
            The 8 Pillars of Avero Academy
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Every question, rationale, and learning point in our system adheres strictly to these 8 foundational principles.
          </p>
        </div>

        <div ref={pillarsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Subject Establishment
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Identifying and establishing official nursing subjects and course frameworks aligned with council standards.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Past Paper Categorization
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Separating scrambled past examination papers into individual, focused subject categories for efficient study.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Answer Verification
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Identifying correct answers accurately through rigorous academic review by experienced nursing educators.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              04
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Sound Explanations
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Providing clear, academically sound rationales for every option so students grasp the underlying clinical logic.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              05
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Extracted Learning Points
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Extracting high-yield takeaway notes from questions so candidates understand what is expected on council exams.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              06
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Structured Resource
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Organizing questions into a logical, sequential study workflow designed for spaced repetition and mastery.
            </p>
          </div>

          {/* Pillar 7 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              07
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Academic Rigor
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Maintaining strict factual accuracy and eliminating unsupported or misleading information.
            </p>
          </div>

          {/* Pillar 8 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4 font-mono font-bold text-sm">
              08
            </div>
            <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-[#0f172a] mb-2">
              Practical Examination Utility
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Ensuring the final resource is practical, clear, and directly useful for candidates sitting professional council exams.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 pb-16 sm:pb-24">
        <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl text-white tracking-tight mb-4">
            Ready to prepare for your council examination?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join thousands of nursing candidates studying with Avero Academy&apos;s subject-categorized system.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all shadow-lg"
          >
            <span>Start Free Study Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
