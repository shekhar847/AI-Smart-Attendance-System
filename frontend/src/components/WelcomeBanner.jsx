import {
  ArrowRight,
  CalendarDays,
  Users,
  UserCheck,
} from "lucide-react";

function WelcomeBanner() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-xl">

      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">

        {/* Left */}

        <div className="max-w-2xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            👋 Welcome Back, Admin
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
            AI Smart Attendance System
          </h1>

          <p className="mt-4 text-blue-100 leading-7">
            Manage students, teachers and attendance with AI powered
            face recognition from one modern dashboard.
          </p>

          <button className="mt-8 flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition duration-300 hover:scale-105">

            View Reports

            <ArrowRight size={18} />

          </button>

        </div>

        {/* Right */}

        <div className="grid w-full max-w-sm gap-4">

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-blue-100 text-sm">
                  Today's Attendance
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  94%
                </h2>

              </div>

              <CalendarDays size={34} />

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

              <Users size={26} />

              <p className="mt-3 text-sm text-blue-100">
                Students
              </p>

              <h3 className="text-2xl font-bold">
                1250
              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

              <UserCheck size={26} />

              <p className="mt-3 text-sm text-blue-100">
                Present
              </p>

              <h3 className="text-2xl font-bold">
                1180
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default WelcomeBanner;