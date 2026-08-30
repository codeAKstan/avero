"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  FolderTree,
  X,
} from "lucide-react";

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLevel, setEditLevel] = useState("Intermediate");
  const [editStatus, setEditStatus] = useState("Draft");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        categoryId: categoryFilter,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/courses?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [search, categoryFilter, statusFilter]);

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setEditTitle(course.title || "");
    setEditCategoryId(course.categoryId?._id || course.categoryId || "");
    setEditSubcategoryName(course.subcategoryName || "");
    setEditDescription(course.description || "");
    setEditLevel(course.level || "Intermediate");
    setEditStatus(course.status || "Draft");
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/courses/${editingCourse._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          categoryId: editCategoryId,
          subcategoryName: editSubcategoryName,
          description: editDescription,
          level: editLevel,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update course");

      setIsEditModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleStatus = async (course: any) => {
    const nextStatus = course.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course and all its questions/modules?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCategoryForEdit = categories.find((c) => c._id === editCategoryId);
  const availableSubcategoriesForEdit = selectedCategoryForEdit?.subcategories || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#2866e1]" /> Course & Question Bank Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">View, edit, publish, or convert past question documents into testing modules.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/new"
            className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-[#2866e1]/20 transition cursor-pointer"
          >
            <span>Create Course (OCR AI or Manual)</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FolderTree className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <button
            onClick={fetchCourses}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm">Fetching course repository...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-slate-400" />
            <div>No courses found matching criteria.</div>
            <Link
              href="/admin/courses/new"
              className="px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Course & Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Questions / Modules</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm hover:text-[#2866e1] transition">
                            {course.title}
                          </div>
                          <div className="text-[11px] text-[#2866e1] font-semibold flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span>{course.categoryId?.name || "Uncategorized"}</span>
                            {(course.subcategoryName || course.subcategoryId?.name) && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20 font-bold">
                                Sub: {course.subcategoryName || course.subcategoryId?.name}
                              </span>
                            )}
                            {course.sourceDocumentUrl && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                                OCR Derived
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      <div>{course.questions?.length || 0} Questions</div>
                      <div className="text-[11px] text-slate-400 font-normal">{course.modules?.length || 0} Modules</div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(course)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          course.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {course.status === "Published" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{course.status}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course._id}`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                          title="Edit Course & All Questions"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                          title="Delete Course"
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

      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Course / Question Bank</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-[#2866e1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => {
                    setEditCategoryId(e.target.value);
                    setEditSubcategoryName("");
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subcategory</label>
                <select
                  value={editSubcategoryName}
                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="">None (Whole Category)</option>
                  {availableSubcategoriesForEdit.map((sub: any, idx: number) => {
                    const subName = typeof sub === "string" ? sub : sub.name;
                    return (
                      <option key={idx} value={subName}>
                        {subName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Difficulty Level</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Publish Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                >
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Published">Published (Live for Student Testing)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
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
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
