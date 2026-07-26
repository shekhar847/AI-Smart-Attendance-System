function StatCard({
  title,
  value,
  icon,
  color,
  change = "+0%",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-5xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-4 text-sm font-medium text-emerald-600">
            ↑ {change} this month
          </p>

        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition duration-300 group-hover:scale-110"
          style={{ background: color }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;