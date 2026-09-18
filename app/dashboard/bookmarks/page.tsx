"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  BookOpen,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";

import PaywallModal from "@/components/PaywallModal";
import { Lock, ArrowRight } from "lucide-react";
import { isAnswerMatch } from "@/lib/questionUtils";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPaywallRequired, setIsPaywallRequired] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/bookmarks");
      const data = await res.json();
      if (res.status === 403 && data.code === "PRO_REQUIRED") {
        setIsPaywallRequired(true);
        setShowPaywallModal(true);
        return;
      }
      if (data.success) {
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (bookmarkItem: any) => {
    try {
      const res = await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: bookmarkItem.courseId?._id || bookmarkItem.courseId,
          questionText: bookmarkItem.questionText,
          correctAnswer: bookmarkItem.correctAnswer,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkItem._id));
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const filteredBookmarks = bookmarks.filter((bm) =>
    bm.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bm.explanation && bm.explanation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading saved question bank...</span>
      </div>
    );
  }

  if (isPaywallRequired) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-xs my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
            Pro Feature Locked
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
            Bookmarked Questions are Exclusive to Pro
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Upgrade your account to Avero Pro to bookmark challenging questions, create revision lists, and review detailed clinical rationales anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPaywallModal(true)}
          className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          Upgrade to Avero Pro
        </button>

        <PaywallModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
          title="Unlock Bookmarked Questions"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Questions Bank ({bookmarks.length})</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bookmarked Past Questions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Review your flagged clinical questions and rationales outside of exam runs.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
          />
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-xs">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Bookmarked Questions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? "No saved questions match your search query."
              : "Click the bookmark ribbon icon on questions during test runs to save challenging items for easy review here."}
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2866e1] text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <BookOpen className="w-4 h-4" /> Browse Test Banks
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 hover:border-[#2866e1]/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold text-[10px] border border-[#2866e1]/20">
                    {bm.courseId?.title || "Clinical Nursing"}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug pt-1">
                    {bm.questionText}
                  </h3>
                </div>

                <button
                  onClick={() => handleRemoveBookmark(bm)}
                  title="Remove bookmark"
                  className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              {bm.options && bm.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {bm.options.map((opt: string, idx: number) => {
                    const isCorrect = isAnswerMatch(opt, bm.correctAnswer);
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 font-medium"
                        }`}
                      >
                        <span className="mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rationale */}
              {bm.explanation && (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Clinical Rationale:</span>
                  {bm.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
