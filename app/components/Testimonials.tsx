"use client";

import { useEffect, useRef } from "react";
import { Star, Quote, Award, Users, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal stats bar
      gsap.fromTo(
        statsBarRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsBarRef.current,
            start: "top 85%",
          },
        }
      );

      // Stat 1: 0% -> 94%
      if (stat1Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 94,
          duration: 1.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsBarRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            if (stat1Ref.current) stat1Ref.current.innerText = `${Math.floor(obj.val)}%`;
          },
        });
      }

      // Stat 2: 0M+ -> 10M+
      if (stat2Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 10,
          duration: 1.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsBarRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            if (stat2Ref.current) stat2Ref.current.innerText = `${Math.floor(obj.val)}M+`;
          },
        });
      }

      // Stat 3: 0.0 -> 4.9
      if (stat3Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 4.9,
          duration: 1.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsBarRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            if (stat3Ref.current) stat3Ref.current.innerText = obj.val.toFixed(1);
          },
        });
      }

      // Cards staggered reveal
      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#f4f7fc]/70 border-y border-slate-200/60 py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Trust Stats Bar */}
        <div
          ref={statsBarRef}
          className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm mb-12 sm:mb-16 md:mb-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
        >
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]" />
              <span ref={stat1Ref}>94%</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Average Exam Mastery Rate
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-4 sm:pt-2">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]" />
              <span ref={stat2Ref}>10M+</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Practice Questions Answered
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-4 sm:pt-2">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span ref={stat3Ref}>4.9</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              User Satisfaction Rating
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-3 sm:mb-4">
            Loved by 10,000+ Healthcare Students & Faculty
          </h2>
          <p className="text-slate-600 text-sm sm:text-lg md:text-xl font-normal max-w-2xl mx-auto">
            See how Avero helps medical and nursing students ace their exams.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed mb-6 italic">
                &ldquo;Avero transformed my USMLE preparation. Instead of reading endless 1,000-page textbooks, I practiced directly on my course materials and scored 255+ on Step 1!&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-xs sm:text-sm font-mono shrink-0">
                SJ
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  Sarah Jenkins, MS3
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500">
                  Johns Hopkins School of Medicine
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed mb-6 italic">
                &ldquo;The knowledge gap analysis is incredible. It automatically identified my weak pharmacology concepts so I knew exactly what to review before my NCLEX boards.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-xs sm:text-sm font-mono shrink-0">
                MV
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  Marcus Vance, BSN, RN
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500">
                  NYU Rory Meyers College of Nursing
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed mb-6 italic">
                &ldquo;Avero helped me get ready for my counsel exams with quality questions that were relevant to what I was taught.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-xs sm:text-sm font-mono shrink-0">
                ER
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  Dr. Elena Rostova, MD
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500">
                  Professor of Pathology, Harvard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
