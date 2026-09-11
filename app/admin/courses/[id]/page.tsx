"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Check,
  Download,
  FileSpreadsheet,
  FileJson,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { exportQuestionBankCSV, exportCoursesJSON } from "@/lib/exportUtils";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Course State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [status, setStatus] = useState<"Draft" | "Published" | "Archived">("Draft");

  // Exam Engine Settings
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [passingScorePercentage, setPassingScorePercentage] = useState(75);
  const [allowedModes, setAllowedModes] = useState<("Practice" | "Exam")[]>(["Practice", "Exam"]);

  // Freemium Access Controls
  const [isFreeAccess, setIsFreeAccess] = useState(true);
  const [freeQuestionLimit, setFreeQuestionLimit] = useState(5);

  // Modules & Questions
  const [modules, setModules] = useState<
    { title: string; content: string; order: number; estimatedMinutes: number }[]
  >([]);

  const [questions, setQuestions] = useState<
    {
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
      questionType?: "standard" | "practical";
      practicalTitle?: string;
      flashcardImageUrl?: string;
      markingSchemeImageUrl?: string;
    }[]
  >([]);

  const scrollToTop = () => {
    const main = document.querySelector("main");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    const main = document.querySelector("main");
    if (main) main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleExportCSV = () => {
    const currentCourse = {
      _id: id,
      title: title || "Untitled Course",
      slug,
      category: selectedCategory?.name || "Uncategorized",
      subcategoryName,
      description,
      level,
      status,
      timeLimitMinutes,
      passingScorePercentage,
      allowedModes,
      modules,
      questions,
      createdAt: new Date().toISOString(),
    };
    exportQuestionBankCSV([currentCourse]);
  };

  const handleExportJSON = () => {
    const currentCourse = {
      _id: id,
      title: title || "Untitled Course",
      slug,
      category: selectedCategory?.name || "Uncategorized",
      subcategoryName,
      description,
      level,
      status,
      timeLimitMinutes,
      passingScorePercentage,
      allowedModes,
      modules,
      questions,
      createdAt: new Date().toISOString(),
    };
    exportCoursesJSON([currentCourse]);
  };

  useEffect(() => {
    // Fetch categories
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories || []);
      });

    // Fetch course details
    fetch(`/api/admin/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.course) {
          const c = data.course;
          setTitle(c.title || "");
          setSlug(c.slug || "");
          setCategoryId(c.categoryId?._id || c.categoryId || "");
          setSubcategoryName(c.subcategoryName || "");
          setDescription(c.description || "");
          setThumbnail(c.thumbnail || "");
          setLevel(c.level || "Intermediate");
          setStatus(c.status || "Draft");
          setTimeLimitMinutes(typeof c.timeLimitMinutes === "number" ? c.timeLimitMinutes : 60);
          setPassingScorePercentage(typeof c.passingScorePercentage === "number" ? c.passingScorePercentage : 75);
          setAllowedModes(Array.isArray(c.allowedModes) && c.allowedModes.length > 0 ? c.allowedModes : ["Practice", "Exam"]);
          setModules(Array.isArray(c.modules) ? c.modules : []);
          setQuestions(Array.isArray(c.questions) ? c.questions : []);
          if (typeof c.isFreeAccess !== "undefined") setIsFreeAccess(Boolean(c.isFreeAccess));
          if (typeof c.freeQuestionLimit === "number") setFreeQuestionLimit(c.freeQuestionLimit);
        }
      })
      .catch((err) => console.error("Failed to load course", err))
      .finally(() => setLoading(false));
  }, [id]);

  const selectedCategory = categories.find((c) => c._id === categoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
    setSlug(autoSlug);
  };

  // Questions handlers
  const addQuestion = (type: "standard" | "practical" = "standard") => {
    setQuestions((prev) => [
      ...prev,
      {
        question: `Question ${prev.length + 1}: Enter question text...`,
        options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
        correctAnswer: "A. Option 1",
        explanation: "Clinical rationale explaining why this option is correct.",
        questionType: type,
        practicalTitle: type === "practical" ? "Bed Making Procedure" : "",
        flashcardImageUrl: "",
        markingSchemeImageUrl: "",
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateQuestionOption = (qIndex: number, optIndex: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOpts = [...q.options];
        const oldVal = newOpts[optIndex];
        newOpts[optIndex] = val;
        let newCorrect = q.correctAnswer;
        if (q.correctAnswer === oldVal) {
          newCorrect = val;
        }
        return { ...q, options: newOpts, correctAnswer: newCorrect };
      })
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    setQuestions((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;
    setQuestions((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  // Modules handlers
  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: New Topic`,
        content: "Lesson content details...",
        order: prev.length + 1,
        estimatedMinutes: 15,
      },
    ]);
  };

  const updateModule = (index: number, field: string, value: any) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const moveModuleUp = (index: number) => {
    if (index === 0) return;
    setModules((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated.map((m, i) => ({ ...m, order: i + 1 }));
    });
  };

  const moveModuleDown = (index: number) => {
    if (index === modules.length - 1) return;
    setModules((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated.map((m, i) => ({ ...m, order: i + 1 }));
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId || !description) {
      alert("Title, Category, and Description are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          categoryId,
          subcategoryName,
          description,
          thumbnail,
          level,
          status,
          timeLimitMinutes,
          passingScorePercentage,
          allowedModes,
          modules,
          questions,
          isFreeAccess,
          freeQuestionLimit,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save course changes");

      router.push("/admin/courses");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#2866e1]" />
        <span className="text-sm font-semibold">Loading course and questions repository...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in max-w-5xl mx-auto pb-16 overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push("/admin/courses")}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Courses & Question Banks</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Edit Course ID: #{id.slice(-6)}
        </span>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#2866e1] shrink-0" />
            <span>Edit Course & Past Question Bank</span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="Export Test Bank with Exact Rationales to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="Export Full Course JSON Package"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Course Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-[#2866e1]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryName("");
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Subcategory (Optional)</label>
            <select
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            >
              <option value="">None (Whole Category)</option>
              {availableSubcategories.map((sub: any, idx: number) => {
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
              value={level}
              onChange={(e: any) => setLevel(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Publish Status</label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              <option value="Draft">Draft (Hidden)</option>
              <option value="Published">Published (Live for Student Testing)</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Exam Timer */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Exam Time Limit (Minutes)</label>
            <input
              type="number"
              min={5}
              max={360}
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value, 10) || 60)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            />
          </div>

          {/* Passing Threshold */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Passing Threshold Score (%)</label>
            <input
              type="number"
              min={10}
              max={100}
              value={passingScorePercentage}
              onChange={(e) => setPassingScorePercentage(parseInt(e.target.value, 10) || 75)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            />
          </div>

          {/* Allowed Testing Modes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Allowed Candidate Testing Modes</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 text-xs">
                <input
                  type="checkbox"
                  checked={allowedModes.includes("Practice")}
                  onChange={(e) => {
                    if (e.target.checked) setAllowedModes((prev) => [...prev, "Practice"]);
                    else setAllowedModes((prev) => prev.filter((m) => m !== "Practice"));
                  }}
                  className="w-4 h-4 text-[#2866e1] rounded border-slate-300"
                />
                Practice (Instant Rationales)
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 text-xs">
                <input
                  type="checkbox"
                  checked={allowedModes.includes("Exam")}
                  onChange={(e) => {
                    if (e.target.checked) setAllowedModes((prev) => [...prev, "Exam"]);
                    else setAllowedModes((prev) => prev.filter((m) => m !== "Exam"));
                  }}
                  className="w-4 h-4 text-[#2866e1] rounded border-slate-300"
                />
                Exam Simulation (Timed)
              </label>
            </div>
          </div>

          {/* Freemium Access & Question Limit Controls */}
          <div className="sm:col-span-2 p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  🔒 Freemium Student Access Controls
                </h4>
                <p className="text-[11px] text-slate-500">
                  Control whether free users can practice this course and how many questions they can view before being prompted to upgrade to Pro.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 border border-blue-200 rounded-xl">
                <input
                  type="checkbox"
                  checked={isFreeAccess}
                  onChange={(e) => setIsFreeAccess(e.target.checked)}
                  className="w-4 h-4 text-[#2866e1] rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">Allow Free Access</span>
              </label>
            </div>

            {isFreeAccess && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Free Student Question Limit
                </label>
                <input
                  type="number"
                  min={0}
                  max={questions.length || 500}
                  value={freeQuestionLimit}
                  onChange={(e) => setFreeQuestionLimit(parseInt(e.target.value, 10) || 0)}
                  className="w-full max-w-xs p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Free users will be able to solve up to <strong className="text-slate-900">{freeQuestionLimit} questions</strong> in this course. Question #{freeQuestionLimit + 1} onwards will require a Pro membership.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs">
          <label className="block text-slate-700 font-semibold mb-1">Description / Overview *</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div className="text-xs">
          <label className="block text-slate-700 font-semibold mb-2">Cover Thumbnail Image (UploadThing)</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail" className="w-20 h-16 rounded-lg object-cover border border-slate-200 shrink-0" />
            ) : (
              <div className="w-20 h-16 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 w-full max-w-full overflow-hidden">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setThumbnail(res[0].ufsUrl || res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Image upload error: ${error.message}`);
                }}
                appearance={{
                  button: "bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800 py-2 px-4 rounded-lg border border-slate-300 cursor-pointer max-w-full truncate",
                }}
              />
            </div>
          </div>
        </div>

        {/* PAST QUESTIONS EDITOR SECTION */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Questions Bank ({questions.length} Questions)</span>
              </h3>
              <p className="text-xs text-slate-500">View, edit, add options, and update rationales for test items.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addQuestion("standard")}
                className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" /> Add Standard Question
              </button>
              <button
                type="button"
                onClick={() => addQuestion("practical")}
                className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" /> Add Practical Module
              </button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs">
              No questions found in this question bank. Click "Add Standard Question" or "Add Practical Module" above to create one.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className={`p-4 sm:p-5 border rounded-xl space-y-4 shadow-xs overflow-hidden ${q.questionType === "practical" ? "bg-indigo-50/40 border-indigo-200" : "bg-slate-50/80 border-slate-200"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${q.questionType === "practical" ? "text-indigo-700" : "text-emerald-700"}`}>
                        Question #{qIdx + 1}
                      </span>
                      <select
                        value={q.questionType || "standard"}
                        onChange={(e) => updateQuestion(qIdx, "questionType", e.target.value)}
                        className="text-xs font-bold px-2 py-1 bg-white border border-slate-300 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="standard">Standard MCQ</option>
                        <option value="practical">Practical Module</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuestionUp(qIdx)}
                        disabled={qIdx === 0}
                        className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Question Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestionDown(qIdx)}
                        disabled={qIdx === questions.length - 1}
                        className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Question Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {q.questionType === "practical" && (
                    <div className="p-4 bg-white border border-indigo-100 rounded-xl space-y-4">
                      <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Practical Module Setup (Flashcard, Markings & Question OCR)
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Practical Procedure Title</label>
                        <input
                          type="text"
                          value={q.practicalTitle || ""}
                          onChange={(e) => updateQuestion(qIdx, "practicalTitle", e.target.value)}
                          placeholder="e.g. Bed Making Procedure, Sterile Dressing Change"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Field 1: Practical Flashcard Image */}
                        <div className="p-3 bg-indigo-50/50 border border-indigo-200/60 rounded-xl space-y-2">
                          <label className="block text-xs font-bold text-indigo-900">
                            Field 1: Flashcard Explanatory Image (Purpose, Equipment, Steps)
                          </label>
                          {q.flashcardImageUrl ? (
                            <div className="relative group">
                              <img src={q.flashcardImageUrl} alt="Flashcard Image" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                              <button
                                type="button"
                                onClick={() => updateQuestion(qIdx, "flashcardImageUrl", "")}
                                className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-md text-[10px] font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                  updateQuestion(qIdx, "flashcardImageUrl", res[0].ufsUrl || res[0].url);
                                }
                              }}
                              onUploadError={(err) => alert(`Upload Error: ${err.message}`)}
                              appearance={{
                                button: "bg-indigo-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer w-full",
                              }}
                            />
                          )}
                        </div>

                        {/* Field 2: Markings Allocation Image */}
                        <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2">
                          <label className="block text-xs font-bold text-amber-900">
                            Field 2: Markings Allocation / Rubric Sheet Image
                          </label>
                          {q.markingSchemeImageUrl ? (
                            <div className="relative group">
                              <img src={q.markingSchemeImageUrl} alt="Marking Scheme" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                              <button
                                type="button"
                                onClick={() => updateQuestion(qIdx, "markingSchemeImageUrl", "")}
                                className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-md text-[10px] font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                  updateQuestion(qIdx, "markingSchemeImageUrl", res[0].ufsUrl || res[0].url);
                                }
                              }}
                              onUploadError={(err) => alert(`Upload Error: ${err.message}`)}
                              appearance={{
                                button: "bg-amber-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer w-full",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                      placeholder="Enter question statement..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  {/* Multiple Choice Options */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Options & Select Correct Answer</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 bg-white border rounded-lg ${
                            q.correctAnswer === opt ? "border-emerald-500/80 bg-emerald-50/60" : "border-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={q.correctAnswer === opt}
                            onChange={() => updateQuestion(qIdx, "correctAnswer", opt)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateQuestionOption(qIdx, optIdx, e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-900 outline-none font-medium"
                          />
                          {q.correctAnswer === opt && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold shrink-0">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation / Rationale */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Clinical Rationale / Explanation</label>
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                      placeholder="Explain why the selected option is correct..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 italic"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LESSON MODULES EDITOR SECTION */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2866e1] shrink-0" />
                <span>Lesson Modules ({modules.length} Modules)</span>
              </h3>
              <p className="text-xs text-slate-500">Edit course lessons and topic summaries.</p>
            </div>
            <button
              type="button"
              onClick={addModule}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" /> Add Module
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((m, index) => (
              <div key={index} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#2866e1] uppercase tracking-wider">
                    Lesson {index + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveModuleUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Module Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveModuleDown(index)}
                      disabled={index === modules.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Module Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer"
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      required
                      value={m.title}
                      onChange={(e) => updateModule(index, "title", e.target.value)}
                      placeholder="Module Title"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={m.estimatedMinutes || 15}
                      onChange={(e) => updateModule(index, "estimatedMinutes", parseInt(e.target.value, 10) || 15)}
                      placeholder="Est. Minutes"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <textarea
                  rows={3}
                  required
                  value={m.content}
                  onChange={(e) => updateModule(index, "content", e.target.value)}
                  placeholder="Module lesson content (Markdown supported)..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/courses")}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2866e1]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Save Course & Questions</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Floating Page Navigation & Quick Save Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl text-white">
        <button
          type="button"
          onClick={scrollToTop}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition cursor-pointer"
          title="Scroll to Bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-slate-700 mx-1" />
        <button
          type="button"
          onClick={(e) => handleSave(e)}
          disabled={saving}
          className="px-4 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>Save Course</span>
        </button>
      </div>
    </div>
  );
}
