"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  RefreshCw,
  Bell,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success" | "urgent">("info");
  const [targetRole, setTargetRole] = useState<"all" | "student" | "educator">("all");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setMessage("");
    setType("info");
    setTargetRole("all");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setMessage(item.message || "");
    setType(item.type || "info");
    setTargetRole(item.targetRole || "all");
    setIsActive(item.isActive ?? true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required.");
      return;
    }

    setSaving(true);
    try {
      const url = editingItem
        ? `/api/admin/announcements/${editingItem._id}`
        : "/api/admin/announcements";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type, targetRole, isActive }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save announcement");

      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/announcements/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement banner?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[#2866e1]" /> Platform Announcements & System Banners
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Broadcast announcement alerts and exam updates to candidate and student dashboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnnouncements}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-[#2866e1]/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Banner Alert</span>
          </button>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm font-semibold">Loading system announcements...</span>
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
            <Bell className="w-10 h-10 text-slate-400" />
            <div>No announcement banners created yet. Click "Create Banner Alert" to post one.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Banner Type</th>
                  <th className="py-3.5 px-4">Title & Message</th>
                  <th className="py-3.5 px-4">Target Audience</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {announcements.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.type === "urgent"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.type === "warning"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {item.type === "urgent" && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {item.type === "warning" && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {item.type === "success" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.type === "info" && <Info className="w-3 h-3 text-sky-600" />}
                        <span>{item.type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.message}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                        {item.targetRole}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                        <span>{item.isActive ? "Active (Live)" : "Disabled"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                          title="Edit Announcement"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                          title="Delete Announcement"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItem ? "Edit Announcement Banner" : "Create New Announcement Banner"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New NCLEX-RN Pharmacology Past Questions Available"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-[#2866e1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Announcement Message *</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Broadcast message details for candidates..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Alert Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="urgent">Urgent Alert (Red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e: any) => setTargetRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="all">All Users</option>
                    <option value="student">Students / Candidates</option>
                    <option value="educator">Educators</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Active Status</label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                >
                  <option value="true">Active (Visible on Dashboard)</option>
                  <option value="false">Disabled (Hidden)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Save Changes" : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
