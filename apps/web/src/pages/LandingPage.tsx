import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <section className="mx-auto max-w-3xl p-12 text-center">
      <h1 className="text-5xl font-bold text-brand-600">HealthPulse AI</h1>
      <p className="mt-4 text-lg text-slate-600">
        Your AI-powered health journal & wellbeing companion.
      </p>
      <Link
        to="/auth"
        className="mt-8 inline-block rounded bg-brand-500 px-6 py-3 text-white"
      >
        Get started →
      </Link>
    </section>
  );
}
