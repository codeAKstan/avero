"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccess("Authentication successful. Redirecting to Admin Portal...");
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.05)] relative z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2866e1] shadow-md shadow-[#2866e1]/20 mb-4">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AVERO ACADEMY</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Administrator Portal Login</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm animate-in fade-in font-medium">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@avero.academy"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2866e1] focus:ring-1 focus:ring-[#2866e1] rounded-xl text-slate-900 placeholder-slate-400 text-sm transition outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2866e1] focus:ring-1 focus:ring-[#2866e1] rounded-xl text-slate-900 placeholder-slate-400 text-sm transition outline-none font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold rounded-xl text-sm shadow-md shadow-[#2866e1]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-slate-400 font-medium">
        Avero Academy &copy; 2026. Secure Administrator Portal.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden bg-dot-pattern">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-lg">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#2866e1] mb-2" />
          <span>Loading login interface...</span>
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
