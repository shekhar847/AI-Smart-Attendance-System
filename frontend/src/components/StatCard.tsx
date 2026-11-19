import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  change?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
  change = "+12%",
}: StatCardProps) {
  const isNegative = change.startsWith("-");

  // Map colors to clean enterprise icon badge styles
  const getBadgeStyle = () => {
    switch (color) {
      case "#2563EB":
      case "#2563eb":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40";
      case "#16A34A":
      case "#22C55E":
      case "#16a34a":
      case "#22c55e":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40";
      case "#EF4444":
      case "#ef4444":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#0e121b] p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h2>

          <div className="mt-2.5 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                isNegative
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isNegative ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
              {change}
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </div>
        </div>

        {/* Clean Enterprise Icon Badge (No glowing blur shadow) */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${getBadgeStyle()}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
