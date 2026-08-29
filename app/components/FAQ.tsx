"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Avero?",
    answer:
      "Avero is a quiz platform that generates practice questions from your actual course material — so you're studying and testing yourself on what your professors taught, not a generic national question bank.",
  },
  {
    question: "What subjects are available?",
    answer:
      "Whatever your school or program has added — Avero's library grows as your instructors upload more material. You'll see subjects and topics mapped to your actual coursework.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Yes. The Free plan includes one quiz a day so you can try Avero before upgrading for unlimited practice.",
  },
  {
    question: "Can I use Avero on my phone?",
    answer:
      "Yes — it's built to work well on mobile, so you can quiz yourself between lectures or on rounds.",
  },
  {
    question: "How is my progress tracked?",
    answer:
      "Avero tracks your scores over time and flags the topics you consistently miss, so you know what to revisit before an exam.",
  },
  {
    question: "Is Avero affiliated with USMLE, NBME, or my school?",
    answer:
      "No — Avero is an independent study tool. It's built to reflect your own course content, not to replicate any official exam board's material.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Free for individual students with limited daily quizzes, a paid Student plan for unlimited access, and a custom School plan for institutions that includes admin tools and analytics.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#f4f7fc]/70 border-t border-slate-200/60 py-20 sm:py-28 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#2866e1] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#cbdcfd] mb-4">
            Help Center
          </div>
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-600 text-lg font-normal">
            Everything you need to know about studying with Avero.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-[family-name:var(--font-montserrat)] font-bold text-base sm:text-lg text-slate-900 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#2866e1] text-white" : "text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-50 mt-1">
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
