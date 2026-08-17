import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      {/* Background Ambient Glow Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-blue-600/10 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-400/10 dark:bg-indigo-600/10 blur-[130px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-72">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="relative z-10 ml-72 flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl transition-colors duration-300">
          <Topbar />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;