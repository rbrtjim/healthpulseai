import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/journal/new", label: "Log" },
  { to: "/journal/wellbeing", label: "Wellbeing" },
  { to: "/history", label: "History" },
  { to: "/insights", label: "Insights" },
];

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink
            to="/dashboard"
            className="text-base font-semibold tracking-tight text-text"
          >
            HealthPulse<span className="text-accent">.</span>
            <span className="ml-2 text-xs font-normal uppercase tracking-[0.18em] text-muted">
              AI
            </span>
          </NavLink>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive ? "font-medium text-text" : "text-muted hover:text-text"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-muted md:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-muted transition hover:border-text/30 hover:text-text"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <nav className="border-t border-border bg-bg/60 px-6 py-2 md:hidden">
          <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto text-sm">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap transition-colors ${
                    isActive ? "font-medium text-text" : "text-muted"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        HealthPulse AI · Portfolio project · Not medical advice
      </footer>
    </div>
  );
}
