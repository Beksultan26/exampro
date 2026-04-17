import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  adminOnly = false,
}: {
  adminOnly?: boolean;
}) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    if (!userRaw) {
      return <Navigate to="/login" replace />;
    }

    try {
      const user = JSON.parse(userRaw);
      if (user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}