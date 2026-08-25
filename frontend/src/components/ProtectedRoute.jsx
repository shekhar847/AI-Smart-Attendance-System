import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem("user_role") || "admin";

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "student") {
      return <Navigate to="/student-portal" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;