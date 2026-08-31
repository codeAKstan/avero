"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-bold text-lg text-slate-900">Invalid Reset Link</h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          No password reset token was provided in the URL. Please request a new link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block px-4 py-2 bg-[#2866e1] text-white font-bold text-xs rounded-xl"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-xl text-slate-900">
          Password Updated!
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Your password has been successfully reset. You can now log in with your new credentials.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2866e1]/25"
          >
            <span>Proceed to Log in</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-[#0f172a] mb-2">
          Set new password
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2866e1]/40 focus:border-[#2866e1]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2866e1]/40 focus:border-[#2866e1]"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2866e1]/25 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0fe] via-white to-[#d2e3fc] bg-dot-pattern flex flex-col justify-center items-center px-4 py-8 selection:bg-[#2866e1]/20 selection:text-[#0f172a] relative overflow-hidden">
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-[#2866e1]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-[#2866e1]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="Avero logo"
            width={440}
            height={140}
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
            priority
          />
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        <Suspense fallback={<div className="text-center py-6 text-xs text-slate-500">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
