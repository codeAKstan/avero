"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  Filter,
  Loader2,
  FolderTree,
  Download,
} from "lucide-react";
import { exportCoursesSummaryCSV } from "@/lib/exportUtils";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedLevel) params.set("level", selectedLevel);

      const res = await fetch(`/api/user/courses?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setCourses(data.courses || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error loading student courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Courses & Practice Test Banks
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Browse published medical & nursing test banks, complete practice sessions, and build board-exam readiness.
          </p>
        </div>

        {courses.length > 0 && (
          <button
            type="button"
            onClick={() => exportCoursesSummaryCSV(courses, "avero_student_course_catalog")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Catalog (CSV)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course title or keyword (e.g. Pharmacology, NCLEX...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Search Test Banks
          </button>
        </form>

        {/* Category Tabs & Filter Controls */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between gap-3">
            {/* Single-line Horizontal Scrollable Pill Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                  selectedCategory === ""
                    ? "bg-[#2866e1] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                    selectedCategory === cat._id
                      ? "bg-[#2866e1] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="hidden md:block bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer shrink-0"
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Level Filter - Commented out for users per request
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          */}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-16 flex justify-center items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
          <span className="text-sm">Loading course test banks...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 text-sm">
          No courses found matching your criteria. Try adjusting filters or search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20 font-bold text-[10px]">
                    {course.categoryId?.name || "General Nursing"}
                  </span>
                  {/* <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {course.level}
                  </span> */}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-2">
                  {course.title}
                </h3>
                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-6">
                  {course.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <div className="text-slate-400 font-semibold text-[9px] uppercase">Questions</div>
                    <div className="font-bold text-slate-900">{course.questions?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-semibold text-[9px] uppercase">Time Limit</div>
                    <div className="font-bold text-slate-900">{course.timeLimitMinutes || 60} min</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-semibold text-[9px] uppercase">Pass Rate</div>
                    <div className="font-bold text-emerald-600">{course.passingScorePercentage || 75}%</div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/courses/${course._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Practice / Take Exam</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
