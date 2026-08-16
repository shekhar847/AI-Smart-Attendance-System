import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../api/adminApi";

function Settings() {
  const admin = JSON.parse(localStorage.getItem("admin"));

  const [name, setName] = useState(admin?.name || "");
  const [email] = useState(admin?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await changePassword({

        email: admin.email,
        current_password: currentPassword,
        new_password: newPassword,

      });

      alert("Password Changed Successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Something went wrong"
      );

    }

  };

  return (
    <DashboardLayout>

      <PageTitle
        title="Settings"
        subtitle="Manage your account settings"
      />

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Profile */}

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg text-slate-800 dark:text-slate-100">

          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Admin Profile
          </h2>

          <div className="mb-6 flex justify-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-3xl font-bold text-white shadow-lg">

              {name.charAt(0).toUpperCase()}

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <User size={18} />
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 outline-none focus:border-blue-600"
              />

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <Mail size={18} />
                Email
              </label>

              <input
                value={email}
                disabled
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-4 py-3 cursor-not-allowed"
              />

            </div>

          </div>

        </div>

        {/* Password */}

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg text-slate-800 dark:text-slate-100">

          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Change Password
          </h2>

          <div className="space-y-5">

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <Lock size={18} />
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 pr-12 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <Lock size={18} />
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 pr-12 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <Lock size={18} />
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 pr-12 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>

            <button
              onClick={handleSave}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:opacity-90 shadow-lg"
            >
              <Save size={18} />
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Settings;