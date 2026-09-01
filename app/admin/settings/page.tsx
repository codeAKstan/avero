"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Share2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Copyright,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Video,
  Send,
} from "lucide-react";

// Social Media Brand SVG Components
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={`fill-current ${className || "w-4 h-4"}`} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={`fill-current ${className || "w-4 h-4"}`} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={`fill-none stroke-current stroke-[2] ${className || "w-4 h-4"}`} viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={`fill-current ${className || "w-4 h-4"}`} viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

interface ISocialLinks {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
  tiktok: string;
  telegram: string;
}

export default function AdminSettingsPage() {
  const [socialLinks, setSocialLinks] = useState<ISocialLinks>({
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    whatsapp: "",
    tiktok: "",
    telegram: "",
  });

  const [siteName, setSiteName] = useState("AVERO ACADEMY");
  const [contactEmail, setContactEmail] = useState("support@avero.academy");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [copyrightText, setCopyrightText] = useState("AVERO ACADEMY Technologies Inc. All rights reserved.");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        if (s.socialLinks) {
          setSocialLinks({
            twitter: s.socialLinks.twitter || "",
            facebook: s.socialLinks.facebook || "",
            instagram: s.socialLinks.instagram || "",
            linkedin: s.socialLinks.linkedin || "",
            youtube: s.socialLinks.youtube || "",
            whatsapp: s.socialLinks.whatsapp || "",
            tiktok: s.socialLinks.tiktok || "",
            telegram: s.socialLinks.telegram || "",
          });
        }
        if (s.siteName) setSiteName(s.siteName);
        if (s.contactEmail) setContactEmail(s.contactEmail);
        if (s.contactPhone) setContactPhone(s.contactPhone);
        if (s.address) setAddress(s.address);
        if (s.copyrightText) setCopyrightText(s.copyrightText);
      }
    } catch (err) {
      console.error("Error fetching admin settings:", err);
      setMessage({ text: "Failed to load admin settings.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialChange = (field: keyof ISocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialLinks,
          siteName,
          contactEmail,
          contactPhone,
          address,
          copyrightText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Admin settings & social media links updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update settings.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({ text: "An error occurred while saving settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2866e1]" />
        <span className="text-sm font-medium">Loading admin settings...</span>
      </div>
    );
  }

  const socialPlatforms: {
    key: keyof ISocialLinks;
    label: string;
    placeholder: string;
    icon: any;
    color: string;
  }[] = [
    {
      key: "twitter",
      label: "Twitter / X",
      placeholder: "https://x.com/averoacademy",
      icon: TwitterIcon,
      color: "text-slate-800",
    },
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/averoacademy",
      icon: FacebookIcon,
      color: "text-blue-600",
    },
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/averoacademy",
      icon: InstagramIcon,
      color: "text-pink-600",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/company/averoacademy",
      icon: LinkedinIcon,
      color: "text-blue-700",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "https://youtube.com/@averoacademy",
      icon: Video,
      color: "text-red-600",
    },
    {
      key: "whatsapp",
      label: "WhatsApp Channel / Group",
      placeholder: "https://chat.whatsapp.com/...",
      icon: MessageCircle,
      color: "text-emerald-600",
    },
    {
      key: "tiktok",
      label: "TikTok",
      placeholder: "https://tiktok.com/@averoacademy",
      icon: Share2,
      color: "text-[#00F2FE]",
    },
    {
      key: "telegram",
      label: "Telegram Community",
      placeholder: "https://t.me/averoacademy",
      icon: Send,
      color: "text-sky-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2866e1]/10 text-[#2866e1] rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Portal Settings
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage social media channels, contact details, and site configuration.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Social Media Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#2866e1]" /> Social Media Links
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These links will be displayed in the site footer and official contact channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const currentValue = socialLinks[platform.key];

              return (
                <div key={platform.key} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${platform.color}`} />
                      {platform.label}
                    </span>
                    {currentValue && (
                      <a
                        href={currentValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#2866e1] hover:underline flex items-center gap-1 font-semibold normal-case"
                      >
                        <span>Test</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder={platform.placeholder}
                      value={currentValue}
                      onChange={(e) => handleSocialChange(platform.key, e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1] transition"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Platform Details Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2866e1]" /> Platform & Contact Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure default site branding and official contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Site Name
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
                />
              </div>
            </div>

            {/* Support Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Support Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
                />
              </div>
            </div>

            {/* Support Phone / Hotline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contact Phone / Support Hotline
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+1 (800) 555-0199"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Physical Address / Headquarters
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 100 Innovation Way, Suite 400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
                />
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Copyright Footer Notice
            </label>
            <div className="relative">
              <Copyright className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2866e1]/30 focus:border-[#2866e1]"
              />
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#2866e1] hover:bg-[#1d52bf] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
