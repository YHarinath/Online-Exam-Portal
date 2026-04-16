"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BarChart3,
  Bell,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Exams", href: "/admin/exams", icon: BookOpen },
  { name: "Results", href: "/admin/results", icon: BarChart3 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New student registered", body: "Alice Johnson just joined the platform.", time: "5m ago", unread: true },
  { id: 2, title: "Exam submission", body: "12 students completed React Fundamentals.", time: "30m ago", unread: true },
  { id: 3, title: "System update", body: "Platform updated to v2.1 successfully.", time: "2h ago", unread: false },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const initial = user?.name?.charAt(0).toUpperCase() ?? "A";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 glass border-r flex flex-col justify-between">
        <div className="p-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-cyan-400 mb-8 font-bold text-xl">
            <BookOpen className="w-8 h-8" />
            <span>AdminHub</span>
          </div>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/create`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-cyan-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar bottom: user mini-card */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 glass border-b flex items-center justify-between px-8 z-50">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {sidebarLinks.find((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))?.name ?? "Dashboard"}
          </h1>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* ── Notification Bell ── */}
            <div className="relative" ref={notifRef}>
              <button
                id="btn-admin-notifications"
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                className="relative p-2 rounded-xl text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifications</h3>
                    <button
                      onClick={() => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })))}
                      className="text-xs text-indigo-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                          n.unread ? "bg-indigo-50/60 dark:bg-indigo-900/10" : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-indigo-500" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile Avatar ── */}
            <div className="relative" ref={profileRef}>
              <button
                id="btn-admin-profile"
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center space-x-1.5 group"
                aria-label="Profile menu"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                  {initial}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-white/10 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {initial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.name ?? "Admin"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email ?? ""}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                          {user?.role ?? "ADMIN"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
