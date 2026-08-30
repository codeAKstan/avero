"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import gsap from "gsap";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Entrance animation for header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  // GSAP animation for mobile menu toggle
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0, scale: 0.95 },
        { height: "auto", opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll(".mobile-nav-item"),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen && mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(true);
    }
  };

  return (
    <header ref={headerRef} className="w-full pt-4 sm:pt-6 px-4 sm:px-8 flex flex-col items-center z-50 relative">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-8 py-2.5 sm:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200/80 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Avero logo"
              width={320}
              height={90}
              className="h-10 sm:h-14 md:h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-slate-700">
          <Link
            href="/features"
            className="hover:text-slate-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-slate-900 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="hover:text-slate-900 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/for-educators"
            className="hover:text-slate-900 transition-colors"
          >
            For educators
          </Link>
          <Link
            href="/pricing"
            className="hover:text-slate-900 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-6">
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

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-3">
          <Link
            href="/signup"
            className="bg-[#2866e1] text-white font-medium text-xs px-3.5 py-2 rounded-full flex items-center gap-1"
          >
            Get Started
          </Link>
          <button
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="w-full max-w-5xl mt-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-2xl overflow-hidden md:hidden z-50"
        >
          <div className="flex flex-col gap-4 text-base font-medium text-slate-800">
            <Link
              href="/features"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-item py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-item py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-item py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/for-educators"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-item py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              For educators
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-item py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Pricing
            </Link>
            <div className="mobile-nav-item border-t border-slate-100 pt-4 mt-1 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-[#2866e1] text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-md"
              >
                Get Started
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
