"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Crown,
  Clock,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export default function AdminProUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"pro" | "active_pro" | "expired_pro">("pro");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Overall Stats state
  const [stats, setStats] = useState<{
    totalProUsers: number;
    activeProUsers: number;
    expiredProUsers: number;
    totalUsers: number;
    proPercentage: number;
  } | null>(null);

  // Modal states
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Subscription management state
  const [subForm, setSubForm] = useState<{
    plan: "free" | "pro";
    durationPreset: "1_month" | "3_months" | "6_months" | "1_year" | "lifetime" | "custom";
    customDate: string;
  }>({
    plan: "pro",
    durationPreset: "1_month",
    customDate: "",
  });
  const [subSaving, setSubSaving] = useState(false);

  const fetchProStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats({
          totalProUsers: data.stats.totalProUsers || 0,
          activeProUsers: data.stats.activeProUsers || 0,
          expiredProUsers: data.stats.expiredProUsers || 0,
          totalUsers: data.stats.totalUsers || 0,
          proPercentage: data.stats.proPercentage || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch pro stats", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        plan: planFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalUsers(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch pro users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, planFilter, page, limit]);

  const openSubModal = (user: any) => {
    setSelectedUser(user);
    const isProNow = user.subscriptionPlan === "pro";

    let defaultCustom = "";
    if (user.subscriptionExpiresAt) {
      defaultCustom = new Date(user.subscriptionExpiresAt).toISOString().split("T")[0];
    }

    setSubForm({
      plan: isProNow ? "pro" : "pro",
      durationPreset: "1_month",
      customDate: defaultCustom,
    });
    setIsSubModalOpen(true);
  };

  const calculateExpirationDate = () => {
    if (subForm.plan === "free") return null;

    const now = new Date();
    switch (subForm.durationPreset) {
      case "1_month":
        now.setMonth(now.getMonth() + 1);
        return now.toISOString();
      case "3_months":
        now.setMonth(now.getMonth() + 3);
        return now.toISOString();
      case "6_months":
        now.setMonth(now.getMonth() + 6);
        return now.toISOString();
      case "1_year":
        now.setFullYear(now.getFullYear() + 1);
        return now.toISOString();
      case "lifetime":
        now.setFullYear(now.getFullYear() + 100);
        return now.toISOString();
      case "custom":
        return subForm.customDate ? new Date(subForm.customDate).toISOString() : null;
      default:
        now.setMonth(now.getMonth() + 1);
        return now.toISOString();
    }
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubSaving(true);
    try {
      const expiresAt = calculateExpirationDate();

      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionPlan: subForm.plan,
          subscriptionExpiresAt: expiresAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user subscription.");

      setIsSubModalOpen(false);
      setSelectedUser(null);
      fetchProStats();
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to save subscription changes.");
    } finally {
      setSubSaving(false);
    }
  };

  const quickExtend30Days = async (user: any) => {
    try {
      const currentExp = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : new Date();
      const baseDate = currentExp.getTime() > Date.now() ? currentExp : new Date();
      baseDate.setDate(baseDate.getDate() + 30);

      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionPlan: "pro",
          subscriptionExpiresAt: baseDate.toISOString(),
        }),
      });

      if (res.ok) {
        fetchProStats();
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const revokeProStatus = async (user: any) => {
    if (!confirm(`Are you sure you want to revoke Pro access for ${user.fullName}? Account will revert to Freemium.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionPlan: "free",
        }),
      });

      if (res.ok) {
        fetchProStats();
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this account?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchProStats();
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = [
      "Full Name",
      "Email",
      "Role",
      "University",
      "Grad Year",
      "Subscription Status",
      "Expires At",
      "Paystack Customer Code",
      "Paystack Subscription Code",
      "Created At",
    ];

    const rows = users.map((u) => {
      const isExpired = u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt).getTime() < Date.now();
      const statusStr = isExpired ? "Expired Pro" : "Active Pro";

      return [
        `"${u.fullName}"`,
        `"${u.email}"`,
        `"${u.role}"`,
        `"${u.university || ""}"`,
        `"${u.gradYear || ""}"`,
        `"${statusStr}"`,
        `"${u.subscriptionExpiresAt ? new Date(u.subscriptionExpiresAt).toISOString() : "N/A"}"`,
        `"${u.paystackCustomerCode || ""}"`,
        `"${u.paystackSubscriptionCode || ""}"`,
        new Date(u.createdAt).toISOString(),
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `avero_pro_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pro User Accounts</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-extrabold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              Pro Directory
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            View all active and expired Pro subscribers, grant pass extensions, manage durations, and export records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Pro CSV</span>
          </button>
          <button
            onClick={() => {
              fetchProStats();
              fetchUsers();
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh Pro List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pro Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalProUsers ?? 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.proPercentage ?? 0}% of total user base
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Pro Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats?.activeProUsers ?? 0}</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Currently valid & unexpired
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expired Pro Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700">{stats?.expiredProUsers ?? 0}</div>
          <p className="text-[11px] text-rose-600 mt-1 font-medium">
            Requires renewal / extension
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total System Users</span>
            <div className="w-8 h-8 rounded-xl bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers ?? 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            All registered platform accounts
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Pro user by name, email, university..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Pro Status Filter:</span>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value as any);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="pro">All Pro Users</option>
              <option value="active_pro">Active Pro Subscriptions Only</option>
              <option value="expired_pro">Expired Pro Subscriptions Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pro Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm">Fetching Pro user records...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No Pro user accounts found matching your query filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Pro User & Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">University / School</th>
                    <th className="py-3.5 px-4">Membership Plan</th>
                    <th className="py-3.5 px-4">Expiration Date</th>
                    <th className="py-3.5 px-4">Paystack Refs</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => {
                    const isExpired = u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt).getTime() < Date.now();
                    const expiresFormatted = u.subscriptionExpiresAt
                      ? new Date(u.subscriptionExpiresAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Lifetime / No Exp";

                    // Calculate remaining days
                    let daysLeftStr = "";
                    if (u.subscriptionExpiresAt) {
                      const diffTime = new Date(u.subscriptionExpiresAt).getTime() - Date.now();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays < 0) {
                        daysLeftStr = `Expired ${Math.abs(diffDays)}d ago`;
                      } else if (diffDays === 0) {
                        daysLeftStr = "Expires today";
                      } else {
                        daysLeftStr = `${diffDays} days left`;
                      }
                    }

                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                            <span>{u.fullName}</span>
                          </div>
                          <div className="text-[11px] font-normal text-slate-500 pl-5">{u.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`capitalize px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === "admin"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : u.role === "educator"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {u.university || <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isExpired
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-800 border border-amber-300"
                            }`}
                          >
                            <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                            {isExpired ? "Pro (Expired)" : "Avero Pro Active"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{expiresFormatted}</span>
                            </div>
                            {daysLeftStr && (
                              <div
                                className={`text-[10px] font-bold ${
                                  isExpired ? "text-rose-600" : "text-emerald-600"
                                }`}
                              >
                                {daysLeftStr}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[10px] text-slate-500 font-mono">
                          {u.paystackCustomerCode || u.paystackSubscriptionCode ? (
                            <div>
                              {u.paystackCustomerCode && <div>CUS: {u.paystackCustomerCode}</div>}
                              {u.paystackSubscriptionCode && <div>SUB: {u.paystackSubscriptionCode}</div>}
                            </div>
                          ) : (
                            <span className="text-slate-400">Manual / Admin</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Manage Pro Modal */}
                            <button
                              onClick={() => openSubModal(u)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                              title="Manage Duration or Plan"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                              <span>Manage</span>
                            </button>

                            {/* Quick +30 Days Button */}
                            <button
                              onClick={() => quickExtend30Days(u)}
                              className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                              title="Quick Extend Pro membership by 30 Days"
                            >
                              <Clock className="w-3 h-3 text-emerald-600" />
                              <span>+30d</span>
                            </button>

                            {/* Revoke Pro */}
                            <button
                              onClick={() => revokeProStatus(u)}
                              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer shrink-0"
                              title="Revoke Pro & Downgrade to Freemium"
                            >
                              Revoke
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="bg-slate-50/70 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <span>
                  Showing <strong>{totalUsers === 0 ? 0 : (page - 1) * limit + 1}</strong> to{" "}
                  <strong>{Math.min(page * limit, totalUsers)}</strong> of <strong>{totalUsers}</strong> Pro users
                </span>

                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                  <span className="text-slate-500 font-semibold">Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs font-semibold focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 font-bold rounded-lg text-xs">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Grant / Manage Pro Membership Modal */}
      {isSubModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Manage Pro Subscription</h3>
                  <p className="text-xs text-slate-500">{selectedUser.fullName} ({selectedUser.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubscription} className="space-y-5 text-xs">
              {/* Plan Selection */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-xs">Select Plan Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSubForm({ ...subForm, plan: "pro" })}
                    className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      subForm.plan === "pro"
                        ? "border-[#2866e1] bg-blue-50/60 text-[#2866e1]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Avero Pro Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubForm({ ...subForm, plan: "free" })}
                    className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      subForm.plan === "free"
                        ? "border-slate-800 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>Freemium Plan</span>
                  </button>
                </div>
              </div>

              {/* Duration Selector (Only when Pro is selected) */}
              {subForm.plan === "pro" && (
                <div className="space-y-3 pt-2">
                  <label className="block text-slate-700 font-bold text-xs">Select Pro Membership Duration</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "1_month", label: "1 Month", desc: "30 Days" },
                      { id: "3_months", label: "3 Months", desc: "90 Days" },
                      { id: "6_months", label: "6 Months", desc: "180 Days" },
                      { id: "1_year", label: "1 Year", desc: "365 Days" },
                      { id: "lifetime", label: "Lifetime Access", desc: "Unlimited" },
                      { id: "custom", label: "Custom Date", desc: "Pick Date" },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSubForm({ ...subForm, durationPreset: preset.id as any })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          subForm.durationPreset === preset.id
                            ? "border-[#2866e1] bg-[#2866e1]/10 text-[#2866e1] font-extrabold"
                            : "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 font-semibold"
                        }`}
                      >
                        <div className="text-xs">{preset.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{preset.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Input */}
                  {subForm.durationPreset === "custom" && (
                    <div className="pt-2">
                      <label className="block text-slate-700 font-semibold mb-1">Select Custom Expiration Date</label>
                      <input
                        type="date"
                        required
                        value={subForm.customDate}
                        onChange={(e) => setSubForm({ ...subForm, customDate: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2866e1] font-mono text-xs"
                      />
                    </div>
                  )}

                  {/* Expiration Preview */}
                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Expiration: <strong>
                        {calculateExpirationDate()
                          ? new Date(calculateExpirationDate()!).toLocaleDateString("en-NG", {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No Expiration Date Set"}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subSaving}
                  className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md flex items-center gap-2 transition cursor-pointer"
                >
                  {subSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Save Subscription Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
