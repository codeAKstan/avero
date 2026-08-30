"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  School,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  RefreshCw,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react";
import gsap from "gsap";

export default function SignupPage() {
  // Form step state: 1 = Account Info, 2 = Onboarding ("Tell us about you"), 3 = Welcome Email & Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form Data
  const [role, setRole] = useState<"student" | "educator">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step1Errors, setStep1Errors] = useState<{ fullName?: string; email?: string; password?: string }>({});

  // Step 2 Onboarding Form Data
  const [studentType, setStudentType] = useState("");
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [step2Errors, setStep2Errors] = useState<{ studentType?: string; university?: string; gradYear?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 3 Email Preview Data
  const [emailData, setEmailData] = useState<{
    to: string;
    subject: string;
    sentAt: string;
    content: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [step]);

  // Handle Step 1 Submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { fullName?: string; email?: string; password?: string } = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim() || !email.includes("@")) errors.email = "Please enter a valid email address";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors);
      return;
    }

    setStep1Errors({});
    // Transition to Step 2 (Onboarding)
    setStep(2);
  };

  // Handle Step 2 Onboarding Submission
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { studentType?: string; university?: string; gradYear?: string } = {};

    if (!studentType.trim()) {
      errors.studentType = "What type of healthcare student are you? is a required field";
    }
    if (!university.trim()) {
      errors.university = "University or training workplace is a required field";
    }
    if (!gradYear.trim()) {
      errors.gradYear = "Graduation or qualification year is a required field";
    }

    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors);
      return;
    }

    setStep2Errors({});
    setIsSubmitting(true);

    try {
      // Trigger API Route to process registration & generate welcome email
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          role,
          studentType,
          university,
          gradYear,
        }),
      });

      const data = await res.json();
      if (res.ok && data.emailSent) {
        setEmailData(data.emailSent);
      } else {
        // Fallback email preview
        setEmailData({
          to: email,
          subject: "Welcome to AVERO ACADEMY - Your Account is Ready!",
          sentAt: new Date().toISOString(),
          content: `Dear ${fullName},\n\nWelcome to AVERO ACADEMY! Your account has been initialized for ${studentType} at ${university}.\n\nYou can now access subject-categorized nursing council exam past questions.`,
        });
      }
      setStep(3);
    } catch (err) {
      // Fallback transition
      setEmailData({
        to: email,
        subject: "Welcome to AVERO ACADEMY - Your Account is Ready!",
        sentAt: new Date().toISOString(),
        content: `Dear ${fullName},\n\nWelcome to AVERO ACADEMY! Your account is active for ${studentType} (${university}, ${gradYear}).`,
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* STEP 1: ACCOUNT CREATION */}
      {step === 1 && (
        <div
          ref={cardRef}
          className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 relative z-10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-bold text-xl sm:text-3xl text-[#0f172a] mb-1.5 sm:mb-2 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Start studying smarter with instructor-aligned council materials
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 sm:py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                role === "student"
                  ? "bg-white text-[#2866e1] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              I&apos;m a Student
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="py-2 sm:py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all text-slate-400 opacity-50 cursor-not-allowed bg-transparent"
            >
              <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span>I&apos;m an Educator</span>
              <span className="text-[9px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-mono font-normal">
                Soon
              </span>
            </button>
          </div>

          {/* Social Google Signup Button */}
          <button
            type="button"
            onClick={() => {
              setFullName("Google Student");
              setEmail("student@gmail.com");
              setStep(2);
            }}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-sm mb-5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest absolute">
              OR
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleStep1Submit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                    step1Errors.fullName
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                      : "border-slate-200 focus:border-[#2866e1] focus:ring-2 focus:ring-[#2866e1]/20"
                  }`}
                />
              </div>
              {step1Errors.fullName && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{step1Errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                    step1Errors.email
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                      : "border-slate-200 focus:border-[#2866e1] focus:ring-2 focus:ring-[#2866e1]/20"
                  }`}
                />
              </div>
              {step1Errors.email && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{step1Errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                    step1Errors.password
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                      : "border-slate-200 focus:border-[#2866e1] focus:ring-2 focus:ring-[#2866e1]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {step1Errors.password && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{step1Errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2866e1]/25 mt-2"
            >
              <span>Continue to Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2866e1] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      )}

      {/* STEP 2: ONBOARDING ("TELL US ABOUT YOU") MATCHING USER REFERENCE MOCKUP */}
      {step === 2 && (
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
          <form onSubmit={handleStep2Submit} className="space-y-6">
            {/* Field 1: What type of healthcare student are you? */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors relative ${
                  step2Errors.studentType ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 mb-1">
                  <span className="text-red-600 font-bold">*</span>
                  <span className={step2Errors.studentType ? "text-red-700 font-bold" : "text-slate-700"}>
                    What type of healthcare student are you?
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={studentType}
                    onChange={(e) => {
                      setStudentType(e.target.value);
                      if (step2Errors.studentType) setStep2Errors({ ...step2Errors, studentType: undefined });
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
              {step2Errors.studentType && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {step2Errors.studentType}
                </p>
              )}
            </div>

            {/* Field 2: University or training workplace */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors ${
                  step2Errors.university ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 mb-1">
                  <span className="text-red-600 font-bold">*</span>
                  <span className={step2Errors.university ? "text-red-700 font-bold" : "text-slate-700"}>
                    University or training workplace
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. School of Nursing, University Teaching Hospital"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value);
                    if (step2Errors.university) setStep2Errors({ ...step2Errors, university: undefined });
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none py-1 placeholder:text-slate-400"
                />
              </div>
              {step2Errors.university && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {step2Errors.university}
                </p>
              )}
            </div>

            {/* Field 3: Graduation or qualification year */}
            <div>
              <div
                className={`bg-[#f0f2f5] rounded-lg p-3.5 border-b-2 transition-colors ${
                  step2Errors.gradYear ? "border-red-600 bg-red-50/50" : "border-slate-300 focus-within:border-[#251c91]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                  <span className="text-slate-400 font-bold">*</span>
                  <span className={step2Errors.gradYear ? "text-red-700 font-bold" : "text-slate-700"}>
                    Graduation or qualification year
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={gradYear}
                    onChange={(e) => {
                      setGradYear(e.target.value);
                      if (step2Errors.gradYear) setStep2Errors({ ...step2Errors, gradYear: undefined });
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
              {step2Errors.gradYear && (
                <p className="text-xs text-red-600 font-medium mt-1.5 pl-1">
                  {step2Errors.gradYear}
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
                    <span>Processing registration...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: SUCCESS & WELCOME EMAIL PREVIEW */}
      {step === 3 && (
        <div
          ref={cardRef}
          className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 mb-1">
              Account Created &amp; Activated!
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              We sent a confirmation email to <span className="font-bold text-slate-900">{email}</span>.
            </p>
          </div>

          {/* Interactive Welcome Email Preview Modal */}
          {emailData && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-6 mb-6 text-left shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-[#2866e1]" />
                  <span className="font-semibold text-slate-900">Welcome Email Preview</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Delivered
                </span>
              </div>

              <div className="text-xs space-y-1 mb-3 text-slate-600">
                <div>
                  <strong className="text-slate-800">To:</strong> {emailData.to}
                </div>
                <div>
                  <strong className="text-slate-800">Subject:</strong> {emailData.subject}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans shadow-sm">
                {emailData.content}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/features"
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Practice Questions</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors text-center"
            >
              <span>Go to Home Page</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
