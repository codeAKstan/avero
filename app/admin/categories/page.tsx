"use client";

import React, { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  RefreshCw,
  BookOpen,
  Tag,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubInput, setNewSubInput] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("BookOpen");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setSubcategories([]);
    setNewSubInput("");
    setDescription("");
    setIcon("BookOpen");
    setOrder(categories.length * 10);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setSubcategories(
      Array.isArray(cat.subcategories)
        ? cat.subcategories.map((s: any) => (typeof s === "string" ? s : s.name))
        : []
    );
    setNewSubInput("");
    setDescription(cat.description || "");
    setIcon(cat.icon || "BookOpen");
    setOrder(cat.order || 0);
    setIsActive(cat.isActive ?? true);
    setIsModalOpen(true);
  };

  const handleAddSubcategory = () => {
    const trimmed = newSubInput.trim();
    if (!trimmed) return;
    if (subcategories.includes(trimmed)) {
      setNewSubInput("");
      return;
    }
    setSubcategories((prev) => [...prev, trimmed]);
    setNewSubInput("");
  };

  const handleRemoveSubcategory = (indexToRemove: number) => {
    setSubcategories((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Category Name is required.");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        subcategories: subcategories.map((s) => ({
          name: s,
          slug: s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
        })),
        description: description.trim(),
        icon,
        order,
        isActive,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (cat: any) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (res.ok) fetchCategories();
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
            <FolderTree className="w-6 h-6 text-[#2866e1]" /> Course Categories & Subcategories
          </h1>
          <p className="text-sm text-slate-500">Organize online courses into categories and subcategory tracks.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-[#2866e1]/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm">Loading course categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No course categories created yet. Click "Create Category" to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Icon</th>
                  <th className="py-3.5 px-4">Category Name & Slug</th>
                  <th className="py-3.5 px-4">Subcategories</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4">
                      {cat.icon?.startsWith("http") ? (
                        <img src={cat.icon} alt={cat.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] flex items-center justify-center font-bold">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>{cat.name}</div>
                      <div className="text-[11px] font-normal text-[#2866e1]">/{cat.slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {cat.subcategories.map((sub: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-full bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20 text-[10px] font-semibold flex items-center gap-1"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {typeof sub === "string" ? sub : sub.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No subcategories</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                      {cat.description || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-mono font-medium">
                      {cat.order}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                        <span>{cat.isActive ? "Active" : "Disabled"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                          title="Edit Category & Subcategories"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                          title="Delete Category"
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

      {/* Create/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Field 1: Category Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    const autoSlug = val.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
                    setSlug(autoSlug);
                  }}
                  placeholder="e.g. Pharmacology & Therapeutics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2866e1] font-semibold"
                />
              </div>

              {/* Field 2: Subcategories */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subcategories (Add Multiple)</label>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubInput}
                    onChange={(e) => setNewSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    placeholder="Type subcategory name (e.g. Cardiac Medications) and click Add..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2866e1]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shrink-0 flex items-center gap-1 transition cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] rounded-full text-xs font-bold flex items-center gap-1.5"
                      >
                        <Tag className="w-3 h-3 text-[#2866e1]" />
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(idx)}
                          className="hover:text-rose-600 text-slate-400 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No subcategories added yet. Type a subcategory name above and click Add.</p>
                )}
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="pharmacology-therapeutics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of topics covered in this track..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* UploadThing Badge */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Category Badge / Icon (UploadThing)</label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200 rounded-xl">
                  {icon?.startsWith("http") ? (
                    <img src={icon} alt="Badge" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#2866e1]/10 border border-[#2866e1]/20 text-[#2866e1] flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setIcon(res[0].ufsUrl || res[0].url);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-300 cursor-pointer",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
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
                  className="px-5 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
