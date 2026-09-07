"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Flag,
  Send,
  Loader2,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Bookmark,
} from "lucide-react";
import { shuffleArray } from "@/lib/utils";

export default function StudentExamRunnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "Exam" ? "Exam" : "Practice";
  const countParam = searchParams.get("count");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [flagged, setFlagged] = useState<{ [key: number]: boolean }>({});
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const toggleBookmark = async (index: number) => {
    if (!course || !course.questions || !course.questions[index]) return;
    const q = course.questions[index];
    const newBookmarkedState = !bookmarked[index];

    setBookmarked((prev) => ({ ...prev, [index]: newBookmarkedState }));

    try {
      await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          questionId: q._id || `q_${index}`,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
        }),
      });
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  useEffect(() => {
    fetch(`/api/user/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.course) {
          let loadedCourse = data.course;
          const totalAvailable = loadedCourse.questions?.length || 0;
          let reqCount = countParam ? parseInt(countParam, 10) : totalAvailable;
          if (isNaN(reqCount) || reqCount <= 0) reqCount = totalAvailable;

          // Always shuffle question presentation order randomly for each session
          const randomizedQuestions = shuffleArray(loadedCourse.questions || []);

          loadedCourse = {
            ...loadedCourse,
            questions: randomizedQuestions.slice(0, reqCount),
          };

          setCourse(loadedCourse);

          const fullLimitMinutes = data.course.timeLimitMinutes || 60;
          const scaledMinutes =
            totalAvailable > 0
              ? Math.max(1, Math.round((reqCount / totalAvailable) * fullLimitMinutes))
              : fullLimitMinutes;

          setSecondsRemaining(scaledMinutes * 60);
        }
      })
      .catch((err) => console.error("Error loading exam questions:", err))
      .finally(() => setLoading(false));
  }, [id, countParam]);

  // Timer interval countdown
  useEffect(() => {
    if (loading || !course) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (mode === "Exam") {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, course, mode]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionText: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  const toggleFlag = (index: number) => {
    setFlagged((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmitTest = async () => {
    if (submitting || !course) return;
    setSubmitting(true);

    try {
      const answersPayload = course.questions.map((q: any, idx: number) => {
        const userChoice = userAnswers[idx] || "";
        const isCorrect = userChoice.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        return {
          questionId: q._id || `q_${idx}`,
          questionText: q.question,
          userChoice,
          correctChoice: q.correctAnswer,
          isCorrect,
          explanation: q.explanation || "",
        };
      });

      const res = await fetch("/api/user/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          mode,
          answers: answersPayload,
          timeTakenSeconds: elapsedSeconds,
        }),
      });

      const data = await res.json();
      if (data.success && data.attemptId) {
        router.push(`/dashboard/attempts/${data.attemptId}`);
      } else {
        alert(data.error || "Failed to submit exam.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("An error occurred while submitting.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Initializing question bank environment...</span>
      </div>
    );
  }

  if (!course || !course.questions || course.questions.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-4">
        <p>No questions found in this course test bank.</p>
        <Link
          href={`/dashboard/courses/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2866e1] text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </Link>
      </div>
    );
  }

  const questions = course.questions;
  const currentQ = questions[currentIndex];
  const selectedChoice = userAnswers[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12">
      {/* Top Header Runner Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/courses/${id}`}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm md:text-base line-clamp-1">
                {course.title}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  mode === "Exam"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {mode} Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Question {currentIndex + 1} of {questions.length} ({answeredCount} answered)
            </p>
          </div>
        </div>

        {/* Timer & Submit Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-[#2866e1]" />
            <span>
              {mode === "Exam" ? formatTimer(secondsRemaining) : formatTimer(elapsedSeconds)}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#2866e1] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Display */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question {currentIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentIndex)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition cursor-pointer ${
                  bookmarked[currentIndex]
                    ? "bg-[#2866e1]/15 text-[#2866e1] border border-[#2866e1]/30 font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{bookmarked[currentIndex] ? "Saved" : "Save Question"}</span>
              </button>

              <button
                onClick={() => toggleFlag(currentIndex)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition cursor-pointer ${
                  flagged[currentIndex]
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentIndex] ? "Flagged" : "Flag for review"}</span>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-slate-900 font-bold text-base md:text-lg leading-snug">
            {currentQ.question}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt: string, optIdx: number) => {
              const isSelected = selectedChoice === opt;
              const isCorrectAnswer =
                opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

              let borderStyle = "border-slate-200 hover:border-slate-300 bg-white";
              if (isSelected) {
                borderStyle = "border-[#2866e1] bg-[#f5f8ff] shadow-xs";
              }

              // In practice mode, reveal green/red feedback once selected
              if (mode === "Practice" && selectedChoice) {
                if (isCorrectAnswer) {
                  borderStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold";
                } else if (isSelected && !isCorrectAnswer) {
                  borderStyle = "border-rose-400 bg-rose-50/70 text-rose-950 font-semibold";
                }
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3.5 ${borderStyle}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-[#2866e1] bg-[#2866e1] text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <div className="text-xs md:text-sm text-slate-800 flex-1 leading-relaxed">
                    {opt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practice Mode Rationale Feedback Card */}
          {mode === "Practice" && selectedChoice && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold">
                {selectedChoice.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase() ? (
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <XCircle className="w-4 h-4" /> Incorrect Choice (Correct: {currentQ.correctAnswer})
                  </span>
                )}
              </div>

              {currentQ.explanation && (
                <div className="text-xs text-slate-700 leading-relaxed border-t border-slate-200/60 pt-2.5">
                  <span className="font-bold text-slate-900">Clinical Rationale: </span>
                  {currentQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* Question Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                Review & Submit <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs h-fit space-y-4">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Question Navigator
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((_: any, idx: number) => {
              const isAnswered = !!userAnswers[idx];
              const isCurrent = idx === currentIndex;
              const isFlagged = !!flagged[idx];

              let bgStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200";
              if (isAnswered) bgStyle = "bg-[#2866e1]/15 text-[#2866e1] font-bold border border-[#2866e1]/30";
              if (isFlagged) bgStyle = "bg-amber-100 text-amber-800 font-bold border border-amber-300";
              if (isCurrent) bgStyle = "bg-[#2866e1] text-white font-extrabold shadow-sm";

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${bgStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2866e1]" /> Active Question
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2866e1]/20 border border-[#2866e1]/40" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400" /> Flagged
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2.5 bg-blue-50 text-[#2866e1] rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Submit Test Attempt?</h3>
                <p className="text-xs text-slate-500">
                  {mode === "Exam" ? "Board Exam Mode" : "Practice Session"}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Answered Questions:</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unanswered Questions:</span>
                <span className="font-bold text-rose-600">{questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Spent:</span>
                <span className="font-bold text-slate-900">{formatTimer(elapsedSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
