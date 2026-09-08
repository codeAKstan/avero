"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote, Award, Users, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ALL_TESTIMONIALS = [
  {
    name: "Ugwuoke Juliet Chidera",
    initials: "UC",
    role: "Nursing Student Candidate",
    text: "It's actually amazing, it's one of the best I have seen so far! It's interesting and I don't think I'm leaving the platform anytime soon.",
  },
  {
    name: "Odo Sylvia Ukamaka",
    initials: "OU",
    role: "Nursing Exam Candidate",
    text: "The platform is very nice and user friendly. I love the fact that it doesn't only correct you on the wrong ones, but it also explains why.",
  },
  {
    name: "Okpe Adaobi",
    initials: "OA",
    role: "Nursing Student",
    text: "The questions are very standard, the rationales are very easy to understand, and I love the study planner. Overall, an excellent platform!",
  },
  {
    name: "Bethel Ugochukwu",
    initials: "BU",
    role: "Medical & Nursing Student",
    text: "It's user friendly and also a very nice platform, very good for medical and nursing students. Any amount given, it's worth it!",
  },
  {
    name: "Etugo Abigail Ifesinachi",
    initials: "EA",
    role: "Nursing Student",
    text: "It's very good for we Nursing students, actually. It's all round good in terms of preparation for both semester and council exams.",
  },
  {
    name: "Onah Jessica",
    initials: "OJ",
    role: "Student Nurse",
    text: "The questions are standard and made me think. I learnt a lot from the detailed corrections, very suitable for council exam practice!",
  },
  {
    name: "Eze Emmanuel C",
    initials: "EE",
    role: "Nursing Candidate",
    text: "I think this platform is good and I believe it will help me out in my studies to excel.",
  },
  {
    name: "Okechukwu Ebubechukwu",
    initials: "OE",
    role: "Nursing Candidate",
    text: "It's actually good! At least you can see past questions and how to answer them, and those questions can actually reappear in council exams.",
  },
  {
    name: "Doris Ujunwa",
    initials: "DU",
    role: "Student Nurse",
    text: "It's a very nice platform especially for student nurses preparing for council boards.",
  },
  {
    name: "Okonkwo Favour",
    initials: "OF",
    role: "Nursing Council Candidate",
    text: "This is very helpful and it will help students prepare well for their exams.",
  },
  {
    name: "AYOGU CHINONYE DANIELLA",
    initials: "AD",
    role: "Nursing Student",
    text: "I love the fact that it gives clinical rationale for every single answer!",
  },
  {
    name: "Ani Oluchukwu Victoria",
    initials: "AV",
    role: "Council Exam Candidate",
    text: "It's so nice! I am happy that I have found a reliable platform to practice for my council exams.",
  },
  {
    name: "Ezeme Mariagoretti Chidiuru",
    initials: "EC",
    role: "Nursing Candidate",
    text: "Educational, helpful and satisfying for any nursing candidate.",
  },
  {
    name: "Ikeme Jennifer",
    initials: "IJ",
    role: "Nursing Candidate",
    text: "It's so nice! A 10/10 platform for nursing council board preparation.",
  },
  {
    name: "Francisca",
    initials: "FN",
    role: "Student Nurse",
    text: "It's a very nice platform that will guide me on how to pass my exams.",
  },
  {
    name: "NGENE CHINECHEREM PERPETUAL",
    initials: "NP",
    role: "Nursing Candidate",
    text: "I think this is a good platform. I'm looking forward to exploring all its features for my exams!",
  },
  {
    name: "Faith CHINECHEREM OMOKHAGBO",
    initials: "FO",
    role: "Healthcare Candidate",
    text: "It's really helpful and it's a great website for nursing candidates.",
  },
  {
    name: "Nwodo Ifunanya",
    initials: "NI",
    role: "Nursing Candidate",
    text: "Well structured platform. Good job!",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  const [showAll, setShowAll] = useState(false);

  const displayedTestimonials = showAll ? ALL_TESTIMONIALS : ALL_TESTIMONIALS.slice(0, 6);

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

      // Stat 1: 0% -> 96%
      if (stat1Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 96,
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

      // Stat 2: 0K+ -> 50K+
      if (stat2Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 50,
          duration: 1.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsBarRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            if (stat2Ref.current) stat2Ref.current.innerText = `${Math.floor(obj.val)}K+`;
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
            stagger: 0.1,
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
              <span ref={stat1Ref}>96%</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Council Exam Pass Rate
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-4 sm:pt-2">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#2866e1]" />
              <span ref={stat2Ref}>50K+</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Past Questions Categorized
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
              Student Satisfaction Rating
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-3 sm:mb-4">
            Loved by 10,000+ Nursing Students &amp; Faculty
          </h2>
          <p className="text-slate-600 text-sm sm:text-lg md:text-xl font-normal max-w-2xl mx-auto">
            See how Avero Academy helps nursing candidates ace their professional council exams.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all duration-300"
            >
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
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-xs sm:text-sm font-mono shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 sm:mt-16">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#2866e1]/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>
              {showAll
                ? "Show Less Reviews"
                : `View More Reviews (Show All ${ALL_TESTIMONIALS.length} Reviews)`}
            </span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
