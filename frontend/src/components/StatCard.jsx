import { TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  icon,
  color = "#6366f1",
  change = "+12%",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/30">
      {/* Background Accent Glow on Hover */}
      <div 
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10 blur-xl transition-all duration-300 group-hover:opacity-25 group-hover:scale-150"
        style={{ background: color }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h2>

          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={11} /> {change || "+8%"}
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </div>
        </div>

        {/* Gradient Icon Badge */}
        <div
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            boxShadow: `0 8px 20px -6px ${color}88`,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;