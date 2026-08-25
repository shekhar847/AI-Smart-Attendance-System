import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle, X, Shield, GraduationCap, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginTeacher, loginStudent, requestForgotPassword, resetPassword } from "../../api/authApi";

import HeroSection from "../../components/HeroSection";
import Logo from "../../components/Logo";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const parseErrorMessage = (err, defaultMsg) => {
  if (!err) return defaultMsg;
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(", ");
  }
  if (detail && typeof detail === "object") {
    return detail.message || detail.msg || JSON.stringify(detail);
  }
  if (err.message === "Network Error" || !err.response) {
    return "Cannot connect to backend server. Please check backend server status.";
  }
  return err.message || defaultMsg;
};

function Login() {
  const navigate = useNavigate();

  // Role state: "admin" | "teacher" | "student"
  const [activeRole, setActiveRole] = useState("admin");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const handleLogin = async () => {
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setError("Email/ID and Password are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      let res;
      if (activeRole === "admin") {
        res = await loginAdmin({ email: cleanId, password });
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("user", JSON.stringify(res.data.user || res.data.admin));
        navigate("/dashboard");
      } else if (activeRole === "teacher") {
        res = await loginTeacher(cleanId, password);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user_role", "teacher");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        res = await loginStudent(cleanId, password);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user_role", "student");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/student-portal");
      }
    } catch (err) {
      setError(parseErrorMessage(err, "Login Failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = () => {
    setShowForgotModal(true);
    setForgotStep(1);
    setResetEmail(identifier.trim() || "");
    setResetToken("");
    setNewPassword("");
    setShowNewPassword(false);
    setModalError("");
    setModalSuccess("");
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    if (!cleanEmail) {
      setModalError("Please enter your registered email");
      return;
    }
    setModalLoading(true);
    setModalError("");
    setModalSuccess("");

    try {
      const res = await requestForgotPassword(cleanEmail);
      setModalSuccess(res.data.message || "Reset code generated!");
      if (res.data.reset_token) {
        setResetToken(String(res.data.reset_token));
      }
      setForgotStep(2);
    } catch (err) {
      setModalError(parseErrorMessage(err, "Failed to process forgot password request"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    const cleanToken = resetToken.trim();
    if (!cleanToken || !newPassword) {
      setModalError("Verification code and new password are required");
      return;
    }
    setModalLoading(true);
    setModalError("");
    setModalSuccess("");

    try {
      const res = await resetPassword(cleanEmail, cleanToken, newPassword);
      setModalSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        setIdentifier(cleanEmail);
        setPassword(newPassword);
        setShowForgotModal(false);
      }, 2000);
    } catch (err) {
      setModalError(parseErrorMessage(err, "Password reset failed"));
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        <HeroSection />

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="w-full max-w-md">
            <Card>
              <Logo />

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                AI Smart Attendance Portal
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Select your role to log into your dedicated workspace
              </p>

              {/* Role Selection Tabs */}
              <div className="mt-6 grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/80 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => { setActiveRole("admin"); setError(""); }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "admin"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Shield size={16} className="mb-1" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("teacher"); setError(""); }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "teacher"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <GraduationCap size={16} className="mb-1" />
                  <span>Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("student"); setError(""); }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "student"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <UserCheck size={16} className="mb-1" />
                  <span>Student/Parent</span>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {activeRole === "admin"
                      ? "Admin Email Address"
                      : activeRole === "teacher"
                      ? "Teacher Email or Employee ID"
                      : "Student Roll Number or Email"}
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      activeRole === "admin"
                        ? "admin@gmail.com"
                        : activeRole === "teacher"
                        ? "teacher@gmail.com or EMP001"
                        : "Roll No. e.g. CS101 or email"
                    }
                    icon={Mail}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        activeRole === "admin"
                          ? "Enter your admin password"
                          : activeRole === "teacher"
                          ? "Enter password (Default: Employee ID)"
                          : "Enter password (Default: Roll Number)"
                      }
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-100 dark:bg-red-950/60 p-3 text-center text-red-700 dark:text-red-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={handleOpenForgot}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button onClick={handleLogin} disabled={loading}>
                  {loading
                    ? "Authenticating..."
                    : `Login as ${activeRole.toUpperCase()} →`}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Forgot Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle size={18} />
                <span>{modalSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestCode} className="mt-4 space-y-4">
                <p className="text-sm text-slate-600">
                  Enter your registered email address below to receive a password reset verification code.
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="user@gmail.com"
                    icon={Mail}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <Button disabled={modalLoading}>
                    {modalLoading ? "Sending Code..." : "Send Verification Code"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="mt-4 space-y-4">
                <p className="text-sm text-slate-600">
                  A verification code has been generated for <span className="font-semibold text-slate-900">{resetEmail}</span>.
                </p>

                {resetToken && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                    <span className="font-semibold">Your Reset Code: </span>
                    <span className="font-mono text-base font-bold tracking-widest text-blue-900">{resetToken}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    6-Digit Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    icon={KeyRound}
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      icon={Lock}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    ← Change Email
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <Button disabled={modalLoading}>
                      {modalLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;