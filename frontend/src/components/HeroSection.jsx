import {
  BrainCircuit,
  ScanFace,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function HeroSection() {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center px-8 relative">
      <div className="max-w-xl z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6 backdrop-blur-md">
          <Sparkles size={14} className="animate-spin text-cyan-400" />
          Next-Gen AI Facial Telemetry v2.4
        </div>

        <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
          Smart <span className="gradient-text">Attendance</span> System
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          High-performance facial recognition OS engineered for universities & modern enterprises. Real-time anti-spoofing verification with instant logging.
        </p>

        <div className="mt-8 space-y-4">
          <div className="group flex items-center gap-4 rounded-2xl glass-card p-4 transition-all duration-300 hover:scale-[1.02] border border-white/40 dark:border-slate-800/80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Neural AI Recognition
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                99.4% accuracy rate powered by deep biometric embeddings
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl glass-card p-4 transition-all duration-300 hover:scale-[1.02] border border-white/40 dark:border-slate-800/80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-md shadow-cyan-500/20">
              <ScanFace size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Live Video Feed Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Multi-camera stream analysis with automatic logging
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl glass-card p-4 transition-all duration-300 hover:scale-[1.02] border border-white/40 dark:border-slate-800/80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Instant Analytics & PDF Export
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Automated monthly reports and export to Excel/PDF
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;