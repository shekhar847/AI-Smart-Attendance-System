import {
  BrainCircuit,
  ScanFace,
  ChartNoAxesColumn,
} from "lucide-react";

function HeroSection() {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center px-12">

      <div className="max-w-xl">

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          AI Powered Platform
        </span>

        <h1 className="mt-6 text-6xl font-extrabold leading-tight text-slate-900">
          Smart
          <span className="block text-blue-600">
            Attendance
          </span>
          System
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Face Recognition based attendance system
          designed for schools, colleges and universities.
        </p>

        <div className="mt-10 space-y-4">

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">

            <div className="rounded-xl bg-blue-100 p-3">
              <BrainCircuit className="text-blue-600" />
            </div>

            <div>
              <h3 className="font-semibold">
                AI Recognition
              </h3>

              <p className="text-sm text-slate-500">
                Accurate facial recognition
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">

            <div className="rounded-xl bg-green-100 p-3">
              <ScanFace className="text-green-600" />
            </div>

            <div>
              <h3 className="font-semibold">
                Live Detection
              </h3>

              <p className="text-sm text-slate-500">
                Real-time attendance capture
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">

            <div className="rounded-xl bg-purple-100 p-3">
              <ChartNoAxesColumn className="text-purple-600" />
            </div>

            <div>
              <h3 className="font-semibold">
                Analytics
              </h3>

              <p className="text-sm text-slate-500">
                Powerful attendance reports
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroSection;