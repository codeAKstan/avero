"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  BookOpen,
  Plus,
  BarChart3,
  Megaphone,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Settings,
  Zap,
  CreditCard,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.admin) {
          setAdminUser(data.admin);
        }
      })
      .catch(() => { });
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Pro Users", href: "/admin/pro-users", icon: Zap },
    { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { label: "Course Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Courses & Content", href: "/admin/courses", icon: BookOpen },
    { label: "OCR AI Builder", href: "/admin/courses/new", icon: Plus },
    { label: "Exam Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Banners", href: "/admin/announcements", icon: Megaphone },
    { label: "Admin Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden font-sans selection:bg-[#2866e1]/20 selection:text-[#2866e1]">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/images/favicon.png"
            alt="Avero Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            priority
          />
          <span className="font-bold text-slate-900 text-base tracking-tight">AVERO ADMIN</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Static, Fixed on Desktop) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Brand Section */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image
              src="/images/favicon.png"
              alt="Avero Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              priority
            />
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight leading-tight group-hover:text-[#2866e1] transition-colors">
                AVERO ACADEMY
              </h2>
              <p className="text-[11px] text-[#2866e1] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links (Static) */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? "bg-[#2866e1]/10 text-[#2866e1] border border-[#2866e1]/20 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#2866e1]" : "text-slate-400"
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
                {
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-[#2866e1]" />
                }
              </Link>
            );
          })}
        </nav>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminUser?.fullName || "Avero Admin"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {adminUser?.email || "admin@avero.academy"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Main Content Area (Scrollable independently) */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto flex flex-col">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 capitalize">
              {pathname === "/admin"
                ? "Dashboard Overview"
                : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/courses/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition cursor-pointer"
            >
              Create Course with AI
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
