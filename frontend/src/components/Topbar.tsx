"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCheck,
  Send,
  X,
  ShieldCheck,
  Mail,
  Sparkles,
  Menu,
} from "lucide-react";
import { NotificationItem } from "../types";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();

  const [admin, setAdmin] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [darkMode, setDarkMode] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Attendance Marked",
      message: "Face verified successfully via neural engine.",
      time: "Just now",
      read: false,
      type: "attendance",
    },
    {
      id: 2,
      title: "New Student Added",
      message: "Student enrollment verified and face embeddings logged.",
      time: "10 min ago",
      read: false,
      type: "student",
    },
    {
      id: 3,
      title: "System Telemetry Active",
      message: "AI Camera feed active and operational.",
      time: "1 hr ago",
      read: true,
      type: "system",
    },
  ]);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const isDark = theme !== "light";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const adminJson = localStorage.getItem("admin") || localStorage.getItem("user");
    if (adminJson) {
      try {
        setAdmin(JSON.parse(adminJson));
      } catch (_) {}
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    router.replace("/login");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        {/* Search bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search students, logs, cameras..."
            className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40 py-2.5 pl-11 pr-4 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
          title="Toggle Theme"
        >
          {darkMode ? (
            <Sun size={20} className="text-amber-400" />
          ) : (
            <Moon size={20} className="text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl transition ${
                      item.read
                        ? "bg-transparent text-slate-500 dark:text-slate-400"
                        : "bg-blue-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setOpenNotifications(false)}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/50 p-1.5 pr-3 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {admin?.name || "Administrator"}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {admin?.email || "admin@system.io"}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-card border border-white/40 dark:border-slate-800/80 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {admin?.name || "Administrator"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {admin?.email || "admin@system.io"}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setOpenMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <User size={15} /> My Profile
                </button>

                <Link
                  href="/settings"
                  onClick={() => setOpenMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Settings size={15} /> Account Settings
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && mounted && (
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Profile Overview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Identity & Credentials
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {admin?.name || "Administrator"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {admin?.email || "admin@system.io"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Privilege Level
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                      <ShieldCheck size={16} /> Super Administrator
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}
