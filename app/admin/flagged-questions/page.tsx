"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flag,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  User,
  BookOpen,
  X,
  ExternalLink,
  ChevronDown,
  Check,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface IFlaggedQuestion {
  _id: string;
  userId?: {
    _id: string;
    fullName?: string;
    email?: string;
    role?: string;
    university?: string;
  } | null;
  userName?: string;
  userEmail?: string;
  courseId?: {
    _id: string;
    title: string;
  } | null;
  courseTitle?: string;
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  reason: string;
  details?: string;
  status: "Pending" | "Reviewed" | "Resolved" | "Dismissed";
  adminNotes?: string;
  createdAt: string;
}

export default function AdminFlaggedQuestionsPage() {
  const [flags, setFlags] = useState<IFlaggedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0,
    dismissed: 0,
  });

  // Edit Question Modal State
  const [editingFlag, setEditingFlag] = useState<IFlaggedQuestion | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptions, setEditOptions] = useState<string[]>([]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState("");
  const [editExplanation, setEditExplanation] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Status Note Modal State
  const [statusModalFlag, setStatusModalFlag] = useState<IFlaggedQuestion | null>(null);
  const [targetStatus, setTargetStatus] = useState<"Pending" | "Reviewed" | "Resolved" | "Dismissed">("Pending");
  const [statusAdminNotes, setStatusAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/flagged-questions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFlags(data.flags || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching flagged questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [search, statusFilter]);

  const handleOpenEditModal = (flag: IFlaggedQuestion) => {
    setEditingFlag(flag);
    setEditQuestionText(flag.questionText);
    setEditOptions(flag.options?.length ? [...flag.options] : ["", "", "", ""]);
    setEditCorrectAnswer(flag.correctAnswer);
    setEditExplanation(flag.explanation || "");
    setEditAdminNotes(flag.adminNotes || "");
  };

  const handleSaveQuestionEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlag) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/flagged-questions/${editingFlag._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: editQuestionText,
          options: editOptions.filter((o) => o.trim() !== ""),
          correctAnswer: editCorrectAnswer,
          explanation: editExplanation,
          adminNotes: editAdminNotes,
          status: "Resolved",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update question");

      setEditingFlag(null);
      fetchFlags();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModalFlag) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/flagged-questions/${statusModalFlag._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          adminNotes: statusAdminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setStatusModalFlag(null);
      fetchFlags();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteFlag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flag record?")) return;
    try {
      const res = await fetch(`/api/admin/flagged-questions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchFlags();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...editOptions];
    updated[idx] = val;
    setEditOptions(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Flag className="w-6 h-6 text-amber-500 fill-amber-100" /> Flagged Questions & Reports
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Review questions flagged by students during practice runs or mock exams, correct errors, and update test banks.
          </p>
        </div>

        <button
          onClick={fetchFlags}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Flags</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#2866e1]/10 border-[#2866e1]/40 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Flagged</div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">All reported issues</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Pending")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Pending"
              ? "bg-amber-100/70 border-amber-300 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-amber-300"
          }`}
        >
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
          </div>
          <div className="text-2xl font-extrabold text-amber-900">{stats.pending}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Needs review</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Reviewed")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Reviewed"
              ? "bg-blue-100/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-blue-300"
          }`}
        >
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Reviewed
          </div>
          <div className="text-2xl font-extrabold text-blue-900">{stats.reviewed}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Under investigation</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Resolved")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Resolved"
              ? "bg-emerald-100/70 border-emerald-300 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-emerald-300"
          }`}
        >
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </div>
          <div className="text-2xl font-extrabold text-emerald-900">{stats.resolved}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Updated & corrected</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Dismissed")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Dismissed"
              ? "bg-slate-100 border-slate-300 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Dismissed
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{stats.dismissed}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">No action required</div>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by question, student name/email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
          {["all", "Pending", "Reviewed", "Resolved", "Dismissed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer capitalize ${
                statusFilter === st
                  ? "bg-[#2866e1] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Flagged Questions List / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
          <span className="text-sm">Fetching flagged question records...</span>
        </div>
      ) : flags.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-3 shadow-xs">
          <Flag className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-800">No flagged questions found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "No flagged questions match your current search or status filters."
              : "Students have not flagged any questions yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => {
            const studentName = flag.userId?.fullName || flag.userName || "Student";
            const studentEmail = flag.userId?.email || flag.userEmail || "N/A";
            const courseTitle = flag.courseId?.title || flag.courseTitle || "General Exam Bank";

            let statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
            if (flag.status === "Resolved") statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
            if (flag.status === "Reviewed") statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
            if (flag.status === "Dismissed") statusBadge = "bg-slate-100 text-slate-600 border-slate-200";

            return (
              <div
                key={flag._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Top Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
                      <Flag className="w-4 h-4 fill-amber-500 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs md:text-sm">
                          {studentName}
                        </span>
                        <span className="text-[11px] text-slate-500">({studentEmail})</span>
                      </div>
                      <div className="text-[11px] text-[#2866e1] font-semibold flex items-center gap-1 mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        <span>{courseTitle}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-normal">
                          {new Date(flag.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge}`}>
                      {flag.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setStatusModalFlag(flag);
                        setTargetStatus(flag.status);
                        setStatusAdminNotes(flag.adminNotes || "");
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Status</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Question & Choices Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Question & Rationales */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                      {flag.questionText}
                    </div>

                    {flag.options && flag.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {flag.options.map((opt, oIdx) => {
                          const isCorrect = opt === flag.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                                isCorrect
                                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold"
                                  : "bg-slate-50 border-slate-200 text-slate-700"
                              }`}
                            >
                              <span className="truncate">{opt}</span>
                              {isCorrect && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold shrink-0 ml-2">
                                  Correct Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {flag.explanation && (
                      <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-[#2866e1] block">Verbatim Explanation / Rationale:</span>
                        <p className="text-slate-600 leading-relaxed">{flag.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Flag details & Action Panel */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 flex flex-col justify-between text-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">
                          Flag Reason
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-200 inline-block">
                          {flag.reason}
                        </span>
                      </div>

                      {flag.details && (
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">
                            Student Comment / Details
                          </span>
                          <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                            "{flag.details}"
                          </p>
                        </div>
                      )}

                      {flag.adminNotes && (
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">
                            Admin Notes
                          </span>
                          <p className="text-slate-700 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-[11px]">
                            {flag.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(flag)}
                        className="flex-1 py-2 px-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Quick Edit Question</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFlag(flag._id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition cursor-pointer"
                        title="Delete Flag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Question Modal */}
      {editingFlag && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Quick Edit Question & Resolve Flag</h3>
                <p className="text-xs text-slate-500">
                  Modifying this question will update the live test bank in the Course and resolve this flag.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingFlag(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Question Text *</label>
                <textarea
                  rows={3}
                  required
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#2866e1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Choice Options (A - D)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#2866e1]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Correct Answer *</label>
                <select
                  value={editCorrectAnswer}
                  onChange={(e) => setEditCorrectAnswer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {editOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {String.fromCharCode(65 + idx)}: {opt || `Option ${String.fromCharCode(65 + idx)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Explanation / Clinical Rationale</label>
                <textarea
                  rows={3}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#2866e1]"
                  placeholder="Explain why this choice is correct..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Notes / Resolution Summary</label>
                <input
                  type="text"
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="e.g. Corrected typo in option B and updated answer key."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFlag(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{savingEdit ? "Saving Changes..." : "Save & Resolve Flag"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalFlag && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Update Flag Status</h3>
              <button
                type="button"
                onClick={() => setStatusModalFlag(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="Pending">Pending (Needs Review)</option>
                  <option value="Reviewed">Reviewed (Under Investigation)</option>
                  <option value="Resolved">Resolved (Fixed & Verified)</option>
                  <option value="Dismissed">Dismissed (Invalid / No Change Needed)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Notes</label>
                <textarea
                  rows={3}
                  value={statusAdminNotes}
                  onChange={(e) => setStatusAdminNotes(e.target.value)}
                  placeholder="Add optional notes for your team..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalFlag(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="px-5 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{updatingStatus ? "Updating..." : "Update Status"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
