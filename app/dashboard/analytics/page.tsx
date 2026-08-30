"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function StudentAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/user/stats"), fetch("/api/user/attempts")])
      .then(async ([statsRes, attemptsRes]) => {
        const statsData = await statsRes.json();
        const attemptsData = await attemptsRes.json();
        if (statsData.success) setStats(statsData.stats);
        if (attemptsData.success) setAttempts(attemptsData.attempts || []);
      })
      .catch((err) => console.error("Error loading analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Study Analytics & Readiness
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Track score trends, monitor board-exam accuracy thresholds, and identify areas for clinical review.
          </p>
        </div>

        <Link
          href="/dashboard/courses"
          className="px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Start New Practice
        </Link>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
          <span className="text-sm">Calculating study analytics metrics...</span>
        </div>
      ) : (
        <>
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Average Pass Accuracy</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats?.averageScore || 0}%
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats?.averageScore || 0)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-1">
                Target Passing Goal: <strong className="text-slate-800">75%</strong>
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Total Test Attempts</span>
                <Award className="w-4 h-4 text-[#2866e1]" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats?.totalAttempts || 0}
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-1">
                <span className="text-emerald-600 font-bold">{stats?.passedAttempts || 0}</span> passed successfully
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Cumulative Study Hours</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {formatTime(stats?.totalTimeSpentSeconds || 0)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-1">
                Active time in practice & exam sessions
              </p>
            </div>
          </div>

          {/* Test Performance Log Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Attempt Score Trend Log</h3>
            {attempts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No attempt history available yet. Complete a test bank to see your score trends!
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.slice(0, 10).map((attempt, index) => (
                  <div
                    key={attempt._id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white font-bold text-slate-600 border border-slate-200 flex items-center justify-center text-[11px]">
                        #{attempts.length - index}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {attempt.courseId?.title || "Practice Test"}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {new Date(attempt.createdAt).toLocaleDateString()} • {attempt.mode} Mode
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-extrabold text-sm ${attempt.passed ? "text-emerald-600" : "text-rose-600"}`}>
                          {attempt.score}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {attempt.correctCount}/{attempt.totalQuestions} Correct
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/attempts/${attempt._id}`}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#2866e1] font-semibold text-xs transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
