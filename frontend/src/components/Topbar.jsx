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
  Check,
  CheckCheck,
  Send,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  // ==========================================
  // STATES
  // ==========================================

  const [openMenu, setOpenMenu] = useState(false);

  const [openMessages, setOpenMessages] = useState(false);

  const [openNotifications, setOpenNotifications] =
    useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
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
    if (
      localStorage.getItem("theme") === "dark"
    ) {
      document.documentElement.classList.add(
        "dark"
      );
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
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 transition-colors duration-300">

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />

        <input
          type="text"
          placeholder="Search students, teachers..."
          className="w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-3 pl-12 pr-5 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg"
        />
      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="flex items-center gap-4">

        {/* ====================================
            DARK MODE
        ==================================== */}

        <button
          onClick={toggleTheme}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
          title={
            darkMode
              ? "Light Mode"
              : "Dark Mode"
          }
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* ====================================
            MESSAGES
        ==================================== */}

        <div
          className="relative"
          ref={messageRef}
        >
          <button
            onClick={handleMessageClick}
            className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
            title="Messages"
          >
            <MessageCircle size={20} />

            {/* Online indicator */}

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-green-500" />
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

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white">

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

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white">

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

              <button
                onClick={() =>
                  setOpenMenu(false)
                }
                className="flex w-full items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <User size={18} />

                My Profile
              </button>

              {/* Settings */}

              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate(
                    "/settings"
                  );
                }}
                className="flex w-full items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Settings size={18} />

                Settings
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

    </header>
  );
}

export default Topbar;