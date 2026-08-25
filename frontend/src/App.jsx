import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Students from "./pages/Students/Students";
import Teachers from "./pages/Teachers/Teachers";
import Attendance from "./pages/Attendance/Attendance";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Cameras from "./pages/Cameras/Cameras";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications/Notifications";
import AlertSettings from "./pages/AlertSettings/AlertSettings";
import StudentPortal from "./pages/StudentPortal/StudentPortal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teachers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Teachers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alert-settings"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <AlertSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-portal"
        element={
          <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
            <StudentPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cameras"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Cameras />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;