import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export function Header() {
  return (
    <header className="w-full pt-6 px-4 sm:px-8 flex justify-center z-50">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-8 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200/80 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Avero logo"
              width={320}
              height={90}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-slate-700">
          <a
            href="#features"
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            Features
            <ChevronDown className="w-3.5 h-3.5 opacity-60 stroke-[2.5]" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            How it works
            <ChevronDown className="w-3.5 h-3.5 opacity-60 stroke-[2.5]" />
          </a>
          <a
            href="#for-educators"
            className="hover:text-slate-900 transition-colors"
          >
            For educators
          </a>
          <a
            href="#pricing"
            className="hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-[15px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-[15px] px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
