"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is AVERO ACADEMY?",
    answer:
      "AVERO ACADEMY is an educational platform designed to help students prepare effectively for professional examinations, initially focusing on nursing students preparing for professional council examinations. We turn scattered past examination papers into an organized, subject-based, explanation-driven study system.",
  },
  {
    question: "What nursing subjects are available?",
    answer:
      "Avero Academy organizes questions into individual subject categories including Anatomy, Fundamentals of Nursing, Pharmacology, Medical-Surgical Nursing, Maternal & Child Health, and other core nursing courses.",
  },
  {
    question: "How does Avero Academy organize past questions?",
    answer:
      "Rather than making students dig through mixed exam papers, Avero Academy identifies and groups questions into their respective subjects. This enables structured, subject-by-subject practice so you master one domain at a time.",
  },
  {
    question: "What are extracted learning points?",
    answer:
      "Beyond providing verified correct answers, Avero Academy extracts key learning points and insights for every question. This ensures you understand both the clinical reasoning behind the answer and what examiners expect you to know.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Yes. The Free Starter plan gives you daily access to categorized nursing council practice sets so you can experience Avero Academy's explanation-driven system before upgrading.",
  },
  {
    question: "How is answer accuracy maintained?",
    answer:
      "All question keys, explanations, and learning points undergo rigorous academic review by nursing educators to ensure 100% accuracy and eliminate misleading or unsupported information.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (accordionContainerRef.current) {
        gsap.fromTo(
          accordionContainerRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: accordionContainerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#f4f7fc]/70 border-t border-slate-200/60 py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-3.5 sm:px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-3 sm:mb-4">
            Help Center
          </div>
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-2xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-3 sm:mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-lg font-normal">
            Everything you need to know about preparing for council exams with Avero Academy.
          </p>
        </div>

        {/* Accordion List */}
        <div ref={accordionContainerRef} className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 font-[family-name:var(--font-montserrat)] font-bold text-sm sm:text-base md:text-lg text-slate-900 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#2866e1] text-white" : "text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed border-t border-slate-50 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
