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
      const parsed = JSON.parse(userRaw);

      const role = parsed?.role || parsed?.user?.role;

      if (role !== "ADMIN") {
        return <Navigate to="/" replace />;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}