"use client";

import { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  Building,
  Calendar,
  Mail,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function StudentSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentType, setStudentType] = useState("");
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const u = data.user;
          setFullName(u.fullName || "");
          setEmail(u.email || "");
          setStudentType(u.studentType || "");
          setUniversity(u.university || "");
          setGradYear(u.gradYear || "");
          setRole(u.role || "student");
        }
      })
      .catch((err) => console.error("Error loading profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          studentType,
          university,
          gradYear,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Profile details updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update profile.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
        <span className="text-sm">Loading profile settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage your student profile information, study field specialization, and university details.
        </p>
      </div>

      {/* Message Toast Alert */}
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

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
              />
            </div>
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address (Account ID)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Healthcare Student Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Healthcare Student Specialization
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={studentType}
                onChange={(e) => setStudentType(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] cursor-pointer"
              >
                <option value="">Select student type...</option>
                <option value="General Nursing Student (RN)">General Nursing Student (RN)</option>
                <option value="Midwifery Student (RM)">Midwifery Student (RM)</option>
                <option value="Public Health Nursing Student">Public Health Nursing Student</option>
                <option value="Mental Health / Psychiatric Nursing">Mental Health / Psychiatric Nursing</option>
                <option value="Pediatric Nursing Student">Pediatric Nursing Student</option>
                <option value="Nurse Practitioner Student">Nurse Practitioner Student</option>
                <option value="Pre-Nursing / Foundation Student">Pre-Nursing / Foundation Student</option>
              </select>
            </div>
          </div>

          {/* University */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              University or Healthcare Training Workplace
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. School of Nursing, University Teaching Hospital"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
              />
            </div>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Qualification / Graduation Year
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] cursor-pointer"
              >
                <option value="">Select qualification year...</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029+">2029 or later</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
