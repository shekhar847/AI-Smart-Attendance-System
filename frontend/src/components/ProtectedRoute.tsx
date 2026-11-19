"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const role = localStorage.getItem("user_role") || "admin";

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      if (role === "student") {
        router.replace("/student-portal");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    setAuthorized(true);
  }, [router, allowedRoles]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#090d16]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verifying security token...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
