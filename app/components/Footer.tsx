import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-slate-400 pt-16 pb-12 px-6 sm:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Pre-Footer Banner Card */}
        <div className="bg-[#2866e1] text-white rounded-3xl p-8 sm:p-12 lg:p-16 mb-20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left z-10">
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
              Ready to transform the way you study?
            </h2>
            <p className="text-white/80 text-base sm:text-lg font-normal">
              Join 10,000+ medical and nursing students acing their exams with Avero.
            </p>
          </div>

          <div className="shrink-0 z-10">
            <Link
              href="/signup"
              className="bg-white hover:bg-slate-100 text-[#2866e1] font-bold text-base px-8 py-4 rounded-full transition-all shadow-lg flex items-center gap-2"
            >
              <span>Get Started for Free</span>
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Decorative background glow circles */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-slate-800">
          {/* Brand Info Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo.png"
                alt="Avero logo"
                width={360}
                height={100}
                className="h-14 sm:h-18 md:h-20 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
              Study smarter. Get tested on what actually matters. Avero helps medical students and healthcare professionals master course material with active recall.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs sm:text-sm">
            {/* Column 1: Product */}
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-4">
                Product
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Log in
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-4">
                Company
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Educators
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-4">
                Legal
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Avero Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
