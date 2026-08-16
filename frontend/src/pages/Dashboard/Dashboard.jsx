import { useEffect, useState } from "react";

import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/StatCard";
import AttendanceChart from "../../components/AttendanceChart";
import AttendanceSummary from "../../components/AttendanceSummary";
import AttendanceTable from "../../components/AttendanceTable";
import PageHeader from "../../components/PageHeader";

import { getDashboard } from "../../api/dashboardApi";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
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
  }, []);

  return (

    <DashboardLayout>

      <PageHeader />

      {/* Statistics */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Students"
          value={loading ? "..." : dashboard.students}
          icon={<Users size={28} />}
          color="#2563EB"
          change=""
        />

        <StatCard
          title="Teachers"
          value={loading ? "..." : dashboard.teachers}
          icon={<GraduationCap size={28} />}
          color="#16A34A"
          change=""
        />

        <StatCard
          title="Present Today"
          value={loading ? "..." : dashboard.present}
          icon={<UserCheck size={28} />}
          color="#22C55E"
          change=""
        />

        <StatCard
          title="Absent Today"
          value={loading ? "..." : dashboard.absent}
          icon={<UserX size={28} />}
          color="#EF4444"
          change=""
        />

      </div>

      {/* Analytics */}

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        <AttendanceSummary />

      </div>

      {/* Recent Attendance */}

      <AttendanceTable />

    </DashboardLayout>

  );

}

export default Dashboard;