"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { School, Mail, ArrowRight, CheckCircle2, Clock, ShieldCheck, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function ForEducatorsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      if (teaserRef.current) {
        gsap.fromTo(
          teaserRef.current.children,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out", delay: 0.3 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center selection:bg-[#2866e1]/20 selection:text-[#0f172a] w-full bg-[#f5f8ff] bg-dot-pattern">
      <Header />

      {/* Main Coming Soon Hero */}
      <section ref={heroRef} className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-20 pb-16 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-6">
          <Clock className="w-3.5 h-3.5" />
          Coming Soon · Educator Portal
        </div>

        {/* Title */}
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-5xl md:text-6xl text-[#0f172a] tracking-tight mb-4 sm:mb-6 leading-tight max-w-3xl">
          Empower your faculty with course-aligned analytics
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
          We are currently building dedicated instructor dashboards, cohort gap analysis, and syllabus alignment tools for medical and nursing faculties.
        </p>

        {/* Early Access Email Form */}
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xl mb-12 sm:mb-16">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider text-left pl-1">
                Get Early Access &amp; Educator Updates
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@university.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2866e1]/40 focus:border-[#2866e1] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] text-slate-400 text-left pl-1">
                Join 500+ educators on the faculty waitlist.
              </span>
            </form>
          ) : (
            <div className="py-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-lg text-slate-900">
                You&apos;re on the priority list!
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                Thank you for your interest. We will notify you as soon as the Educator Portal launches.
              </p>
            </div>
          )}
        </div>

        {/* Feature Teasers */}
        <div className="w-full max-w-4xl border-t border-slate-200/60 pt-12 sm:pt-16">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-slate-900 mb-8">
            What&apos;s coming in the Educator Portal
          </h2>

          <div ref={teaserRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-slate-900 mb-2">
                Cohort Performance Dashboard
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Monitor class engagement and track average scores across lecture units before board exams.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-slate-900 mb-2">
                Question Review &amp; Approval
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Review, edit, and approve practice questions aligned with your specific course lectures.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 text-[#2866e1] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-base text-slate-900 mb-2">
                LMS Integration
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Seamlessly sync rosters and course modules with Canvas, Blackboard, and Moodle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
