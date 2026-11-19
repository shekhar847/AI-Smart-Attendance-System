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
  Video,
  X,
  BellRing,
  UserCheck,
  ShieldCheck,
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
      className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e121b] transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Header & Navigation Container */}
      <div className="flex flex-col">
        {/* Header / Brand */}
        <div className="flex h-15 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  SmartAttend
                </h2>
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.2 text-[9px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-normal">
                Enterprise Attendance
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
        <div className="mx-3 mt-2 mb-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {role} Account
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
            {user?.name || "Shekhar"}
          </span>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-1.5">
          <p className="px-2 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <span
                    className={`transition-colors duration-150 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-[13.5px] leading-tight">{item.title}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area with System Status & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 bg-slate-50/70 dark:bg-[#0c1017] mt-auto">
        <div className="rounded-lg bg-white dark:bg-slate-800/60 px-3 py-2 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Camera Service
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Connected
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors duration-150"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
