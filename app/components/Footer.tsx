"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-[#0f172a] text-slate-400 pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Pre-Footer Banner Card */}
        <div
          ref={bannerRef}
          className="bg-[#2866e1] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 mb-12 sm:mb-20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left"
        >
          <div className="max-w-xl z-10">
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-3 sm:mb-4">
              Ready to master your nursing council exams?
            </h2>
            <p className="text-white/80 text-sm sm:text-lg font-normal">
              Join thousands of nursing candidates preparing smarter with Avero Academy.
            </p>
          </div>

          <div className="shrink-0 z-10 w-full sm:w-auto">
            <Link
              href="/signup"
              className="bg-white hover:bg-slate-100 text-[#2866e1] font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Get Started for Free</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Decorative background glow circles */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-12 sm:pb-16 border-b border-slate-800">
          {/* Brand Info Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="mb-3 sm:mb-4 inline-block">
              <Image
                src="/images/logo.png"
                alt="Avero logo"
                width={360}
                height={100}
                className="h-10 sm:h-16 md:h-18 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-4 sm:mb-6">
              AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system that helps students prepare smarter and more confidently.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-xs sm:text-sm">
            {/* Column 1: Product */}
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-3 sm:mb-4">
                Product
              </div>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
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
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-3 sm:mb-4">
                Company
              </div>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/for-educators" className="hover:text-white transition-colors">
                    For Educators
                  </Link>
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
            <div className="col-span-2 sm:col-span-1">
              <div className="font-bold text-white uppercase tracking-wider text-xs mb-3 sm:mb-4">
                Legal
              </div>
              <ul className="space-y-2.5 sm:space-y-3">
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
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} AVERO ACADEMY Technologies Inc. All rights reserved.
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
