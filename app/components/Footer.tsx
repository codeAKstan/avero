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
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-4 sm:mb-5">
              AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system that helps students prepare smarter and more confidently.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#2866e1] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#2866e1] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#2866e1] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#2866e1] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#2866e1] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
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
