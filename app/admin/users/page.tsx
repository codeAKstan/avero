"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  MoreVertical,
  Ban,
  Check,
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        status: statusFilter,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

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
    const headers = ["Full Name", "Email", "Role", "University", "Grad Year", "Onboarded", "Suspended", "Created At"];
    const rows = users.map((u) => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.university || ""}"`,
      `"${u.gradYear || ""}"`,
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
          <p className="text-sm text-slate-500">Search, filter, assign roles, and manage student & educator accounts.</p>
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Full Name & Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">University / School</th>
                  <th className="py-3.5 px-4">Grad Year</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
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
                      <div className="flex items-center justify-end gap-2">
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
