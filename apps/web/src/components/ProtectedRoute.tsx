import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";

export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
