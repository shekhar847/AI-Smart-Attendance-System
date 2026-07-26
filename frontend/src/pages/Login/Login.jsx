import { Mail, Lock, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/HeroSection";
import Logo from "../../components/Logo";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";


function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">

        {/* Left Section */}
        <HeroSection />

        {/* Right Section */}
        <div className="flex w-full justify-center lg:w-1/2">

          <Card>

            <Logo />

            <h2 className="mt-8 text-3xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Login to continue
            </p>

            <div className="mt-8 space-y-5">

              <Input
                type="email"
                placeholder="Enter your email"
                icon={Mail}
              />

              <div className="relative">

                <Input
                  type="password"
                  placeholder="Enter your password"
                  icon={Lock}
                />

                <Eye
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
                />

              </div>

              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button className="font-medium text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </button>

              </div>

              <Button onClick={() => navigate("/dashboard")}>
                Sign In →
              </Button>

            </div>

          </Card>

        </div>

      </div>
    </div>
  );
}

export default Login;