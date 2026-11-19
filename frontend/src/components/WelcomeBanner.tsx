"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Users, UserCheck } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-xl">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            👋 Welcome Back, Admin
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
            AI Smart Attendance System
          </h1>

          <p className="mt-4 text-blue-100 leading-7">
            Manage students, teachers and attendance with AI-powered face recognition from one modern dashboard.
          </p>

          <Link
            href="/reports"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition duration-300 hover:scale-105 shadow-md"
          >
            View Reports
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid w-full max-w-sm gap-4">
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users size={22} />
              </div>
              <div>
                <p className="text-xs text-blue-100 font-medium">Smart Enrolled</p>
                <p className="text-lg font-bold">Biometric DB</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-white/20 rounded-full font-bold">Active</span>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <UserCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-blue-100 font-medium">Anti-Spoofing</p>
                <p className="text-lg font-bold">Real-time AI</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-400/30 text-emerald-100 rounded-full font-bold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
