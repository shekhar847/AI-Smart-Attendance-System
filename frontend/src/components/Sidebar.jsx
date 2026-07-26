import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Camera,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    to: "/dashboard",
  },
  {
    title: "Students",
    icon: <Users size={20} />,
    to: "/students",
  },
  {
    title: "Teachers",
    icon: <GraduationCap size={20} />,
    to: "/teachers",
  },
  {
    title: "Attendance",
    icon: <Camera size={20} />,
    to: "/attendance",
  },
  {
    title: "Reports",
    icon: <BarChart3 size={20} />,
    to: "/reports",
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    to: "/settings",
  },
];

function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-slate-50">

      {/* Logo */}

      <div className="border-b border-slate-200 px-7 py-7">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

            <Sparkles size={26} className="text-white" />

          </div>

          <div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
              AI Attendance
            </h1>

            <p className="text-sm text-slate-500">
              Smart Admin Panel
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => (
            <MenuItem
              key={item.to}
              icon={item.icon}
              title={item.title}
              to={item.to}
            />
          ))}

        </div>

      </nav>

      {/* Bottom */}

      <div className="border-t border-slate-200 p-5">

        <div className="mb-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white shadow">

          <p className="text-xs uppercase tracking-widest opacity-80">
            AI SYSTEM
          </p>

          <h3 className="mt-1 text-lg font-bold">
            Smart Attendance
          </h3>

          <p className="mt-2 text-sm text-blue-100">
            Face Recognition Enabled
          </p>

        </div>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-500 transition-all duration-300 hover:bg-red-50">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}

function MenuItem({ icon, title, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl"
            : "text-slate-600 hover:bg-white hover:shadow-md"
        }`
      }
    >
      <div className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <span className="font-semibold">
        {title}
      </span>
    </NavLink>
  );
}

export default Sidebar;