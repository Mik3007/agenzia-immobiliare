import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const token = localStorage.getItem("token"); // oppure la chiave che usi tu

  if (!token) return <Navigate to="/admin" replace />;

  return <Outlet />;
}