import React from "react";
import {
  BrainCircuit,
  ScanFace,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center px-8 relative">
      <div className="max-w-xl z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c8f135]/30 bg-[#c8f135]/10 px-4 py-1.5 text-xs font-bold text-[#a6d81e] dark:text-[#c8f135] mb-6 backdrop-blur-md">
          <Sparkles size={14} className="animate-spin text-[#c8f135]" />
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8f135] to-[#a3e635] text-slate-950 font-black shadow-md shadow-[#c8f135]/25">
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8f135] to-[#84cc16] text-slate-950 font-black shadow-md shadow-[#c8f135]/25">
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#a3e635] to-[#65a30d] text-slate-950 font-black shadow-md shadow-[#c8f135]/25">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Instant Analytics & Logs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Export comprehensive Excel and PDF reports in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
