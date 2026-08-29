import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-7">
            <span className="w-2 h-2 rounded-full bg-[#2866e1]"></span>
            Question Bank for everyone, everywhere
          </div>

          {/* Main Headline */}
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-[38px] sm:text-[50px] lg:text-[54px] leading-[1.15] text-[#0f172a] tracking-tight mb-6">
            Study smarter.
            <br />
            Get tested on what
            <br />
            actually{" "}
            <span className="relative inline-block text-[#0f172a]">
              matters
              <svg
                className="absolute -bottom-2 left-0 w-full overflow-visible"
                viewBox="0 0 150 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C40 2 110 2 148 10"
                  stroke="#2866e1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            .
          </h2>

          {/* Description Paragraph */}
          <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed max-w-lg mb-10">
            Pick a subject, and get tested with quizzes built from your actual course material . No digging through generic national question banks that don't match what you were taught.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6 mb-12 sm:mb-16">
            <Link
              href="/signup"
              className="bg-[#2866e1] hover:bg-[#1d52bf] text-white font-medium text-base px-6 py-3.5 rounded-full transition-all flex items-center gap-3 shadow-md shadow-[#2866e1]/20 group"
            >
              <span>Get Started</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ChevronRight className="w-4 h-4 text-white stroke-[3]" />
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 text-[#0f172a] font-semibold text-base hover:opacity-80 transition-opacity"
            >
              See how it works
              <ChevronRight className="w-4 h-4 text-[#0f172a] stroke-[2.5]" />
            </a>
          </div>


        </div>

        {/* Right Column Image Graphic */}
        <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center lg:justify-end items-center">
          {/* Circular soft blue backdrop */}
          <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#e2ebfe] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-[-45%]"></div>

          {/* Main Hero Graphic Image */}
          <div className="relative w-full max-w-[540px]">
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
