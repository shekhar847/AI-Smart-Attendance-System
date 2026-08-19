import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/notifications/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // MARK SINGLE AS READ
  // ==========================================

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark all notifications"
        );
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete notification"
        );
      }

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete notification error:",
        err
      );
    }
  };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // ==========================================
  // NOTIFICATION TYPE STYLE
  // ==========================================

  const getTypeStyle = (type) => {
    switch (type) {
      case "attendance":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: "✓",
        };

      case "student":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: "👤",
        };

      case "report":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          icon: "📊",
        };

      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-600",
          icon: "🔔",
        };
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <DashboardLayout>
      <div className="text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-3 transition hover:-translate-y-0.5 hover:shadow-md"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Bell size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h1>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Stay updated with system activity
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ==================================
              ACTIONS
          ================================== */}

          <div className="flex items-center gap-3">

            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:shadow-md"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={markAllAsRead}
              disabled={
                markingAll ||
                unreadCount === 0
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={17} />

              {markingAll
                ? "Marking..."
                : "Mark all read"}
            </button>

          </div>

        </div>

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Notifications
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {notifications.length}
            </h2>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unread
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unreadCount}
            </h2>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Read
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {notifications.length -
                unreadCount}
            </h2>

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/60 p-4 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600 dark:text-blue-400"
            />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading notifications...
            </p>

          </div>
        ) : notifications.length === 0 ? (

          /* ====================================
             EMPTY
          ==================================== */

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <Bell size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800 dark:text-slate-100">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You don't have any notifications yet.
            </p>

          </div>

        ) : (

          /* ====================================
             NOTIFICATION LIST
          ==================================== */

          <div className="space-y-4">

            {notifications.map(
              (notification) => {
                const style =
                  getTypeStyle(
                    notification.type
                  );

                return (
                  <div
                    key={notification.id}
                    className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                      notification.read
                        ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        : "border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30"
                    }`}
                  >

                    <div className="flex gap-4">

                      {/* ICON */}

                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${style.bg} ${style.text}`}
                      >
                        {style.icon}
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-start justify-between gap-3">

                          <div>

                            <div className="flex items-center gap-2">

                              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                {notification.title}
                              </h3>

                              {!notification.read && (
                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                  NEW
                                </span>
                              )}

                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                              {formatDate(
                                notification.created_at
                              )}
                            </p>

                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-2">

                            {!notification.read && (
                              <button
                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/40"
                              >
                                <Check
                                  size={15}
                                />
                                Mark read
                              </button>
                            )}

                            <button
                              onClick={() =>
                                deleteNotification(
                                  notification.id
                                )
                              }
                              className="rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800 p-2 text-red-500 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  </DashboardLayout>
);
}

export default Notifications;