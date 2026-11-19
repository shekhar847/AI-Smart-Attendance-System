"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Camera,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Video,
  X,
  BellRing,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<string>("admin");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role") || "admin";
    setRole(savedRole);
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (_) {}
    }
  }, []);

  const getMenuItems = () => {
    if (role === "student") {
      return [
        {
          title: "My Attendance",
          icon: <UserCheck size={19} />,
          to: "/student-portal",
        },
        {
          title: "Parent Alerts",
          icon: <BellRing size={19} />,
          to: "/student-portal?tab=alerts",
        },
      ];
    }

    if (role === "teacher") {
      return [
        {
          title: "Dashboard",
          icon: <LayoutDashboard size={19} />,
          to: "/dashboard",
        },
        {
          title: "Students",
          icon: <Users size={19} />,
          to: "/students",
        },
        {
          title: "Attendance",
          icon: <Camera size={19} />,
          to: "/attendance",
        },
        {
          title: "Reports",
          icon: <BarChart3 size={19} />,
          to: "/reports",
        },
      ];
    }

    // Default Admin
    return [
      {
        title: "Dashboard",
        icon: <LayoutDashboard size={19} />,
        to: "/dashboard",
      },
      {
        title: "Students",
        icon: <Users size={19} />,
        to: "/students",
      },
      {
        title: "Teachers",
        icon: <GraduationCap size={19} />,
        to: "/teachers",
      },
      {
        title: "Attendance",
        icon: <Camera size={19} />,
        to: "/attendance",
      },
      {
        title: "Surveillance",
        icon: <Video size={19} />,
        to: "/cameras",
      },
      {
        title: "Reports",
        icon: <BarChart3 size={19} />,
        to: "/reports",
      },
      {
        title: "Parent Alerts",
        icon: <BellRing size={19} />,
        to: "/alert-settings",
      },
      {
        title: "Settings",
        icon: <Settings size={19} />,
        to: "/settings",
      },
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    router.replace("/login");
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Brand & Navigation */}
      <div>
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c8f135] to-[#a3e635] text-slate-950 font-black text-lg shadow-lg shadow-[#c8f135]/30 group-hover:scale-105 transition-transform duration-200">
              AI
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8f135] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c8f135]"></span>
              </span>
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SmartAttend
                <span className="rounded-full bg-[#c8f135]/15 px-2 py-0.5 text-[10px] font-bold text-[#a6d81e] dark:text-[#c8f135] border border-[#c8f135]/30">
                  v2.4
                </span>
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                FACIAL TELEMETRY
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Role Tag */}
        <div className="mx-4 mt-3 mb-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#c8f135] animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {role} Account
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
            {user?.name || "Verified"}
          </span>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            System Modules
          </p>

          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={index}
                  href={item.to}
                  onClick={onClose}
                  className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#c8f135] text-slate-950 shadow-md shadow-[#c8f135]/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-slate-950" : "text-slate-400 dark:text-slate-500 group-hover:text-[#c8f135]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.title}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-slate-950 animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area with System Status & Logout */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2.5 bg-slate-50/50 dark:bg-[#0b0f19]/80">
        <div className="rounded-xl bg-gradient-to-br from-[#c8f135]/10 via-[#a3e635]/5 to-transparent p-3 border border-[#c8f135]/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-[#c8f135] animate-spin" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a6d81e] dark:text-[#c8f135]">
              AI Core Status
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Biometric Neural Engine is Online. Latency: 18ms
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
