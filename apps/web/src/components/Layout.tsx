import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";
import { useTheme } from "../lib/useTheme.js";

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const { theme, toggle } = useTheme();
  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-brand-600">
          🌿 HealthPulse AI
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/journal/new">Log</Link>
          <Link to="/journal/wellbeing">Wellbeing</Link>
          <Link to="/history">History</Link>
          <Link to="/insights">Insights</Link>
          <button onClick={toggle} className="text-slate-500" aria-label="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user && (
            <button onClick={signOut} className="text-slate-500 hover:text-slate-900">
              Sign out
            </button>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
