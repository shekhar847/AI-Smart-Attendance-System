function StatCard({
  title,
  value,
  icon,
  color,
  change = "+0%",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </h2>

          <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            ↑ {change} this month
          </p>
        </div>

        <div
          className="flex h-12 w-12 shrink-0 aspect-square items-center justify-center rounded-2xl text-white shadow-md transition duration-300 group-hover:scale-110"
          style={{ background: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;