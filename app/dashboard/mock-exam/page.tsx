"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Clock,
  HelpCircle,
  Play,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import PaywallModal from "@/components/PaywallModal";

export default function CouncilMockExamLaunchpad() {
  const router = useRouter();

  // User state
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Custom Mix Controls
  const [customCount, setCustomCount] = useState<number>(50);
  const [customTime, setCustomTime] = useState<number>(30);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setIsPro(Boolean(data.user.isPro));
        }
      })
      .catch((err) => console.error("Error loading user profile:", err));
  }, []);

  const handleStartExam = (paperType: string, count: number, timeLimit: number) => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    setLoadingType(paperType);
    router.push(
      `/dashboard/mock-exam/take?paperType=${paperType}&count=${count}&timeLimit=${timeLimit}`
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#1d52bf] to-[#2866e1] rounded-3xl p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Avero Pro Feature</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Full-Length Mixed Council Exams
          </h1>

          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Practice like it's exam day. Our simulator hand-picks **250 questions uniformly sampled across all published courses** to recreate the exact speed, cognitive stamina, and timed environment of actual council papers.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Strict 2-Hour (120 Mins) Timer</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-300" />
              <span>250 Questions (Paper 1 & Paper 2)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Subject Accuracy Breakdown</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Free User Upgrade Banner */}
      {!isPro && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Unlock Council Exam Simulator with Avero Pro
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Council Paper 1, Paper 2, and Custom Mixed Drills require an active Pro Membership.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaywall(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      )}

      {/* Preset Papers Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#2866e1]" />
          Standard Council Preset Papers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preset Card 1: Paper 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-[#2866e1] text-xs font-extrabold rounded-lg uppercase tracking-wider">
                  Council Standard
                </span>
                <span className="text-xs font-bold text-slate-400">120 Minutes</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Council Paper 1 Simulation</span>
                  {!isPro && <Lock className="w-4 h-4 text-amber-500" />}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full 250-question paper drawing questions from across all published clinical, medical, and surgical domains.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Question Count:</span>
                  <span className="font-bold text-slate-900">250 Questions</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Time Limit:</span>
                  <span className="font-bold text-slate-900">2 Hours (120 Mins)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pacing Target:</span>
                  <span className="font-bold text-slate-900">~28.8 seconds / question</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Course Pool:</span>
                  <span className="font-bold text-[#2866e1]">All Published Courses</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartExam("Paper1", 250, 120)}
              disabled={loadingType === "Paper1"}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-50 ${
                isPro
                  ? "bg-[#2866e1] hover:bg-[#1d52bf] text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {loadingType === "Paper1" ? (
                <span>Generating 250-Question Paper...</span>
              ) : isPro ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Council Paper 1</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Unlock Paper 1 (PRO)</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Card 2: Paper 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-extrabold rounded-lg uppercase tracking-wider">
                  Council Standard
                </span>
                <span className="text-xs font-bold text-slate-400">120 Minutes</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Council Paper 2 Simulation</span>
                  {!isPro && <Lock className="w-4 h-4 text-amber-500" />}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full 250-question paper focusing on practical, community health, pharmacology, and specialized care questions.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Question Count:</span>
                  <span className="font-bold text-slate-900">250 Questions</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Time Limit:</span>
                  <span className="font-bold text-slate-900">2 Hours (120 Mins)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pacing Target:</span>
                  <span className="font-bold text-slate-900">~28.8 seconds / question</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Course Pool:</span>
                  <span className="font-bold text-purple-600">All Published Courses</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartExam("Paper2", 250, 120)}
              disabled={loadingType === "Paper2"}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-50 ${
                isPro
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {loadingType === "Paper2" ? (
                <span>Generating 250-Question Paper...</span>
              ) : isPro ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Council Paper 2</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Unlock Paper 2 (PRO)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Mixed Drill Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Custom Mixed Drill Simulator</h3>
            <p className="text-xs text-slate-500">
              Customize question count and timer length to build your own custom mixed study sprint.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Count Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Question Count
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[50, 100, 250].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setCustomCount(count)}
                  className={`py-3 rounded-xl border text-sm font-bold transition ${
                    customCount === count
                      ? "border-[#2866e1] bg-[#2866e1]/10 text-[#2866e1]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Time Limit
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 60, 120].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setCustomTime(time)}
                  className={`py-3 rounded-xl border text-sm font-bold transition ${
                    customTime === time
                      ? "border-[#2866e1] bg-[#2866e1]/10 text-[#2866e1]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {time} Mins
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleStartExam("Custom", customCount, customTime)}
          disabled={loadingType === "Custom"}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-50 ${
            isPro
              ? "bg-slate-900 hover:bg-slate-800 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {loadingType === "Custom" ? (
            <span>Preparing Custom Drill...</span>
          ) : isPro ? (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Custom Mixed Drill ({customCount} Questions, {customTime} Mins)</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-white" />
              <span>Unlock Custom Mixed Drill (PRO)</span>
            </>
          )}
        </button>
      </div>

      {/* Rules & Guidelines Banner */}
      <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100 space-y-4">
        <h4 className="text-sm font-bold text-[#2866e1] flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Council Exam Simulator Guidelines & Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Dynamic Question Palette:</strong> Jump freely between questions 1–250 and flag tough questions for review.
            </span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Auto-Submit Countdown:</strong> The exam will automatically submit when the 2-hour timer reaches zero.
            </span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Subject Breakdown:</strong> Get accurate score analytics per subject (e.g. Pharmacology, Surgery, Midwifery) after submission.
            </span>
          </div>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Unlock Council Exam Simulator (PRO)"
        description="Get full access to 250-question Paper 1 & Paper 2 Council Exam Simulators, procedure flashcards, and practical exam rationales."
      />
    </div>
  );
}
