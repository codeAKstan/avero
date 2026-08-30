"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Image as ImageIcon,
  FolderTree,
  Check,
} from "lucide-react";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";

export default function NewCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  // Workflow mode: "ocr" vs "manual"
  const [mode, setMode] = useState<"ocr" | "manual">("ocr");

  // Document Upload / OCR state
  const [uploadedDocUrl, setUploadedDocUrl] = useState("");
  const [uploadedDocName, setUploadedDocName] = useState("");
  const [rawTextInput, setRawTextInput] = useState("");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStage, setOcrStage] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  
  // Exam Engine Settings
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [passingScorePercentage, setPassingScorePercentage] = useState(75);
  const [allowedModes, setAllowedModes] = useState<("Practice" | "Exam")[]>(["Practice", "Exam"]);
  
  // Lesson Modules & Past Questions
  const [modules, setModules] = useState<
    { title: string; content: string; order: number; estimatedMinutes: number }[]
  >([
    { title: "Module 1: Introduction & Exam Topics Overview", content: "Overview of exam objectives...", order: 1, estimatedMinutes: 15 },
  ]);

  const [questions, setQuestions] = useState<
    { question: string; options: string[]; correctAnswer: string; explanation: string }[]
  >([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0]._id);
          }
        }
      });
  }, []);

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

  const handleRunOcr = async () => {
    if (!uploadedDocUrl && !rawTextInput.trim()) {
      alert("Please upload a document or paste text to convert.");
      return;
    }

    setIsOcrProcessing(true);
    setOcrStage("Connecting to Gemini 3.6 Flash AI Engine...");

    try {
      setOcrStage("Extracting Past Questions & Rationales...");
      const res = await fetch("/api/admin/courses/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentUrl: uploadedDocUrl,
          rawText: rawTextInput,
        }),
      });

      setOcrStage("Formatting Exam Question Bank...");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OCR AI Extraction failed");

      if (data.data) {
        const ocr = data.data;
        if (ocr.title) handleTitleChange(ocr.title);
        if (ocr.description) setDescription(ocr.description);
        if (ocr.level) setLevel(ocr.level);

        if (Array.isArray(ocr.modules) && ocr.modules.length > 0) {
          setModules(
            ocr.modules.map((m: any, idx: number) => ({
              title: m.title || `Module ${idx + 1}`,
              content: m.content || "",
              order: idx + 1,
              estimatedMinutes: m.estimatedMinutes || 15,
            }))
          );
        }

        if (Array.isArray(ocr.questions) && ocr.questions.length > 0) {
          setQuestions(
            ocr.questions.map((q: any) => ({
              question: q.question || "",
              options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
              correctAnswer: q.correctAnswer || (Array.isArray(q.options) ? q.options[0] : ""),
              explanation: q.explanation || "",
            }))
          );
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to process document with Gemini OCR.");
    } finally {
      setIsOcrProcessing(false);
      setOcrStage("");
    }
  };

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: New Topic`,
        content: "Module content details...",
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
    if (modules.length === 1) return;
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  // Past Questions handlers
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: `Question ${prev.length + 1}: Enter question prompt here...`,
        options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
        correctAnswer: "A. Option 1",
        explanation: "Rationale explaining why this option is correct.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId || !description) {
      alert("Title, Category, and Description are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          categoryId,
          subcategoryName: subcategoryName || "",
          description,
          thumbnail,
          level,
          status,
          timeLimitMinutes,
          passingScorePercentage,
          allowedModes,
          modules,
          questions,
          sourceDocumentUrl: uploadedDocUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create course / question bank");

      router.push("/admin/courses");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses & Question Banks
        </button>

        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setMode("ocr")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === "ocr"
                ? "bg-[#2866e1] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>OCR AI Document Converter</span>
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === "manual"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* OCR AI Document Upload Panel */}
      {mode === "ocr" && (
        <div className="bg-white border border-[#2866e1]/20 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-[#2866e1] font-extrabold text-xs mb-2">
            <Sparkles className="w-4 h-4" />
            <span>GEMINI 3.6 FLASH OCR — PAST QUESTION CONVERTER</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Upload Past Question Papers for OCR AI Parsing
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl mb-6">
            Upload scanned past exam documents, PDF question banks, or images. Gemini AI will convert questions, multiple-choice options (A/B/C/D), correct answers, and clinical rationales for your review.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UploadThing Document Dropzone */}
            <div className="bg-[#f5f8ff] border border-slate-200/80 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-700 mb-3">Option A: Upload File (PDF / Image)</span>
              
              <UploadDropzone
                endpoint="documentUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setUploadedDocUrl(res[0].ufsUrl || res[0].url);
                    setUploadedDocName(res[0].name);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload Error: ${error.message}`);
                }}
                appearance={{
                  container: "border-dashed border-slate-300 hover:border-[#2866e1] bg-white p-6 rounded-xl w-full shadow-xs",
                  label: "text-xs text-[#2866e1] font-bold",
                  button: "bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer",
                }}
              />

              {uploadedDocName && (
                <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Uploaded: {uploadedDocName}</span>
                </div>
              )}
            </div>

            {/* Option B: Raw Text Paste */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 mb-2">Option B: Paste Raw Text / Past Questions</span>
              <textarea
                rows={6}
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="Paste past exam questions, options, or test items..."
                className="w-full flex-1 p-3 bg-[#f5f8ff] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleRunOcr}
              disabled={isOcrProcessing || (!uploadedDocUrl && !rawTextInput.trim())}
              className="px-6 py-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#2866e1]/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isOcrProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{ocrStage || "Gemini AI Converting Past Questions..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert Past Questions with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Course & Question Bank Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <BookOpen className="w-5 h-5 text-[#2866e1]" /> Exam / Course Metadata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Course / Exam Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. NCLEX-RN Pharmacology Past Questions 2026"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="nclex-rn-pharmacology-past-questions-2026"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          {/* Category Dropdown */}
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

          {/* Subcategory Dropdown */}
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

          {/* Difficulty Level */}
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
            <div className="flex items-center gap-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
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

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
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
        </div>

        {/* Description */}
        <div className="text-xs">
          <label className="block text-slate-700 font-semibold mb-1">Description / Exam Overview *</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive overview of exam questions and practice objectives..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div className="text-xs">
          <label className="block text-slate-700 font-semibold mb-2">Exam Cover Image / Thumbnail (UploadThing)</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail" className="w-20 h-16 rounded-lg object-cover border border-slate-200" />
            ) : (
              <div className="w-20 h-16 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1">
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
                  button: "bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800 py-2 px-4 rounded-lg border border-slate-300 cursor-pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Extracted Past Questions Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" /> Past Questions for User Testing ({questions.length})
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question Manually
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs">
              No questions extracted yet. Upload a document in the OCR panel above or click "Add Question Manually".
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Question #{qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                      placeholder="Enter question statement..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  {/* Options List */}
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
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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

        {/* Modules Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2866e1]" /> Lesson Modules & Summaries ({modules.length})
            </h3>
            <button
              type="button"
              onClick={addModule}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Module
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((m, index) => (
              <div key={index} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#2866e1] uppercase tracking-wider">
                    Lesson {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

        {/* Publication Status & Save Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">Publish Status:</label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold rounded-xl px-3 py-2"
            >
              <option value="Draft">Draft (Hidden)</option>
              <option value="Published">Published (Live for Student Testing)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2866e1]/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Question Bank...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Question Bank Repository</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
