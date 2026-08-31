"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  HelpCircle,
  PlayCircle,
  FileCheck2,
  ArrowLeft,
  Loader2,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<"Practice" | "Exam">("Practice");
  const [questionCount, setQuestionCount] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/user/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourse(data.course);
          setPreviousAttempts(data.previousAttempts || []);
          const totalQ = data.course?.questions?.length || 0;
          setQuestionCount(totalQ);
        }
      })
      .catch((err) => console.error("Error fetching course detail:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartSession = () => {
    const totalQ = course?.questions?.length || 1;
    const finalCount = Math.max(1, Math.min(questionCount || totalQ, totalQ));
    router.push(`/dashboard/courses/${id}/take?mode=${selectedMode}&count=${finalCount}`);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading test bank details...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-4">
        <p>Course test bank not found or is no longer published.</p>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2866e1] text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2866e1] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
      </Link>

      {/* Main Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20 font-bold text-xs">
            {course.categoryId?.name || "General Medical"}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
            {course.level} Level
          </span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            {course.title}
          </h1>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#2866e1]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 font-medium text-[10px] uppercase">Question Count</div>
              <div className="font-bold text-slate-900">{course.questions?.length || 0} Questions</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 font-medium text-[10px] uppercase">Time Limit</div>
              <div className="font-bold text-slate-900">{course.timeLimitMinutes || 60} Minutes</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 font-medium text-[10px] uppercase">Pass Score</div>
              <div className="font-bold text-emerald-600">{course.passingScorePercentage || 75}% Required</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 font-medium text-[10px] uppercase">Modules</div>
              <div className="font-bold text-slate-900">{course.modules?.length || 1} Syllabus Units</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Select Practice Mode</h2>
          <p className="text-xs text-slate-500">Choose how you wish to take this question set</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practice Mode Selector */}
          <div
            onClick={() => setSelectedMode("Practice")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
              selectedMode === "Practice"
                ? "border-[#2866e1] bg-[#f5f8ff]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#2866e1]" />
                  <span className="font-extrabold text-slate-900 text-sm">Practice Mode</span>
                </div>
                {selectedMode === "Practice" && (
                  <CheckCircle2 className="w-5 h-5 text-[#2866e1]" />
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Immediate option validation and detailed question rationales after every question. Best for learning and study revision.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#2866e1]">
              ✓ Instant Explanations Enabled
            </div>
          </div>

          {/* Exam Mode Selector */}
          <div
            onClick={() => setSelectedMode("Exam")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
              selectedMode === "Exam"
                ? "border-[#2866e1] bg-[#f5f8ff]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-600" />
                  <span className="font-extrabold text-slate-900 text-sm">Timed Exam Mode</span>
                </div>
                {selectedMode === "Exam" && (
                  <CheckCircle2 className="w-5 h-5 text-[#2866e1]" />
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Simulates real exam environment with a countdown timer. Question status palette and final score calculation upon submit.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-amber-700">
              ⏱ Timed Board Exam Simulation
            </div>
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Number of Questions</h3>
              <p className="text-xs text-slate-500">Select how many questions you want to take in this session</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold font-mono">
              {questionCount} / {course.questions?.length || 0} Questions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 20, 50, 100].map((preset) => {
              const maxQ = course.questions?.length || 0;
              if (preset > maxQ) return null;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuestionCount(preset)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    questionCount === preset
                      ? "bg-[#2866e1] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {preset} Qs
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setQuestionCount(course.questions?.length || 0)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                questionCount === (course.questions?.length || 0)
                  ? "bg-[#2866e1] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({course.questions?.length || 0})
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-semibold text-slate-500">Custom count:</span>
            <input
              type="number"
              min={1}
              max={course.questions?.length || 1}
              value={questionCount || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                const maxQ = course.questions?.length || 1;
                if (isNaN(val)) setQuestionCount(0);
                else setQuestionCount(Math.max(1, Math.min(val, maxQ)));
              }}
              className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
            />
            <span className="text-xs text-slate-400 font-medium">max: {course.questions?.length || 0}</span>
          </div>
        </div>

        <button
          onClick={handleStartSession}
          className="w-full py-3.5 px-6 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Launch {selectedMode} Session ({questionCount} Questions)</span>
        </button>
      </div>

      {/* Modules Syllabus Breakdown */}
      {course.modules && course.modules.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Syllabus & Course Modules</h3>
          <div className="divide-y divide-slate-100">
            {course.modules.map((mod: any, idx: number) => (
              <div key={idx} className="py-3.5 flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{mod.title}</div>
                  <div className="text-slate-500 mt-1">{mod.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
