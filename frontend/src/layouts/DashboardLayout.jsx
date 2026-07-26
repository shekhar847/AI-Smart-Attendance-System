import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Sidebar */}

      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      {/* Content */}

      <div className="ml-72 flex flex-1 flex-col">

        {/* Topbar */}

        <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200">
          <Topbar />
        </div>

        {/* Main */}

        <main className="flex-1 p-8">

          <div className="mx-auto max-w-[1700px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;