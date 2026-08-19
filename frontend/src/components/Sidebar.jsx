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
  Activity,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
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
    title: "Cameras",
    icon: <Video size={19} />,
    to: "/cameras",
  },
  {
    title: "Reports",
    icon: <BarChart3 size={19} />,
    to: "/reports",
  },
  {
    title: "Settings",
    icon: <Settings size={19} />,
    to: "/settings",
  },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className={`fixed left-0 top-0 flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl transition-transform duration-300 shadow-xl z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/25">
            <Sparkles size={22} className="text-white animate-pulse" />
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-30 blur-sm" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>AI</span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Attendance
              </span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Smart Vision OS v2.4
            </p>
          </div>
        </div>

        {/* Close Button on Mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            title="Close Navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation Menu
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <MenuItem
              key={item.to}
              icon={item.icon}
              title={item.title}
              to={item.to}
              onClick={onClose}
            />
          ))}
        </div>
      </nav>

      {/* AI Live Engine Badge & Logout */}
      <div className="mt-auto border-t border-slate-200/70 dark:border-slate-800/70 p-4 space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 p-4 text-white shadow-lg shadow-indigo-500/20">
          <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              <Activity size={10} className="animate-spin" /> Live Scan
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <h3 className="mt-2 text-sm font-extrabold tracking-wide">
            Face AI Detection Active
          </h3>
          <p className="mt-0.5 text-xs text-blue-100/90 font-medium">
            99.4% Recognition Accuracy
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
        >
          <LogOut size={19} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, title, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={() => {
        if (onClick && window.innerWidth < 1024) {
          onClick();
        }
      }}
      className={({ isActive }) =>
        `group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
            {icon}
          </div>
          <span className="tracking-wide">{title}</span>
          {isActive && (
            <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white shadow-sm animate-pulse" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;