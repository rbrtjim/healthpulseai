import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";
import { useTheme } from "../lib/theme.js";

export default function AuthPage() {
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();
  if (user) return <Navigate to="/dashboard" replace />;
  const isDark = theme === "dark";
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
                  brand: isDark ? "rgb(110 174 255)" : "rgb(30 79 168)",
                  brandAccent: isDark
                    ? "rgb(110 174 255 / 0.85)"
                    : "rgb(30 79 168 / 0.9)",
                  brandButtonText: isDark ? "rgb(9 14 24)" : "#ffffff",
                  defaultButtonBackground: isDark
                    ? "rgb(18 26 39)"
                    : "rgb(255 255 255)",
                  defaultButtonBackgroundHover: isDark
                    ? "rgb(30 41 59)"
                    : "rgb(244 246 248)",
                  defaultButtonBorder: isDark
                    ? "rgb(30 41 59)"
                    : "rgb(226 232 239)",
                  defaultButtonText: isDark
                    ? "rgb(226 232 240)"
                    : "rgb(10 37 64)",
                  dividerBackground: isDark
                    ? "rgb(30 41 59)"
                    : "rgb(226 232 239)",
                  inputBackground: isDark
                    ? "rgb(18 26 39)"
                    : "rgb(255 255 255)",
                  inputBorder: isDark ? "rgb(30 41 59)" : "rgb(226 232 239)",
                  inputBorderHover: isDark
                    ? "rgb(110 174 255 / 0.6)"
                    : "rgb(91 107 124)",
                  inputBorderFocus: isDark
                    ? "rgb(110 174 255)"
                    : "rgb(30 79 168)",
                  inputText: isDark ? "rgb(226 232 240)" : "rgb(10 37 64)",
                  inputLabelText: isDark
                    ? "rgb(226 232 240)"
                    : "rgb(10 37 64)",
                  inputPlaceholder: isDark
                    ? "rgb(140 156 178)"
                    : "rgb(91 107 124)",
                  messageText: isDark ? "rgb(226 232 240)" : "rgb(10 37 64)",
                  anchorTextColor: isDark
                    ? "rgb(110 174 255)"
                    : "rgb(30 79 168)",
                  anchorTextHoverColor: isDark
                    ? "rgb(186 215 255)"
                    : "rgb(22 72 184)",
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
          providers={["google"]}
          socialLayout="horizontal"
          redirectTo={`${window.location.origin}/dashboard`}
          magicLink
        />
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        By signing in you agree this is a portfolio project — not medical advice.
      </p>
    </div>
  );
}
