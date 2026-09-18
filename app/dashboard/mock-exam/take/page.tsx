"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Award,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  Zap,
  HelpCircle,
  BookOpen,
  Lock,
} from "lucide-react";
import PaywallModal from "@/components/PaywallModal";
import { isAnswerMatch } from "@/lib/questionUtils";

interface QuestionItem {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  courseId?: string;
  courseTitle?: string;
}

interface SubjectBreakdown {
  courseId?: string;
  courseTitle: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
}

function TimedMockExamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paperType = searchParams.get("paperType") || "Paper1";
  const reqCount = searchParams.get("count") || "250";
  const reqTimeLimit = searchParams.get("timeLimit") || "120";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProRequired, setIsProRequired] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [paperTitle, setPaperTitle] = useState("Council Mock Exam");

  // Exam state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);

  // Result state
  const [result, setResult] = useState<{
    attemptId: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    subjectBreakdown: SubjectBreakdown[];
  } | null>(null);

  // Fetch Questions
  useEffect(() => {
    async function fetchExam() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/user/mock-exam/generate?paperType=${paperType}&count=${reqCount}&timeLimit=${reqTimeLimit}`
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          if (res.status === 401) {
            setError("Your session has expired. Please sign in again to access the mock exam.");
          } else {
            setError(`Failed to start mock exam (Server status: ${res.status}). Please verify published courses exist.`);
          }
          return;
        }

        const data = await res.json();

        if (!res.ok || !data.success) {
          if (data.isProRequired) {
            setIsProRequired(true);
          }
          setError(data.error || "Failed to load exam questions.");
          return;
        }

        setQuestions(data.questions);
        setPaperTitle(data.paperTitle);
        const totalSeconds = (data.timeLimitMinutes || 120) * 60;
        setTimeRemaining(totalSeconds);
        setInitialTime(totalSeconds);
      } catch (err: any) {
        setError(err.message || "Error starting mock exam.");
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [paperType, reqCount, reqTimeLimit]);

  // Submit Handler
  const handleSubmitExam = useCallback(async () => {
    if (isSubmitting || result) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const timeTakenSeconds = initialTime - timeRemaining;

      const formattedAnswers = questions.map((q, idx) => {
        const userChoice = answers[idx] || "";
        const isCorrect = isAnswerMatch(userChoice, q.correctAnswer);
        return {
          questionId: q._id || "",
          courseId: q.courseId || "",
          courseTitle: q.courseTitle || "General Knowledge",
          questionText: q.question,
          userChoice,
          correctChoice: q.correctAnswer,
          isCorrect,
          explanation: q.explanation || "",
        };
      });

      const res = await fetch("/api/user/mock-exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperTitle,
          answers: formattedAnswers,
          timeTakenSeconds,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to submit exam.");
        setIsSubmitting(false);
        return;
      }

      setResult({
        attemptId: data.attemptId,
        score: data.score,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions,
        passed: data.passed,
        subjectBreakdown: data.subjectBreakdown || [],
      });
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Failed to submit exam attempt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, result, initialTime, timeRemaining, questions, answers, paperTitle]);

  // Timer countdown
  useEffect(() => {
    if (loading || result || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, result, timeRemaining, handleSubmitExam]);

  // Format time (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const toggleFlag = (index: number) => {
    setFlagged((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-[#2866e1] animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Hand-picking {reqCount} questions across published courses...
        </p>
      </div>
    );
  }

  if (error) {
    if (isProRequired) {
      return (
        <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-amber-200 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" /> Pro Feature
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Avero Pro Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPaywall(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Upgrade to Pro Now</span>
            </button>

            <Link
              href="/dashboard/mock-exam"
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Launchpad</span>
            </Link>
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

    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-rose-200 shadow-sm text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Could Not Start Exam</h2>
        <p className="text-xs text-slate-600">{error}</p>
        <Link
          href="/dashboard/mock-exam"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exam Launchpad
        </Link>
      </div>
    );
  }

  // Render Post-Exam Results View
  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Results Header Card */}
        <div
          className={`rounded-3xl p-8 text-white shadow-xl ${
            result.passed
              ? "bg-gradient-to-r from-emerald-600 to-teal-700"
              : "bg-gradient-to-r from-slate-800 to-rose-700"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{paperTitle} Results</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {result.passed ? "Passed Council Exam! 🎉" : "Exam Attempt Completed"}
              </h1>
              <p className="text-xs text-white/90">
                You answered {result.correctCount} out of {result.totalQuestions} questions correctly.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center min-w-[180px]">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
                Final Score
              </span>
              <span className="text-4xl font-extrabold tracking-tight block my-1">
                {result.score}%
              </span>
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  result.passed
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-rose-400 text-slate-950"
                }`}
              >
                {result.passed ? "PASS" : "NEEDS IMPROVEMENT"}
              </span>
            </div>
          </div>
        </div>

        {/* Subject-by-Subject Breakdown Grid */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#2866e1]" />
              Subject & Course Accuracy Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review your accuracy across individual subjects to identify key areas for revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.subjectBreakdown.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
              >
                <div className="space-y-1 max-w-[65%]">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {sub.courseTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {sub.correctCount} / {sub.totalQuestions} correct
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-extrabold ${
                      sub.score >= 70
                        ? "text-emerald-600"
                        : sub.score >= 50
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {sub.score}%
                  </span>
                  <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.score >= 70
                          ? "bg-emerald-500"
                          : sub.score >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/dashboard/mock-exam"
            className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exam Launchpad
          </Link>

          <Link
            href={`/dashboard/attempts/${result.attemptId}`}
            className="flex items-center gap-2 px-6 py-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold text-xs transition shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Review Full Answer Rationales
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sticky Exam Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between sticky top-2 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-[#2866e1] rounded-xl font-bold text-xs hidden sm:block">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm tracking-tight truncate max-w-[200px] sm:max-w-md">
              {paperTitle}
            </h1>
            <p className="text-[11px] text-slate-500">
              Question {currentIndex + 1} of {questions.length} • {answeredCount} Answered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-bold ${
              timeRemaining < 900
                ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                : "bg-slate-50 text-slate-800 border-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-xl font-bold text-xs"
          >
            Palette
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-xs cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Exam Body Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left/Center Column: Question & Options (3 cols) */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            {/* Subject/Course Tag */}
            {currentQ?.courseTitle && (
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full">
                  <BookOpen className="w-3.5 h-3.5 text-[#2866e1]" />
                  <span>Subject: {currentQ.courseTitle}</span>
                </span>

                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    flagged[currentIndex]
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged[currentIndex] ? "fill-amber-600" : ""}`} />
                  <span>{flagged[currentIndex] ? "Flagged for Review" : "Flag for Review"}</span>
                </button>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#2866e1] uppercase tracking-wider">
                Question {currentIndex + 1}
              </span>
              <p className="text-base md:text-lg font-medium text-slate-900 leading-relaxed">
                {currentQ?.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map((opt, oIdx) => {
                const isSelected = answers[currentIndex] === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#2866e1]/10 border-[#2866e1] text-[#2866e1] shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#2866e1] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-normal flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] disabled:opacity-40 text-white rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 1-250 Question Palette Grid (1 col) */}
        <div
          className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 ${
            showPaletteMobile ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Question Navigator ({questions.length})
            </h3>
            <span className="text-[11px] font-bold text-[#2866e1]">
              {answeredCount}/{questions.length} Done
            </span>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#2866e1]" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border border-slate-300 bg-white" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-400" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400" />
              <span>Current</span>
            </div>
          </div>

          {/* Question Grid Buttons Matrix */}
          <div className="max-h-[500px] overflow-y-auto pr-1 grid grid-cols-5 gap-2">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = !!answers[idx];
              const isFlagged = !!flagged[idx];

              let bgClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

              if (isFlagged) {
                bgClass = "bg-amber-400 text-slate-950 border-amber-500 font-black";
              } else if (isAnswered) {
                bgClass = "bg-[#2866e1] text-white border-[#2866e1]";
              }

              if (isCurrent) {
                bgClass += " ring-2 ring-offset-1 ring-blue-600 font-extrabold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs font-medium transition flex items-center justify-center cursor-pointer ${bgClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Final Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-100">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Submit Council Exam?</h3>
              <p className="text-xs text-slate-500">
                You are about to complete and grade your exam paper.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Questions Answered:</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unanswered Questions:</span>
                <span className="font-bold text-rose-600">
                  {questions.length - answeredCount}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Flagged Questions:</span>
                <span className="font-bold text-amber-600">
                  {Object.values(flagged).filter(Boolean).length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Return to Exam
              </button>

              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Grading Paper..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimedMockExamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-10 h-10 text-[#2866e1] animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading exam environment...</p>
        </div>
      }
    >
      <TimedMockExamContent />
    </Suspense>
  );
}
