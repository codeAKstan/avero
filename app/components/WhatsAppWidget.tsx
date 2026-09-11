"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DEFAULT_WHATSAPP_URL = "https://whatsapp.com/channel/0029VbDr8yt2v1IyMZy0oO3V";

export function WhatsAppWidget() {
  const [whatsappUrl, setWhatsappUrl] = useState(DEFAULT_WHATSAPP_URL);
  const [showBanner, setShowBanner] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.socialLinks?.whatsapp) {
          setWhatsappUrl(data.settings.socialLinks.whatsapp);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Tooltip / Announcement Bubble */}
      {showBanner && (
        <div className="pointer-events-auto max-w-[280px] sm:max-w-xs bg-white text-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 relative group">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 animate-pulse" />
          <div className="flex-1 pr-3">
            <p className="text-xs font-bold text-slate-900 mb-0.5">
              Join Our Official WhatsApp Channel!
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
              Get instant exam updates, study materials, and past questions.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-2 transition-colors"
            >
              <span>Join Channel</span>
              <span>&rarr;</span>
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Close WhatsApp banner"
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp Channel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-108 active:scale-95 transition-all duration-300 group"
      >
        {/* Pulse ring animation behind button */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:hidden duration-1000" />
        
        {/* Official WhatsApp Icon */}
        <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.002L2 22l5.132-1.347c1.472.802 3.136 1.226 4.88 1.226h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2zm5.836 14.195c-.244.688-1.42 1.314-1.961 1.398-.54.084-1.242.119-2.002-.124-.461-.148-1.055-.344-1.821-.676-3.232-1.398-5.342-4.664-5.503-4.88-.162-.216-1.314-1.748-1.314-3.334 0-1.587.835-2.366 1.132-2.69.297-.324.648-.405.864-.405.216 0 .432.003.621.012.2.009.473-.076.738.56.27.648.919 2.242.999 2.404.081.162.135.351.027.567-.108.216-.162.351-.324.54-.162.189-.34.423-.486.567-.162.162-.331.339-.142.663.189.324.84 1.386 1.802 2.242 1.237 1.1 2.28 1.442 2.604 1.604.324.162.513.135.702-.081.189-.216.811-.945 1.027-1.269.216-.324.432-.27.729-.162.297.108 1.891.891 2.215 1.053.324.162.54.243.621.378.081.135.081.783-.163 1.471z" />
        </svg>

        {/* Hover Label */}
        {isHovered && !showBanner && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            Join WhatsApp Channel
          </span>
        )}
      </a>
    </div>
  );
}
