import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";

export default function AuthPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link
        to="/"
        className="mb-12 text-base font-semibold tracking-tight text-text"
      >
        HealthPulse<span className="text-accent">.</span>
        <span className="ml-2 text-xs font-normal uppercase tracking-[0.18em] text-muted">
          AI
        </span>
      </Link>
      <h1 className="text-3xl font-light tracking-tight text-text">
        Sign in to your journal
      </h1>
      <p className="mt-2 text-sm text-muted">
        Email + password, or magic link — both work.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-bg p-6 shadow-card">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "rgb(30 79 168)",
                  brandAccent: "rgb(30 79 168 / 0.9)",
                  inputBorder: "rgb(226 232 239)",
                  inputBorderHover: "rgb(91 107 124)",
                  inputBorderFocus: "rgb(30 79 168)",
                },
                radii: {
                  buttonBorderRadius: "6px",
                  inputBorderRadius: "6px",
                },
                fonts: {
                  bodyFontFamily: "Roboto, system-ui, sans-serif",
                  buttonFontFamily: "Roboto, system-ui, sans-serif",
                  labelFontFamily: "Roboto, system-ui, sans-serif",
                  inputFontFamily: "Roboto, system-ui, sans-serif",
                },
              },
            },
          }}
          providers={[]}
          magicLink
        />
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        By signing in you agree this is a portfolio project — not medical advice.
      </p>
    </div>
  );
}
