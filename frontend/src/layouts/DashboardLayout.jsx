import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-72">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="ml-72 flex min-h-screen flex-1 flex-col">

        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors duration-300">
          <Topbar />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;