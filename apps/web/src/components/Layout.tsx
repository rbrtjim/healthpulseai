import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";
import ThemeToggle from "./ThemeToggle.js";
import Illustration from "./Illustration.js";
import RouteAura from "./RouteAura.js";
import PageTransition from "./PageTransition.js";

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
  const { pathname } = useLocation();
  const activeIndex = navLinks.findIndex(
    (l) =>
      pathname === l.to ||
      (l.to !== "/dashboard" && pathname.startsWith(l.to)),
  );
  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };
  return (
    <>
      <RouteAura />
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 text-base font-semibold tracking-tight text-text"
            >
              <Illustration
                name="planet"
                width={28}
                height={28}
                className="text-accent"
              />
              <span>
                HealthPulse<span className="text-accent">.</span>
                <span className="ml-2 text-xs font-normal uppercase tracking-[0.18em] text-muted">
                  AI
                </span>
              </span>
            </NavLink>
            <nav className="hidden items-center gap-1 rounded-full border border-border bg-bg/60 p-1 text-sm md:flex">
              {navLinks.map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-1.5 transition-colors ${
                      isActive
                        ? "text-text"
                        : "text-muted hover:text-text"
                    }`
                  }
                >
                  {activeIndex === i && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent/15"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user && (
                <>
                  <span className="hidden text-xs text-muted md:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-muted transition hover:border-text/30 hover:text-text"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
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
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted">
          HealthPulse AI · Portfolio project · Not medical advice
        </footer>
      </div>
    </>
  );
}
