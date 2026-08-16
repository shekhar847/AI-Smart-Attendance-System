import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import Teachers from "../pages/Teachers/Teachers";
import Attendance from "../pages/Attendance/Attendance";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import Cameras from "../pages/Cameras/Cameras";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/cameras" element={<Cameras />} />
    </Routes>
  );
}

export default AppRouter;
