"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function OnboardingPage() {
  const [studentType, setStudentType] = useState("");
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [errors, setErrors] = useState<{ studentType?: string; university?: string; gradYear?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 25, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { studentType?: string; university?: string; gradYear?: string } = {};

    if (!studentType.trim()) {
      newErrors.studentType = "What type of healthcare student are you? is a required field";
    }
    if (!university.trim()) {
      newErrors.university = "University or training workplace is a required field";
    }
    if (!gradYear.trim()) {
      newErrors.gradYear = "Graduation or qualification year is a required field";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0fe] via-white to-[#d2e3fc] bg-dot-pattern flex flex-col justify-center items-center px-4 py-8 sm:py-12 selection:bg-[#2866e1]/20 selection:text-[#0f172a] relative overflow-hidden font-[family-name:var(--font-montserrat)]">
      {/* Decorative background glow blurs */}
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-[#2866e1]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-[#2866e1]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="mb-6 sm:mb-8">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="Avero Logo"
            width={440}
            height={140}
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-md"
            priority
          />
        </Link>
      </div>

      {!isSubmitted ? (
        <div
          ref={cardRef}
          className="w-full max-w-xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10"
        >
          {/* Header section matching user image */}
          <div className="mb-6 sm:mb-8 text-left">
            <h1 className="font-bold text-2xl sm:text-4xl text-[#0e0050] tracking-tight mb-1">
              Tell us about you
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              As a{" "}
              <span className="text-[#251c91] underline decoration-[#251c91] underline-offset-4 font-semibold">
                healthcare student
              </span>
            </p>
          </div>

          {/* Form matching user uploaded reference layout */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: What type of healthcare student are you? */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors relative ${
                  errors.studentType ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 mb-1">
                  <span className="text-red-600 font-bold">*</span>
                  <span className={errors.studentType ? "text-red-700 font-bold" : "text-slate-700"}>
                    What type of healthcare student are you?
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={studentType}
                    onChange={(e) => {
                      setStudentType(e.target.value);
                      if (errors.studentType) setErrors({ ...errors, studentType: undefined });
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none appearance-none pr-8 py-1 cursor-pointer"
                  >
                    <option value="">Select healthcare student type...</option>
                    <option value="General Nursing Student (RN)">General Nursing Student (RN)</option>
                    <option value="Midwifery Student (RM)">Midwifery Student (RM)</option>
                    <option value="Public Health Nursing Student">Public Health Nursing Student</option>
                    <option value="Mental Health / Psychiatric Nursing">Mental Health / Psychiatric Nursing</option>
                    <option value="Pediatric Nursing Student">Pediatric Nursing Student</option>
                    <option value="Nurse Practitioner Student">Nurse Practitioner Student</option>
                    <option value="Pre-Nursing / Foundation Student">Pre-Nursing / Foundation Student</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {errors.studentType && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {errors.studentType}
                </p>
              )}
            </div>

            {/* Field 2: University or training workplace */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors ${
                  errors.university ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 mb-1">
                  <span className="text-red-600 font-bold">*</span>
                  <span className={errors.university ? "text-red-700 font-bold" : "text-slate-700"}>
                    University or training workplace
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. School of Nursing, University Teaching Hospital"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value);
                    if (errors.university) setErrors({ ...errors, university: undefined });
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none py-1 placeholder:text-slate-400"
                />
              </div>
              {errors.university && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {errors.university}
                </p>
              )}
            </div>

            {/* Field 3: Graduation or qualification year */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors ${
                  errors.gradYear ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                  <span className="text-slate-400 font-bold">*</span>
                  <span className={errors.gradYear ? "text-red-700 font-bold" : "text-slate-700"}>
                    Graduation or qualification year
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={gradYear}
                    onChange={(e) => {
                      setGradYear(e.target.value);
                      if (errors.gradYear) setErrors({ ...errors, gradYear: undefined });
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none appearance-none pr-8 py-1 cursor-pointer"
                  >
                    <option value="">Select qualification year...</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029+">2029 or later</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {errors.gradYear && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {errors.gradYear}
                </p>
              )}
            </div>

            {/* Continue Button styled like user reference image */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#251c91] hover:bg-[#1a126d] text-white font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>Saving details...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div
          ref={cardRef}
          className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative z-10"
        >
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="font-bold text-2xl text-slate-900 mb-2">
            Profile Setup Complete!
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Your study profile has been updated for <strong className="text-slate-900">{studentType}</strong> at <strong className="text-slate-900">{university}</strong>.
          </p>
          <Link
            href="/features"
            className="w-full py-3.5 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Start Practice Questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
