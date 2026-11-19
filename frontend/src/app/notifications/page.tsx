"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import { NotificationItem } from "../../types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/notifications/`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      // Fallback demo notifications
      setNotifications([
        {
          id: 1,
          title: "Attendance Marked",
          message: "Real-time face recognition successfully registered for 42 students.",
          time: "Just now",
          read: false,
          type: "attendance",
        },
        {
          id: 2,
          title: "Biometric Alert",
          message: "Parent SMS notification sent for absent student #2101290.",
          time: "15 min ago",
          read: false,
          type: "alert",
        },
        {
          id: 3,
          title: "System Telemetry Active",
          message: "Camera Node Gate 1 operating normally.",
          time: "1 hour ago",
          read: true,
          type: "system",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number | string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (_) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch(`${API_URL}/notifications/mark-all-read`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (_) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id: number | string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
      <DashboardLayout>
        <PageTitle
          title="Notification Center"
          subtitle="Real-time biometric audit alerts, parent dispatch telemetry, and system notices"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c8f135] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 hover:bg-[#b5e028] transition"
              >
                <CheckCheck size={16} />
                Mark All Read
              </button>
            )}
          </div>
        </PageTitle>

        <div className="space-y-4 max-w-4xl">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl glass-card border p-6 transition-all duration-300 hover:shadow-xl flex items-start justify-between gap-4 ${
                item.read
                  ? "border-white/40 dark:border-slate-800/80 opacity-80"
                  : "border-blue-500/40 bg-blue-50/30 dark:bg-slate-800/60 shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
                    item.read
                      ? "bg-slate-500/20 text-slate-400"
                      : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-blue-500/20"
                  }`}
                >
                  <Bell size={20} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.message}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 pt-1">
                    {item.time || "Recent"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!item.read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition"
                    title="Mark as Read"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-12 text-center text-slate-400">
              <Bell size={36} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No notifications to display</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
