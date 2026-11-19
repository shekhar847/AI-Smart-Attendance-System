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
  X,
  ShieldCheck,
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
      title: "Attendance Recorded",
      message: "Student verified successfully via camera node.",
      time: "Just now",
      read: false,
      type: "attendance",
    },
    {
      id: 2,
      title: "New Student Enrolled",
      message: "Biometric profile created and verified.",
      time: "10 min ago",
      read: false,
      type: "student",
    },
    {
      id: 3,
      title: "Camera Feed Active",
      message: "Entrance Camera Node 1 streaming successfully.",
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
    <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="relative hidden md:block w-72 lg:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search students, faculty, records..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-[#0e121b] focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          {darkMode ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#0e121b] border border-slate-200 dark:border-slate-800 p-4 shadow-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <span className="rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg transition ${
                      item.read
                        ? "bg-transparent text-slate-500 dark:text-slate-400"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setOpenNotifications(false)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1.5 pr-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs shadow-sm">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                {admin?.name || "Shekhar"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {admin?.email || "admin@system.io"}
              </p>
            </div>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#0e121b] border border-slate-200 dark:border-slate-800 p-1.5 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {admin?.name || "Shekhar"}
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
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <User size={14} /> My Profile
                </button>

                <Link
                  href="/settings"
                  onClick={() => setOpenMenu(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Settings size={14} /> Account Settings
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && mounted && (
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0e121b] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Profile Overview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Identity & Account
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {admin?.name || "Shekhar"}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {admin?.email || "shekhar32542@gmail.com"}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Privilege Level
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                      <ShieldCheck size={15} /> Super Administrator
                    </p>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-sm"
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
