"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Ban,
  Check,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Award,
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states for adding/editing
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student",
    university: "",
    gradYear: "",
    password: "",
  });

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        status: statusFilter,
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
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page, limit]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setIsAddModalOpen(false);
      setFormData({
        fullName: "",
        email: "",
        role: "student",
        university: "",
        gradYear: "",
        password: "",
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openSubModal = (user: any) => {
    setSelectedUser(user);
    const isProNow = user.subscriptionPlan === "pro" || user.isPro;
    
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
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to save subscription changes.");
    } finally {
      setSubSaving(false);
    }
  };

  const toggleSuspendUser = async (user: any) => {
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !user.isSuspended }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = ["Full Name", "Email", "Role", "University", "Grad Year", "Membership", "Expires At", "Onboarded", "Suspended", "Created At"];
    const rows = users.map((u) => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.university || ""}"`,
      `"${u.gradYear || ""}"`,
      `"${u.subscriptionPlan === "pro" ? "Pro" : "Freemium"}"`,
      `"${u.subscriptionExpiresAt ? new Date(u.subscriptionExpiresAt).toLocaleDateString() : "N/A"}"`,
      u.isOnboarded ? "Yes" : "No",
      u.isSuspended ? "Yes" : "No",
      new Date(u.createdAt).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `avero_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Account Management</h1>
          <p className="text-sm text-slate-500">Search, filter, assign roles, grant Pro memberships, and manage accounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setFormData({ fullName: "", email: "", role: "student", university: "", gradYear: "", password: "" });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-[#2866e1]/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User Account</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, university..."
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
            <span className="text-xs text-slate-500 font-semibold">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="educator">Educator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="all">All Statuses</option>
              <option value="onboarded">Onboarded</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button
            onClick={fetchUsers}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm">Fetching user records...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No user accounts found matching your query filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Full Name & Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">University / School</th>
                    <th className="py-3.5 px-4">Grad Year</th>
                    <th className="py-3.5 px-4">Membership</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => {
                    const isPro = u.subscriptionPlan === "pro";
                    const isExpired = isPro && u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt).getTime() < Date.now();
                    const expiresFormatted = u.subscriptionExpiresAt
                      ? new Date(u.subscriptionExpiresAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : null;

                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-4 font-bold text-slate-900">
                          <div>{u.fullName}</div>
                          <div className="text-[11px] font-normal text-slate-500">{u.email}</div>
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
                        <td className="py-4 px-4 text-slate-500">
                          {u.gradYear || <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-4 px-4">
                          {isPro ? (
                            <div className="space-y-0.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                isExpired
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-300"
                              }`}>
                                <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                                {isExpired ? "Pro (Expired)" : "Avero Pro"}
                              </span>
                              {expiresFormatted && (
                                <div className="text-[10px] text-slate-500 font-medium pl-1">
                                  Exp: {expiresFormatted}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                              Freemium
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {u.isSuspended ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <Ban className="w-3 h-3" /> Suspended
                            </span>
                          ) : u.isOnboarded ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Grant / Manage Pro Button */}
                            <button
                              onClick={() => openSubModal(u)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                              title="Manage Pro Membership & Duration"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                              <span>{isPro ? "Manage Pro" : "Grant Pro"}</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setFormData({
                                  fullName: u.fullName,
                                  email: u.email,
                                  role: u.role,
                                  university: u.university || "",
                                  gradYear: u.gradYear || "",
                                  password: "",
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                            >
                              Edit Role
                            </button>

                            <button
                              onClick={() => toggleSuspendUser(u)}
                              title={u.isSuspended ? "Activate User" : "Suspend User"}
                              className={`p-1.5 rounded-lg text-[11px] transition cursor-pointer ${
                                u.isSuspended
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                              }`}
                            >
                              {u.isSuspended ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                              title="Delete User"
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
                  <strong>{Math.min(page * limit, totalUsers)}</strong> of <strong>{totalUsers}</strong> users
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
                  <h3 className="text-lg font-bold text-slate-900">Manage Membership Plan</h3>
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New User Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                >
                  <option value="student">Student</option>
                  <option value="educator">Educator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">University / School (Optional)</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password (Required for Admin role)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set initial password..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit User Role & Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                >
                  <option value="student">Student</option>
                  <option value="educator">Educator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">University</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Enter new password if changing..."
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#2866e1]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
