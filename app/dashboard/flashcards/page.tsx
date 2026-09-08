"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  ArrowRight,
  Loader2,
  Flame,
  Award,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { shuffleArray } from "@/lib/utils";

import PaywallModal from "@/components/PaywallModal";
import { Lock } from "lucide-react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [dueCount, setDueCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [cardsReviewedCount, setCardsReviewedCount] = useState<number>(0);
  const [isPaywallRequired, setIsPaywallRequired] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(true);

  const fetchFlashcards = async () => {
    setLoading(true);
    setSessionCompleted(false);
    try {
      const res = await fetch("/api/user/flashcards?mode=due");
      const data = await res.json();
      if (res.status === 403 && data.code === "PRO_REQUIRED") {
        setIsPaywallRequired(true);
        setShowPaywallModal(true);
        return;
      }
      if (data.success) {
        setCards(shuffleArray(data.cards || []));
        setDueCount(data.dueCount || 0);
        setTotalCount(data.totalCount || 0);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error("Error loading flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleRateCard = async (rating: number) => {
    if (ratingLoading || cards.length === 0) return;
    const currentCard = cards[currentIndex];
    setRatingLoading(true);

    try {
      const res = await fetch("/api/user/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard._id,
          rating,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCardsReviewedCount((prev) => prev + 1);
        setIsFlipped(false);

        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setSessionCompleted(true);
        }
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading spaced repetition flashcard deck...</span>
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
            Spaced Repetition Flashcards are Exclusive to Pro
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Boost your long-term memory retention with active-recall flashcards powered by the SuperMemo SM-2 algorithm. Upgrade to Avero Pro to unlock full deck reviews.
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
          title="Unlock Active Recall Flashcards"
        />
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>SuperMemo 2 (SM-2) Spaced Repetition Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Active Recall Flashcards
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Master nursing past questions right before memory decay occurs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 text-[#2866e1] rounded-xl text-xs font-bold text-center">
            <span className="block text-lg font-black">{dueCount}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Due Today</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center">
            <span className="block text-lg font-black">{totalCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Deck</span>
          </div>
        </div>
      </div>

      {sessionCompleted || cards.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-10 md:p-14 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {cardsReviewedCount > 0 ? "Daily Review Completed!" : "No Flashcards Due Today!"}
          </h2>
          <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            {cardsReviewedCount > 0
              ? `Great job! You reviewed ${cardsReviewedCount} flashcards using SM-2 optimal interval calculations. Check back tomorrow to keep your retention streak!`
              : "All your flashcards are up to date! Return tomorrow or practice test banks to create more flashcards."}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={fetchFlashcards}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Check Again
            </button>
            <Link
              href="/dashboard/courses"
              className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Practice Test Banks
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Card Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="font-mono text-[#2866e1] font-bold">
              Course: {currentCard.courseId?.title || "Clinical Nursing"}
            </span>
          </div>

          {/* Flashcard 3D Perspective Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] bg-white border-2 border-slate-200/90 rounded-3xl p-8 md:p-10 shadow-lg cursor-pointer transition-all hover:border-[#2866e1]/40 flex flex-col justify-between relative select-none"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                {isFlipped ? "Answer & Rationale (Back)" : "Question Statement (Front)"}
              </span>
              <span className="text-xs font-semibold text-[#2866e1] flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Tap to Flip
              </span>
            </div>

            <div className="py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-4">
                  <h3 className="text-base md:text-xl font-bold text-slate-900 leading-snug">
                    {currentCard.questionText}
                  </h3>
                  {currentCard.options && currentCard.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left pt-2">
                      {currentCard.options.map((opt: string, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                          <span className="font-bold text-[#2866e1] mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-left animate-in fade-in">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
                    <span className="text-emerald-600 uppercase tracking-wider block text-[10px]">Correct Answer:</span>
                    {currentCard.correctAnswer}
                  </div>
                  {currentCard.explanation && (
                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-xl">
                      <span className="font-bold text-slate-900 block mb-1">Clinical Rationale:</span>
                      {currentCard.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-400 font-medium">
              {!isFlipped ? "Tap card to reveal answer & rationale" : "Rate how well you recalled this answer below"}
            </div>
          </div>

          {/* SM-2 Self-Rating Controls */}
          {isFlipped && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3 animate-in fade-in">
              <div className="text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                How easy was this question to recall?
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Rating 1: Again */}
                <button
                  onClick={() => handleRateCard(1)}
                  disabled={ratingLoading}
                  className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-xl font-bold text-xs flex flex-col items-center transition cursor-pointer"
                >
                  <span className="text-sm font-extrabold">🔴 Again</span>
                  <span className="text-[10px] font-mono text-rose-600 mt-0.5">&lt; 1 Day</span>
                </button>

                {/* Rating 3: Hard */}
                <button
                  onClick={() => handleRateCard(3)}
                  disabled={ratingLoading}
                  className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-bold text-xs flex flex-col items-center transition cursor-pointer"
                >
                  <span className="text-sm font-extrabold">🟡 Hard</span>
                  <span className="text-[10px] font-mono text-amber-600 mt-0.5">3 Days</span>
                </button>

                {/* Rating 4: Good */}
                <button
                  onClick={() => handleRateCard(4)}
                  disabled={ratingLoading}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-bold text-xs flex flex-col items-center transition cursor-pointer"
                >
                  <span className="text-sm font-extrabold">🟢 Good</span>
                  <span className="text-[10px] font-mono text-blue-600 mt-0.5">5 Days</span>
                </button>

                {/* Rating 5: Easy */}
                <button
                  onClick={() => handleRateCard(5)}
                  disabled={ratingLoading}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex flex-col items-center transition cursor-pointer"
                >
                  <span className="text-sm font-extrabold">🔵 Easy</span>
                  <span className="text-[10px] font-mono text-emerald-600 mt-0.5">10 Days</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
