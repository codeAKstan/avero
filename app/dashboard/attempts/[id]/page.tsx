"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Loader2,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function StudentAttemptDetailReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterView, setFilterView] = useState<"All" | "Incorrect" | "Correct">("All");

  useEffect(() => {
    fetch(`/api/user/attempts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempt(data.attempt);
        }
      })
      .catch((err) => console.error("Error loading attempt detail:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading detailed attempt rationales...</span>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-4">
        <p>Attempt record not found.</p>
        <Link
          href="/dashboard/attempts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2866e1] text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
      </div>
    );
  }

  const answers = attempt.answers || [];
  const filteredAnswers = answers.filter((ans: any) => {
    if (filterView === "Incorrect") return !ans.isCorrect;
    if (filterView === "Correct") return ans.isCorrect;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/attempts"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2866e1] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Attempt History
      </Link>

      {/* Attempt Header Summary Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
              {attempt.mode} Mode Review
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {attempt.courseId?.title || "Test Bank Performance"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Attempt completed on {new Date(attempt.createdAt).toLocaleString()}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold text-sm ${
              attempt.passed
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {attempt.passed ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>PASSED</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>NEEDS REVISION</span>
              </>
            )}
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold uppercase text-[9px]">Score Accuracy</div>
            <div
              className={`text-2xl font-extrabold mt-1 ${
                attempt.passed ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {attempt.score}%
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold uppercase text-[9px]">Correct Questions</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {attempt.correctCount} / {attempt.totalQuestions}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold uppercase text-[9px]">Time Spent</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {formatTime(attempt.timeTakenSeconds || 0)}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold uppercase text-[9px]">Passing Threshold</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">
              {attempt.courseId?.passingScorePercentage || 75}%
            </div>
          </div>
        </div>
      </div>

      {/* Rationale Filter Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <h2 className="font-bold text-slate-900 text-sm">Question Rationales & Explanations</h2>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterView("All")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterView === "All"
                ? "bg-[#2866e1] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({answers.length})
          </button>
          <button
            onClick={() => setFilterView("Incorrect")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterView === "Incorrect"
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Incorrect ({answers.filter((a: any) => !a.isCorrect).length})
          </button>
          <button
            onClick={() => setFilterView("Correct")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterView === "Correct"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Correct ({answers.filter((a: any) => a.isCorrect).length})
          </button>
        </div>
      </div>

      {/* Question Rationales List */}
      <div className="space-y-6">
        {filteredAnswers.map((ans: any, idx: number) => (
          <div
            key={idx}
            className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 ${
              ans.isCorrect ? "border-slate-200" : "border-rose-200 bg-rose-50/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question {idx + 1}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  ans.isCorrect
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {ans.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct Answer
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect Choice
                  </>
                )}
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">
              {ans.questionText}
            </h3>

            {/* Answer choices comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
              <div
                className={`p-3.5 rounded-xl border ${
                  ans.isCorrect
                    ? "border-emerald-300 bg-emerald-50/80 text-emerald-950"
                    : "border-rose-300 bg-rose-50/80 text-rose-950"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Your Answer:
                </div>
                <div className="font-semibold">{ans.userChoice || "(No option selected)"}</div>
              </div>

              {!ans.isCorrect && (
                <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/80 text-emerald-950">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    Correct Choice:
                  </div>
                  <div className="font-semibold">{ans.correctChoice}</div>
                </div>
              )}
            </div>

            {/* Clinical Rationale Box */}
            {ans.explanation && (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 leading-relaxed space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2866e1]" />
                  <span>Clinical Rationale & Learning Concept</span>
                </div>
                <p className="text-slate-700">{ans.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
