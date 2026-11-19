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
          icon: <UserCheck size={18} />,
          to: "/student-portal",
        },
        {
          title: "Parent Alerts",
          icon: <BellRing size={18} />,
          to: "/student-portal?tab=alerts",
        },
      ];
    }

    if (role === "teacher") {
      return [
        {
          title: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          to: "/dashboard",
        },
        {
          title: "Students",
          icon: <Users size={18} />,
          to: "/students",
        },
        {
          title: "Attendance",
          icon: <Camera size={18} />,
          to: "/attendance",
        },
        {
          title: "Reports",
          icon: <BarChart3 size={18} />,
          to: "/reports",
        },
      ];
    }

    // Default Admin
    return [
      {
        title: "Dashboard",
        icon: <LayoutDashboard size={18} />,
        to: "/dashboard",
      },
      {
        title: "Students",
        icon: <Users size={18} />,
        to: "/students",
      },
      {
        title: "Teachers",
        icon: <GraduationCap size={18} />,
        to: "/teachers",
      },
      {
        title: "Attendance",
        icon: <Camera size={18} />,
        to: "/attendance",
      },
      {
        title: "Surveillance",
        icon: <Video size={18} />,
        to: "/cameras",
      },
      {
        title: "Reports",
        icon: <BarChart3 size={18} />,
        to: "/reports",
      },
      {
        title: "Parent Alerts",
        icon: <BellRing size={18} />,
        to: "/alert-settings",
      },
      {
        title: "Settings",
        icon: <Settings size={18} />,
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
      {/* Top Header & Navigation Container */}
      <div className="flex flex-col">
        {/* Header / Brand */}
        <div className="flex h-13 items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              AI
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SmartAttend
                <span className="rounded-full bg-blue-500/10 dark:bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-bold text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20">
                  v2.4
                </span>
              </h2>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                FACIAL TELEMETRY
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Role Tag */}
        <div className="mx-3 mt-1.5 mb-1 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {role} Account
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
            {user?.name || "Verified"}
          </span>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-1">
          <p className="px-2 pb-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            System Modules
          </p>

          <nav className="space-y-0.5">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={index}
                  href={item.to}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <span
                    className={`transition-transform duration-150 group-hover:scale-105 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-cyan-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-[13.5px] leading-tight">{item.title}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area with System Status & Logout */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5 bg-slate-50/50 dark:bg-[#0b0f19]/80 mt-auto">
        <div className="rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 px-2.5 py-1.5 border border-indigo-500/20 dark:border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-500 animate-spin" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
              AI Core Online
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-bold">
            18ms
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors duration-150"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
