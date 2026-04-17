import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}