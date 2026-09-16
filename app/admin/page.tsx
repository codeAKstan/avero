"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderTree,
  TrendingUp,
  UserCheck,
  Plus,
  ArrowRight,
  Shield,
  Loader2,
  RefreshCw,
  Zap,
  Crown,
  CreditCard,
} from "lucide-react";

interface IStats {
  totalUsers: number;
  totalStudents: number;
  totalEducators: number;
  totalAdmins: number;
  onboardedUsers: number;
  onboardedPercentage: number;
  totalProUsers?: number;
  activeProUsers?: number;
  expiredProUsers?: number;
  proPercentage?: number;
  totalCategories: number;
  totalCourses: number;
  publishedCourses: number;
  totalRevenue?: number;
  totalTransactions?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
      }
    } catch (err) {
      console.error("Error loading dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to Administrator Portal
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-xl">
              Monitor platform metrics, manage student & educator accounts, organize categories, and convert past question documents into online test banks using AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchStats}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              href="/admin/courses/new"
              className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl text-xs font-bold shadow-md shadow-[#2866e1]/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New OCR Course</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
          <span className="text-sm">Loading telemetry metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Users */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#2866e1]/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Users
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{stats?.onboardedUsers || 0} onboarded ({stats?.onboardedPercentage || 0}%)</span>
            </div>
          </div>

          {/* Pro Users */}
          <Link
            href="/admin/pro-users"
            className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-amber-400 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-700 transition">
                Pro Users
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-2">
              <span>{stats?.totalProUsers || 0}</span>
              <span className="text-xs text-amber-600 font-bold">({stats?.proPercentage || 0}%)</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{stats?.activeProUsers || 0} active subscriptions</span>
            </div>
          </Link>

          {/* Students vs Educators */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#2866e1]/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Students / Educators
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.totalStudents || 0} <span className="text-sm text-slate-400 font-normal">/ {stats?.totalEducators || 0}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Students & Educators active on platform
            </div>
          </div>

          {/* Published Courses */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#2866e1]/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Courses Created
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.totalCourses || 0}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{stats?.publishedCourses || 0} Published & Live</span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#2866e1]/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Course Categories
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                <FolderTree className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.totalCategories || 0}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Structured learning tracks & tags
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Grid & Recent Signups Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2866e1]" /> Administrative Quick Actions
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Shortcuts for core platform management workflows.
            </p>

            <div className="space-y-3">
              <Link
                href="/admin/transactions"
                className="flex items-center justify-between p-3.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl transition text-sm font-semibold text-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-emerald-800">
                      Payment Transactions & Revenue
                    </div>
                    <div className="text-xs font-normal text-slate-500">View Paystack payment logs & revenue</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/pro-users"
                className="flex items-center justify-between p-3.5 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 rounded-xl transition text-sm font-semibold text-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-amber-800">
                      Pro Users Directory
                    </div>
                    <div className="text-xs font-normal text-slate-500">View & manage all Pro subscribers</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/courses/new"
                className="flex items-center justify-between p-3.5 bg-[#f5f8ff] hover:bg-[#ebf2ff] border border-[#2866e1]/20 rounded-xl transition text-sm font-semibold text-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2866e1]/10 text-[#2866e1]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#2866e1]">
                      OCR Document Course Creator
                    </div>
                    <div className="text-xs font-normal text-slate-500">Convert PDF/Image to Course</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2866e1] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-sm font-semibold text-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                      User Management
                    </div>
                    <div className="text-xs font-normal text-slate-500">Search, filter & edit roles</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-sm font-semibold text-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-amber-600">
                      Manage Categories
                    </div>
                    <div className="text-xs font-normal text-slate-500">Create & order categories</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#f5f8ff] border border-[#2866e1]/20 rounded-xl text-xs text-slate-600">
            <span className="font-bold text-[#2866e1]">Pro Tip:</span> Uploading past question papers into the OCR AI Builder automatically converts test questions, choices (A-D), and rationales for student practice tests.
          </div>
        </div>

        {/* Recent Registered Users Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recently Registered Accounts</h3>
              <p className="text-xs text-slate-500">Latest student & educator signups</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-[#2866e1] hover:text-[#1d52bf] flex items-center gap-1"
            >
              View All Users <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No recent registered users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-2">User</th>
                    <th className="pb-3 px-2">Role</th>
                    <th className="pb-3 px-2">University</th>
                    <th className="pb-3 px-2">Registered</th>
                    <th className="pb-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        <div>{u.fullName}</div>
                        <div className="text-[11px] font-normal text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`capitalize px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.role === "admin"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : u.role === "educator"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20"
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500 font-medium">
                        {u.university || "—"}
                      </td>
                      <td className="py-3 px-2 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {u.isOnboarded ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
