"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Flame,
  Target,
  Bell,
  CheckCircle2,
  Save,
  Loader2,
  BookOpen,
} from "lucide-react";

import PaywallModal from "@/components/PaywallModal";
import { Lock } from "lucide-react";

export default function StudySchedulePage() {
  const [dailyQuestionGoal, setDailyQuestionGoal] = useState<number>(20);
  const [dailyStudyTimeMinutes, setDailyStudyTimeMinutes] = useState<number>(30);
  const [preferredStudyTime, setPreferredStudyTime] = useState<string>("20:00");
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState<boolean>(true);
  const [pushRemindersEnabled, setPushRemindersEnabled] = useState<boolean>(true);
  const [reminderLeadTimeMinutes, setReminderLeadTimeMinutes] = useState<number>(0);
  const [currentStreakDays, setCurrentStreakDays] = useState<number>(0);

  const [questionsCompletedToday, setQuestionsCompletedToday] = useState<number>(0);
  const [timeSpentTodayMinutes, setTimeSpentTodayMinutes] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>("default");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isPaywallRequired, setIsPaywallRequired] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermissionStatus(Notification.permission);
    }

    fetch("/api/user/schedule")
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 403 && data.code === "PRO_REQUIRED") {
          setIsPaywallRequired(true);
          setShowPaywallModal(true);
          return;
        }
        if (data.success && data.schedule) {
          const s = data.schedule;
          setDailyQuestionGoal(s.dailyQuestionGoal || 20);
          setDailyStudyTimeMinutes(s.dailyStudyTimeMinutes || 30);
          setPreferredStudyTime(s.preferredStudyTime || "20:00");
          setEmailRemindersEnabled(s.emailRemindersEnabled !== false);
          setPushRemindersEnabled(s.pushRemindersEnabled !== false);
          setReminderLeadTimeMinutes(s.reminderLeadTimeMinutes || 0);
          setCurrentStreakDays(s.currentStreakDays || 0);
          setQuestionsCompletedToday(s.questionsCompletedToday || 0);
          setTimeSpentTodayMinutes(s.timeSpentTodayMinutes || 0);
        }
      })
      .catch((err) => console.error("Error loading study schedule:", err))
      .finally(() => setLoading(false));
  }, []);

  const requestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      setMessage({ text: "Browser push notifications are not supported on this device.", type: "error" });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermissionStatus(permission);

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.register("/sw.js");
        setMessage({ text: "Browser push notifications enabled!", type: "success" });
      } else {
        setMessage({ text: "Notification permission denied in browser.", type: "error" });
      }
    } catch (err) {
      console.error("Push registration error:", err);
    }
  };

  const handleSave = async (e?: React.FormEvent, sendTestEmail: boolean = false) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyQuestionGoal,
          dailyStudyTimeMinutes,
          preferredStudyTime,
          emailRemindersEnabled,
          pushRemindersEnabled,
          reminderLeadTimeMinutes,
          sendTestEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: data.message || "Study schedule preferences updated!", type: "success" });
        if (data.schedule) {
          setDailyQuestionGoal(data.schedule.dailyQuestionGoal);
          setDailyStudyTimeMinutes(data.schedule.dailyStudyTimeMinutes);
          setPreferredStudyTime(data.schedule.preferredStudyTime);
          setEmailRemindersEnabled(data.schedule.emailRemindersEnabled);
          setPushRemindersEnabled(data.schedule.pushRemindersEnabled);
          setReminderLeadTimeMinutes(data.schedule.reminderLeadTimeMinutes);
        }
      } else {
        setMessage({ text: data.error || "Failed to save preferences.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading daily study planner...</span>
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
            Habit-Building Study Planner is Exclusive to Pro
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Set daily question targets, track retention streaks, and configure mobile/email study reminders. Upgrade to Avero Pro to customize your daily planner.
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
          title="Unlock Daily Study Planner & Reminders"
        />
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((questionsCompletedToday / (dailyQuestionGoal || 1)) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Habit-Building Study Schedule</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Daily Study Planner & Reminders
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Set daily practice goals, track your streak, and configure daily study notifications.
        </p>
      </div>

      {/* Daily Progress & Streak Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Goal Ring Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today&apos;s Goal Progress
            </span>
            <Target className="w-5 h-5 text-[#2866e1]" />
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-slate-900">
                {questionsCompletedToday} <span className="text-sm text-slate-400 font-semibold">/ {dailyQuestionGoal} Questions</span>
              </div>
              <div className="text-sm font-extrabold text-[#2866e1]">{progressPercent}%</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-[#2866e1] to-[#3b82f6] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            {questionsCompletedToday >= dailyQuestionGoal
              ? "🎉 Daily goal achieved! Keep practicing or review flashcards."
              : `${dailyQuestionGoal - questionsCompletedToday} more questions needed today.`}
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Retention Streak
            </span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-extrabold text-2xl">
              🔥
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{currentStreakDays} Days</div>
              <div className="text-xs font-semibold text-slate-500">Consecutive practice streak</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Active time today: <strong className="text-slate-900">{timeSpentTodayMinutes} minutes</strong>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Goal Configuration Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#2866e1]" /> Study Target Preferences
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Daily Question Target */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daily Question Goal Target
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={dailyQuestionGoal}
                onChange={(e) => setDailyQuestionGoal(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] cursor-pointer"
              >
                <option value={10}>10 Questions / day (Light Practice)</option>
                <option value={20}>20 Questions / day (Recommended)</option>
                <option value={35}>35 Questions / day (Intense Prep)</option>
                <option value={50}>50 Questions / day (Board Exam Sprint)</option>
              </select>
            </div>
          </div>

          {/* Daily Study Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daily Target Practice Duration
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={dailyStudyTimeMinutes}
                onChange={(e) => setDailyStudyTimeMinutes(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          {/* Preferred Study Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Daily Study Hours
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="time"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
              />
            </div>
          </div>

          {/* Advance Reminder Lead Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Advance Reminder Warning Lead Time
            </label>
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={reminderLeadTimeMinutes}
                onChange={(e) => setReminderLeadTimeMinutes(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] cursor-pointer"
              >
                <option value={0}>At target study time only (Default)</option>
                <option value={15}>15 Minutes before target time</option>
                <option value={30}>30 Minutes before target time</option>
              </select>
            </div>
          </div>

          {/* Notification Channels Toggles */}
          <div className="space-y-3 pt-2">
            {/* Email Reminders Toggle */}
            <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
              <input
                type="checkbox"
                checked={emailRemindersEnabled}
                onChange={(e) => setEmailRemindersEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2866e1] rounded border-slate-300 focus:ring-[#2866e1]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#2866e1]" /> Email Study Reminders & Daily Goal Alerts
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Receive daily study prompts to keep your retention streak active.
                </span>
              </div>
            </label>

            {/* Web Push Reminders Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushRemindersEnabled}
                  onChange={(e) => setPushRemindersEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#2866e1] rounded border-slate-300 focus:ring-[#2866e1]"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    📱 Mobile & Desktop Browser Push Banners
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Pop-up banners on your phone or computer screen even when browser is closed.
                  </span>
                </div>
              </label>

              {pushPermissionStatus !== "granted" && (
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="shrink-0 px-3 py-1.5 bg-[#2866e1]/10 text-[#2866e1] hover:bg-[#2866e1]/20 rounded-lg text-xs font-bold transition"
                >
                  Enable Permissions
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
            {emailRemindersEnabled && (
              <button
                type="button"
                onClick={() => handleSave(undefined, true)}
                disabled={saving}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#2866e1] border border-blue-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Test Send Reminder Email</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Preferences...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Schedule Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
