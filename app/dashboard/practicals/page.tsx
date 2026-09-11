"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Lock,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import PaywallModal from "@/components/PaywallModal";

export default function PracticalQuestionsPage() {
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [practicalModules, setPracticalModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"flashcard" | "markings" | "questions">("flashcard");
  const [showPaywall, setShowPaywall] = useState(false);

  // Quiz state for questions tab
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: string }>({});

  useEffect(() => {
    fetch("/api/user/practicals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsPro(Boolean(data.isPro));
          setPracticalModules(data.practicalModules || []);
          if (data.practicalModules && data.practicalModules.length > 0) {
            setSelectedModule(data.practicalModules[0]);
          }
        }
      })
      .catch((err) => console.error("Error loading practical modules:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectModule = (mod: any) => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    setSelectedModule(mod);
    setActiveTab("flashcard");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-[#2866e1] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Practical Question Banks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-[#2866e1] text-white rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              Pro Feature
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-amber-400 shrink-0" />
              Practical Examination Questions
            </h1>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl">
              Master clinical and nursing practical procedures. Flip through procedure flashcard guides, study mark allocation sheets, and solve targeted practical exam questions with verbatim rationales.
            </p>
          </div>

          {!isPro && (
            <button
              onClick={() => setShowPaywall(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md hover:shadow-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Practical Banks (PRO)</span>
            </button>
          )}
        </div>
      </div>

      {/* Free User Upgrade Banner */}
      {!isPro && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">Practical Questions require Avero Pro</h3>
              <p className="text-xs text-amber-800">
                Upgrade to unlock flashcard procedures, marking schemes, and full practical question banks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      {practicalModules.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Practical Question Modules Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Practical question banks uploaded by instructors will appear here. Check back soon for updated clinical procedures.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Practical Modules List (Left Sidebar) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Available Practical Procedures ({practicalModules.length})
            </h3>

            <div className="space-y-2">
              {practicalModules.map((mod) => {
                const isSelected = selectedModule?.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectModule(mod)}
                    className={`w-full text-left p-4 rounded-2xl border transition relative cursor-pointer ${
                      isSelected
                        ? "bg-[#2866e1] text-white border-[#2866e1] shadow-md"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {mod.category}
                        </span>
                        <h4 className="text-sm font-bold mt-1.5 leading-snug">
                          {mod.practicalTitle}
                        </h4>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            isSelected ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {mod.courseTitle}
                        </p>
                      </div>

                      {!isPro ? (
                        <Lock
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? "text-amber-300" : "text-slate-400"
                          }`}
                        />
                      ) : (
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? "text-white" : "text-slate-400"
                          }`}
                        />
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-semibold opacity-90">
                      <span>{mod.questions.length} Questions</span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        OCR Parsed
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practical Viewer (Right Side) */}
          <div className="lg:col-span-8">
            {selectedModule && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
                {/* Header & Tabs */}
                <div className="space-y-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#2866e1] uppercase tracking-wider">
                        {selectedModule.category}
                      </span>
                      <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {selectedModule.practicalTitle}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full w-fit">
                      {selectedModule.courseTitle}
                    </span>
                  </div>

                  {/* 3 Tabs */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("flashcard")}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "flashcard"
                          ? "bg-white text-[#2866e1] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>1. Flashcard Guide</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("markings")}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "markings"
                          ? "bg-white text-amber-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>2. Mark Allocation</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("questions")}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "questions"
                          ? "bg-white text-emerald-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>3. Questions ({selectedModule.questions.length})</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: FLASHCARD EXPLANATORY IMAGE */}
                {activeTab === "flashcard" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#2866e1]" />
                      Procedure Explanatory Flashcard
                    </h3>

                    {selectedModule.flashcardImageUrl ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-900">
                        <img
                          src={selectedModule.flashcardImageUrl}
                          alt="Practical Flashcard Guide"
                          className="w-full h-auto max-h-[700px] object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                        No flashcard image attached for this practical module.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: MARKINGS SHEET IMAGE */}
                {activeTab === "markings" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Mark Allocation & Scoring Rubric Sheet
                    </h3>

                    {selectedModule.markingSchemeImageUrl ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-900">
                        <img
                          src={selectedModule.markingSchemeImageUrl}
                          alt="Marking Allocation Rubric"
                          className="w-full h-auto max-h-[700px] object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-amber-50/50 border border-amber-200/60 rounded-2xl text-amber-800 text-xs">
                        No mark allocation sheet attached for this practical module.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: QUESTIONS LIST & QUIZ (ONE BY ONE) */}
                {activeTab === "questions" && (
                  <div className="space-y-6">
                    {/* Questions Header & Progress */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-extrabold text-slate-900">
                            Question {currentQuestionIndex + 1} of {selectedModule.questions.length}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Select your answer to reveal the exact clinical rationale.
                          </p>
                        </div>
                      </div>

                      {/* Question Navigation Dots / Numbers */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedModule.questions.map((_: any, idx: number) => {
                          const ans = userAnswers[idx];
                          const isCurr = currentQuestionIndex === idx;
                          let dotStyle = "bg-white text-slate-600 border-slate-200 hover:bg-slate-100";
                          if (ans) {
                            const isRight = ans === selectedModule.questions[idx].correctAnswer;
                            dotStyle = isRight
                              ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                              : "bg-rose-600 text-white border-rose-600 font-bold";
                          } else if (isCurr) {
                            dotStyle = "bg-[#2866e1] text-white border-[#2866e1] font-bold shadow-xs";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition cursor-pointer ${dotStyle}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Single Active Question Card */}
                    {selectedModule.questions[currentQuestionIndex] && (() => {
                      const qIdx = currentQuestionIndex;
                      const q = selectedModule.questions[qIdx];
                      const selectedOpt = userAnswers[qIdx];
                      const isAnswered = Boolean(selectedOpt);
                      const isCorrect = selectedOpt === q.correctAnswer;

                      return (
                        <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                            <span className="text-xs font-extrabold text-[#2866e1] uppercase tracking-wider">
                              Question #{qIdx + 1}
                            </span>
                            {isAnswered && (
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase ${
                                  isCorrect
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Correct
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    Incorrect
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                            {q.question}
                          </p>

                          {/* Options List */}
                          <div className="space-y-2.5">
                            {q.options?.map((opt: string, optIdx: number) => {
                              const isThisSelected = selectedOpt === opt;
                              const isThisCorrectAnswer = q.correctAnswer === opt;

                              let optionStyle =
                                "bg-white border-slate-200 text-slate-800 hover:bg-slate-100/90";
                              if (isAnswered) {
                                if (isThisCorrectAnswer) {
                                  optionStyle =
                                    "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                                } else if (isThisSelected) {
                                  optionStyle =
                                    "bg-rose-50 border-rose-400 text-rose-950 font-medium";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(qIdx, opt)}
                                  className={`w-full text-left p-3.5 border rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && isThisCorrectAnswer && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Rationale Breakdown */}
                          {isAnswered && (
                            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5 text-xs animate-in fade-in">
                              <span className="font-bold text-blue-900 uppercase tracking-wide text-[10px] flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Exact Clinical Rationale
                              </span>
                              <p className="text-slate-800 italic leading-relaxed font-medium">
                                {q.explanation || "No explanation provided for this question."}
                              </p>
                            </div>
                          )}

                          {/* Navigation Buttons (Previous / Next) */}
                          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                              disabled={currentQuestionIndex === 0}
                              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                              <span>Previous Question</span>
                            </button>

                            {currentQuestionIndex < selectedModule.questions.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                                className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Next Question</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setCurrentQuestionIndex(0)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Restart Questions</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paywall Modal for Free Users */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Unlock Practical Questions Bank"
        description="Get full access to procedure flashcards, mark allocation rubrics, and OCR-extracted clinical practical questions."
      />
    </div>
  );
}
