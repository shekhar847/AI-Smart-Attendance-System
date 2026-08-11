function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
        AI
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Smart Attendance
        </h1>

        <p className="text-sm text-slate-500">
          Face Recognition System
        </p>
      </div>
    </div>
  );
}

export default Logo;