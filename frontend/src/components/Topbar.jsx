import {
  Bell,
  Search,
  Moon,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-xl">

      {/* Left */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search students, teachers..."
          className="w-96 rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-5 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:shadow-lg"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        {/* Dark Mode */}

        <button className="rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">

          <Moon size={20} />

        </button>

        {/* Messages */}

        <button className="relative rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">

          <MessageCircle size={20} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>

        </button>

        {/* Notifications */}

        <button className="relative rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">

          <Bell size={20} />

          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>

        </button>

        {/* Profile */}

        <div className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 transition hover:shadow-lg">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white">

            A

          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              Admin
            </h3>

            <p className="text-xs text-slate-500">
              Administrator
            </p>

          </div>

          <ChevronDown size={18} className="text-slate-400" />

        </div>

      </div>

    </header>
  );
}

export default Topbar;