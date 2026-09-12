"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart2,
  Loader2,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function StudentAttemptsHistoryPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>("All");

  useEffect(() => {
    fetch("/api/user/attempts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempts(data.attempts || []);
        }
      })
      .catch((err) => console.error("Error fetching attempt history:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const filteredAttempts = attempts.filter((attempt) => {
    if (filterMode === "Passed") return attempt.passed;
    if (filterMode === "Failed") return !attempt.passed;
    if (filterMode === "Exam") return attempt.mode === "Exam";
    if (filterMode === "Practice") return attempt.mode === "Practice";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Exam Attempts & History
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Review detailed question rationales, study performance metrics, and track improvement across practice sessions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["All", "Passed", "Failed", "Exam", "Practice"].map((item) => (
            <button
              key={item}
              onClick={() => setFilterMode(item)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                filterMode === item
                  ? "bg-[#2866e1] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Attempts Table */}
      {loading ? (
        <div className="py-16 flex justify-center items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
          <span className="text-sm">Loading test attempt history...</span>
        </div>
      ) : filteredAttempts.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-3">
          <p>No attempt records found for this filter.</p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2866e1] text-white font-bold text-xs rounded-xl"
          >
            Start Practice Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">Course / Test Bank</th>
                <th className="pb-3 px-2">Mode</th>
                <th className="pb-3 px-2">Score Accuracy</th>
                <th className="pb-3 px-2">Time Taken</th>
                <th className="pb-3 px-2">Attempt Date</th>
                <th className="pb-3 px-2 text-right">Rationale Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttempts.map((attempt) => (
                <tr key={attempt._id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-2 font-bold text-slate-900">
                    <div>{attempt.paperTitle || attempt.courseId?.title || "Council Mock Exam"}</div>
                    <div className="text-[11px] font-normal text-slate-500">
                      {attempt.isMockExam
                        ? "Full Mixed Council Simulation"
                        : `Passing Threshold: ${attempt.courseId?.passingScorePercentage || 75}%`}
                    </div>
                  </td>

                  <td className="py-4 px-2">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        attempt.mode === "Exam"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {attempt.mode} Mode
                    </span>
                  </td>

                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      {attempt.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span
                          className={`font-extrabold text-sm ${
                            attempt.passed ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {attempt.score}%
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                          ({attempt.correctCount}/{attempt.totalQuestions})
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-2 font-semibold text-slate-600">
                    {formatTime(attempt.timeTakenSeconds)}
                  </td>

                  <td className="py-4 px-2 text-slate-400">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </td>

                  <td className="py-4 px-2 text-right">
                    <Link
                      href={`/dashboard/attempts/${attempt._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2866e1]/10 hover:bg-[#2866e1] text-[#2866e1] hover:text-white font-bold text-xs transition inline-flex items-center gap-1.5"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Review Rationales</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
