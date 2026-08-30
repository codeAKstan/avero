"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.1 }
      )
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          graphicRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.2)" },
          "-=0.6"
        );

      // SVG path draw animation
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(
          pathRef.current,
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
          "-=0.5"
        );
      }

      // Continuous subtle float effect for hero image graphic
      if (graphicRef.current) {
        gsap.to(graphicRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-12 sm:pb-16 md:pt-14 md:pb-24 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
          {/* Top Pill Tag */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-3.5 sm:px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-5 sm:mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-[#2866e1] animate-pulse"></span>
            Question Bank for every Nurse, everywhere
          </div>

          {/* Main Headline */}
          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-montserrat)] font-bold text-[32px] xs:text-[36px] sm:text-[48px] lg:text-[54px] leading-[1.12] sm:leading-[1.15] text-[#0f172a] tracking-tight mb-5 sm:mb-6"
          >
            Study smarter.
            <br />
            Get tested on what
            <br />
            actually{" "}
            <span className="relative inline-block text-[#0f172a]">
              matters
              <svg
                className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full overflow-visible"
                viewBox="0 0 150 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  ref={pathRef}
                  d="M2 8C40 2 110 2 148 10"
                  stroke="#2866e1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            .
          </h1>

          {/* Description Paragraph */}
          <p
            ref={descRef}
            className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-lg mb-8 sm:mb-10"
          >
            Pick a subject, and get tested with quizzes built from your actual course material . No digging through generic national question banks that don&apos;t match what you were taught.
          </p>

          {/* Action Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-16 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto justify-center bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-base px-6 py-3.5 rounded-full transition-all flex items-center gap-3 shadow-md shadow-[#2866e1]/20 group"
            >
              <span>Get Started</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ChevronRight className="w-4 h-4 text-white stroke-[3]" />
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 text-[#0f172a] font-semibold text-base hover:opacity-80 transition-opacity py-2 sm:py-0"
            >
              See how it works
              <ChevronRight className="w-4 h-4 text-[#0f172a] stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Right Column Image Graphic */}
        <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center lg:justify-end items-center mt-4 lg:mt-0">
          {/* Circular soft blue backdrop bounded to prevent overflow */}
          <div className="absolute w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[440px] sm:h-[440px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#e2ebfe] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-[-45%]"></div>

          {/* Main Hero Graphic Image */}
          <div ref={graphicRef} className="relative w-full max-w-[540px]">
            <Image
              src="/images/hero-image.PNG"
              alt="Avero exam quiz generator preview"
              width={640}
              height={520}
              priority
              className="w-full h-auto object-contain drop-shadow-xl rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
