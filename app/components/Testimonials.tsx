import { Star, Quote, Award, Users, CheckCircle2 } from "lucide-react";

export function Testimonials() {
  return (
    <section className="w-full bg-[#f4f7fc]/70 border-y border-slate-200/60 py-20 sm:py-28 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Trust Stats Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm mb-16 sm:mb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <Award className="w-8 h-8 text-[#2866e1]" />
              94%
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Average Exam Mastery Rate
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2">
            <div className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <Users className="w-8 h-8 text-[#2866e1]" />
              10M+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Practice Questions Answered
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2">
            <div className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-[#2866e1] font-[family-name:var(--font-montserrat)] mb-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span>4.9</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              User Satisfaction Rating
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight text-[#0f172a] tracking-tight mb-4">
            Loved by 10,000+ Healthcare Students & Faculty
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl mx-auto">
            See how Avero helps medical and nursing students ace their exams.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                &ldquo;Avero transformed my USMLE preparation. Instead of reading endless 1,000-page textbooks, I practiced directly on my course materials and scored 255+ on Step 1!&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-sm font-mono">
                SJ
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  Sarah Jenkins, MS3
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-xs text-slate-500">
                  Johns Hopkins School of Medicine
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                &ldquo;The knowledge gap analysis is incredible. It automatically identified my weak pharmacology concepts so I knew exactly what to review before my NCLEX boards.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-sm font-mono">
                MV
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  Marcus Vance, BSN, RN
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-xs text-slate-500">
                  NYU Rory Meyers College of Nursing
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#2866e1]/20" />
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                &ldquo;Avero ensures that students are actively engaging with assigned lectures before coming to clinical rotations. The instructor alignment is unmatched.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2866e1]/10 text-[#2866e1] font-bold flex items-center justify-center text-sm font-mono">
                ER
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  Dr. Elena Rostova, MD
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2866e1]" />
                </div>
                <div className="text-xs text-slate-500">
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
