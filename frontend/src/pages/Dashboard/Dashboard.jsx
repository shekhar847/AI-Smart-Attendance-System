import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import WelcomeBanner from "../../components/WelcomeBanner";
import StatCard from "../../components/StatCard";
import AttendanceChart from "../../components/AttendanceChart";
import AttendanceSummary from "../../components/AttendanceSummary";
import AttendanceTable from "../../components/AttendanceTable";
import PageHeader from "../../components/PageHeader";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mt-8">
        <PageHeader />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
  title="Total Students"
  value="1,250"
  icon={<Users size={28} />}
  color="#2563EB"
  change="+8.2%"
/>

<StatCard
  title="Teachers"
  value="54"
  icon={<GraduationCap size={28} />}
  color="#16A34A"
  change="+2.5%"
/>

<StatCard
  title="Present Today"
  value="1,180"
  icon={<UserCheck size={28} />}
  color="#F59E0B"
  change="+4.8%"
/>

<StatCard
  title="Absent Today"
  value="70"
  icon={<UserX size={28} />}
  color="#DC2626"
  change="-1.3%"
/>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <AttendanceSummary />
        </div>
        <div>
          <AttendanceTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;