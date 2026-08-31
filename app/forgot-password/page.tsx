"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [debugUrl, setDebugUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg("");
    setDebugUrl("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (data.debugResetUrl) {
          setDebugUrl(data.debugResetUrl);
        }
      } else {
        setErrorMsg(data.error || "Failed to process request. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0fe] via-white to-[#d2e3fc] bg-dot-pattern flex flex-col justify-center items-center px-4 py-8 selection:bg-[#2866e1]/20 selection:text-[#0f172a] relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-[#2866e1]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-[#2866e1]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Logo */}
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

      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-xl sm:text-2xl text-[#0f172a] mb-2">
                Forgot password?
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Enter your account email address and we will send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
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
                className="w-full py-3 px-4 rounded-xl bg-[#2866e1] hover:bg-[#1d52bf] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2866e1]/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-xl text-slate-900">
              Check your inbox
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              If an account with <strong className="text-slate-900">{email}</strong> exists, we have dispatched a password reset link. Please check your inbox and spam folder.
            </p>

            {debugUrl && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs space-y-1">
                <span className="font-bold text-[#2866e1]">Dev Mode Direct Link:</span>
                <p className="break-all text-slate-700 font-mono text-[11px]">
                  <Link href={debugUrl} className="underline text-[#2866e1]">
                    {debugUrl}
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2866e1] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
