"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  X,
  Shield,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  loginAdmin,
  loginTeacher,
  loginStudent,
  requestForgotPassword,
  resetPassword,
} from "../../api/authApi";

import HeroSection from "../../components/HeroSection";
import Logo from "../../components/Logo";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const parseErrorMessage = (err: any, defaultMsg: string): string => {
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

export default function LoginPage() {
  const router = useRouter();

  // Role state: "admin" | "teacher" | "student"
  const [activeRole, setActiveRole] = useState<"admin" | "teacher" | "student">("admin");

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
        router.push("/dashboard");
      } else if (activeRole === "teacher") {
        res = await loginTeacher(cleanId, password);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user_role", "teacher");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/dashboard");
      } else {
        res = await loginStudent(cleanId, password);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user_role", "student");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/student-portal");
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

  const handleRequestOTP = async () => {
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
      setModalSuccess(res.data.message || "OTP sent successfully! Please check your email.");
      setForgotStep(2);
    } catch (err) {
      setModalError(parseErrorMessage(err, "Failed to request password reset"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const cleanToken = resetToken.trim();
    if (!cleanToken || !newPassword) {
      setModalError("Reset code and new password are required");
      return;
    }
    setModalLoading(true);
    setModalError("");
    setModalSuccess("");
    try {
      const res = await resetPassword(resetEmail.trim(), cleanToken, newPassword);
      setModalSuccess(res.data.message || "Password successfully changed!");
      setTimeout(() => {
        setShowForgotModal(false);
      }, 1500);
    } catch (err) {
      setModalError(parseErrorMessage(err, "Failed to reset password"));
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <HeroSection />

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Logo />

          <Card>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Sign In to Portal
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Choose your role to access your personalized telemetry dashboard
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  setActiveRole("admin");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeRole === "admin"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Shield size={14} /> Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole("teacher");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeRole === "teacher"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <GraduationCap size={14} /> Teacher
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole("student");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeRole === "student"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserCheck size={14} /> Student
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeRole === "admin"
                    ? "Admin Email"
                    : activeRole === "teacher"
                    ? "Email or Faculty ID"
                    : "Roll No. or Email"}
                </label>
                <Input
                  type="text"
                  placeholder={
                    activeRole === "admin"
                      ? "admin@gmail.com"
                      : activeRole === "teacher"
                      ? "teacher@university.edu or EMP-101"
                      : "e.g. 2101290"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  icon={Mail}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {activeRole === "admin" && (
                    <button
                      type="button"
                      onClick={handleOpenForgot}
                      className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Password Recovery
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Step {forgotStep} of 2
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{modalSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <div className="mt-6 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter your registered administrator email address. We will generate and send a 6-digit verification code.
                </p>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Administrator Email
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@gmail.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    icon={Mail}
                  />
                </div>
                <Button onClick={handleRequestOTP} disabled={modalLoading}>
                  {modalLoading ? "Sending OTP..." : "Send Reset Code"}
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter the 6-digit verification code sent to <strong className="text-blue-500">{resetEmail}</strong> and your new password.
                </p>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Verification Code (OTP)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    icon={KeyRound}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      icon={Lock}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleResetPassword} disabled={modalLoading}>
                  {modalLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
