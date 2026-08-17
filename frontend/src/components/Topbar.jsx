import { useState, useRef, useEffect } from "react";

import {
  Bell,
  Search,
  Moon,
  Sun,
  MessageCircle,
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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  // ==========================================
  // STATES
  // ==========================================

  const [openMenu, setOpenMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [openMessages, setOpenMessages] = useState(false);

  const [openNotifications, setOpenNotifications] =
    useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [messageText, setMessageText] = useState("");

  // ==========================================
  // REFS
  // ==========================================

  const menuRef = useRef(null);

  const messageRef = useRef(null);

  const notificationRef = useRef(null);

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Attendance Marked",
      message: "Shekhar Kumar attendance has been marked.",
      time: "Just now",
      read: false,
      type: "attendance",
    },
    {
      id: 2,
      title: "New Student Added",
      message: "A new student was added successfully.",
      time: "10 min ago",
      read: false,
      type: "student",
    },
    {
      id: 3,
      title: "Attendance Report",
      message: "Today's attendance report is ready.",
      time: "30 min ago",
      read: false,
      type: "report",
    },
  ]);

  // ==========================================
  // MESSAGES
  // ==========================================

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "System",
      message:
        "Welcome to AI Smart Attendance System.",
      time: "10:30 AM",
      own: false,
    },
    {
      id: 2,
      sender: "Admin",
      message:
        "Attendance system is working successfully.",
      time: "10:35 AM",
      own: false,
    },
  ]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/login");
  };

  // ==========================================
  // CLOSE ALL DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }

      if (
        messageRef.current &&
        !messageRef.current.contains(e.target)
      ) {
        setOpenMessages(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, []);

  // ==========================================
  // LOAD SAVED THEME
  // ==========================================

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      if (!localStorage.getItem("theme")) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  // ==========================================
  // TOGGLE THEME
  // ==========================================

  const toggleTheme = () => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    } else {
      html.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    setDarkMode(!darkMode);
  };

  // ==========================================
  // OPEN MESSAGE PANEL
  // ==========================================

  const handleMessageClick = () => {
    setOpenMessages(!openMessages);

    setOpenNotifications(false);
    setOpenMenu(false);
  };

  // ==========================================
  // OPEN NOTIFICATION PANEL
  // ==========================================

  const handleNotificationClick = () => {
    setOpenNotifications(
      !openNotifications
    );

    setOpenMessages(false);
    setOpenMenu(false);
  };

  // ==========================================
  // UNREAD NOTIFICATION COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read
  ).length;

  // ==========================================
  // MARK SINGLE NOTIFICATION AS READ
  // ==========================================

  const markNotificationRead = (id) => {
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
  };

  // ==========================================
  // MARK ALL NOTIFICATIONS AS READ
  // ==========================================

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSendMessage = () => {
    const text = messageText.trim();

    if (!text) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender:
        admin?.name || "Admin",
      message: text,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      own: true,
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setMessageText("");
  };

  // ==========================================
  // ENTER KEY SEND MESSAGE
  // ==========================================

  const handleMessageKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f19]/80 px-8 py-3.5 backdrop-blur-xl transition-all duration-300">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search students, classes, records..."
          className="w-80 md:w-96 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-2.5 pl-11 pr-14 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
        />
        <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions & Status Pills */}
      <div className="flex items-center gap-3">
        {/* System Online Status Pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Online
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 p-2.5 transition-all duration-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-105"
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-indigo-600" />
          )}
        </button>

        {/* Messages Toggle */}
        <div className="relative" ref={messageRef}>
          <button
            onClick={handleMessageClick}
            className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 p-2.5 transition-all duration-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-105"
            title="Messages"
          >
            <MessageCircle size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* ==================================
              MESSAGE PANEL
          ================================== */}

          {openMessages && (
            <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Messages
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Admin communication
                  </p>
                </div>

                <button
                  onClick={() =>
                    setOpenMessages(false)
                  }
                  className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Messages */}

              <div className="max-h-80 space-y-3 overflow-y-auto p-4">

                {messages.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.own
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.own
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        }`}
                      >

                        {!message.own && (
                          <p className="mb-1 text-xs font-semibold">
                            {message.sender}
                          </p>
                        )}

                        <p className="text-sm">
                          {message.message}
                        </p>

                        <p
                          className={`mt-1 text-[10px] ${
                            message.own
                              ? "text-blue-100"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {message.time}
                        </p>

                      </div>
                    </div>
                  ))
                )}

              </div>

              {/* Send Message */}

              <div className="border-t border-slate-200 dark:border-slate-800 p-4">

                <div className="flex items-center gap-2">

                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) =>
                      setMessageText(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleMessageKeyDown
                    }
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={
                      handleSendMessage
                    }
                    className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                    title="Send"
                  >
                    <Send size={18} />
                  </button>

                </div>

              </div>

            </div>
          )}
        </div>

        {/* ====================================
            NOTIFICATIONS
        ==================================== */}

        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            onClick={
              handleNotificationClick
            }
            className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
            title="Notifications"
          >
            <Bell size={20} />

            {/* Notification Badge */}

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ==================================
              NOTIFICATION PANEL
          ================================== */}

          {openNotifications && (
            <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unreadCount} unread
                  </p>
                </div>

                <button
                  onClick={
                    markAllNotificationsRead
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <CheckCheck
                    size={15}
                  />

                  Mark all read
                </button>

              </div>

              {/* Notifications */}

              <div className="max-h-96 overflow-y-auto">

                {notifications.length ===
                0 ? (
                  <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                    No notifications.
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification.id
                        }
                        onClick={() =>
                          markNotificationRead(
                            notification.id
                          )
                        }
                        className={`flex w-full gap-3 border-b border-slate-100 dark:border-slate-800/60 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          !notification.read
                            ? "bg-blue-50/50 dark:bg-blue-950/30"
                            : "bg-white dark:bg-slate-900"
                        }`}
                      >

                        {/* Icon */}

                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            notification.type ===
                            "attendance"
                              ? "bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400"
                              : notification.type ===
                                "student"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {notification.type ===
                          "attendance"
                            ? "✓"
                            : notification.type ===
                              "student"
                            ? "👤"
                            : "📊"}
                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                              {
                                notification.title
                              }
                            </h4>

                            {!notification.read && (
                              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                            )}

                          </div>

                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {
                              notification.message
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            {
                              notification.time
                            }
                          </p>

                        </div>

                      </button>
                    )
                  )
                )}

              </div>

              {/* Footer */}

              <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-center">

                <button
                  onClick={() => {
                    setOpenNotifications(
                      false
                    );

                    navigate(
                      "/notifications"
                    );
                  }}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View all notifications
                </button>

              </div>

            </div>
          )}
        </div>

        {/* ====================================
            ADMIN DROPDOWN
        ==================================== */}

        <div
          className="relative"
          ref={menuRef}
        >

          <button
            onClick={() =>
              setOpenMenu(!openMenu)
            }
            className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2 transition hover:shadow-lg text-slate-800 dark:text-slate-100"
          >

            <div className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">

              {admin?.name
                ?.charAt(0)
                .toUpperCase() || "A"}

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {admin?.name ||
                  "Administrator"}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {admin?.email ||
                  "admin@gmail.com"}
              </p>

            </div>

            <ChevronDown
              size={18}
              className={`transition duration-300 ${
                openMenu
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* ==================================
              ADMIN MENU
          ================================== */}

          {openMenu && (
            <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-slate-800 dark:text-slate-100">

              {/* Profile */}

              <div className="border-b border-slate-200 dark:border-slate-800 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md">

                    {admin?.name
                      ?.charAt(0)
                      .toUpperCase() ||
                      "A"}

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {admin?.name ||
                        "Administrator"}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {admin?.email ||
                        "admin@gmail.com"}
                    </p>

                  </div>

                </div>

              </div>

              {/* My Profile */}

              {/* My Profile */}
              <button
                onClick={() => {
                  setOpenMenu(false);
                  setShowProfileModal(true);
                }}
                className="flex w-full items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <User size={18} />
                My Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-5 py-4 text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MY PROFILE MODAL
      ========================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all text-slate-800 dark:text-slate-100">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Sparkles size={14} />
              Admin Profile Card
            </div>

            {/* Profile Card Center */}
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-3xl font-extrabold text-white shadow-xl ring-4 ring-blue-500/20">
                {admin?.name?.charAt(0).toUpperCase() || "A"}
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {admin?.name || "Administrator"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail size={15} />
                {admin?.email || "admin@gmail.com"}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                <ShieldCheck size={14} />
                System Administrator
              </div>
            </div>

            {/* Profile Details List */}
            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Account Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-slate-200/50 dark:border-slate-700/50 pt-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Access Level</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Full Super Admin</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-slate-200/50 dark:border-slate-700/50 pt-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">AI Microservice</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Connected</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  navigate("/settings");
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-all"
              >
                <Settings size={16} />
                Account Settings
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}

export default Topbar;