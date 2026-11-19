"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, UserCheck, UserX } from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import AttendanceChart from "../../components/AttendanceChart";
import AttendanceSummary from "../../components/AttendanceSummary";
import AttendanceTable from "../../components/AttendanceTable";
import PageHeader from "../../components/PageHeader";

import { getDashboard } from "../../api/dashboardApi";
import { DashboardStats } from "../../types";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardStats>({
    students: 0,
    teachers: 0,
    present: 0,
    absent: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <PageHeader />

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={loading ? "..." : dashboard.students}
              icon={<Users size={24} />}
              color="#c8f135"
              change="+5%"
            />

            <StatCard
              title="Faculty Members"
              value={loading ? "..." : dashboard.teachers}
              icon={<GraduationCap size={24} />}
              color="#16A34A"
              change="+2%"
            />

            <StatCard
              title="Present Today"
              value={loading ? "..." : dashboard.present}
              icon={<UserCheck size={24} />}
              color="#22C55E"
              change="+14%"
            />

            <StatCard
              title="Absent Today"
              value={loading ? "..." : dashboard.absent}
              icon={<UserX size={24} />}
              color="#EF4444"
              change="-3%"
            />
          </div>

          {/* Analytics */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AttendanceChart />
            </div>

            <AttendanceSummary />
          </div>

          {/* Recent Attendance */}
          <AttendanceTable />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
