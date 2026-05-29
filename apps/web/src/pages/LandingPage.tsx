import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-start gap-16 px-6 py-24 md:py-32">
      <div className="max-w-3xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Symptom checker · Health journal · AI insights
        </p>
        <h1 className="text-5xl font-light leading-[1.05] tracking-tightest text-text md:text-7xl">
          A clearer picture of your{" "}
          <span className="font-medium text-accent">health</span> — log,
          analyze, understand.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          Daily symptoms, vitals and mood meet a Claude-powered analysis layer.
          Spot trends across weeks, surface correlations you'd otherwise miss,
          and keep one tidy record of how you actually feel.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            to="/auth"
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow-card transition hover:bg-accent/90"
          >
            Get started
          </Link>
          <a
            href="https://github.com/rbrtjim/healthpulseai"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border bg-bg px-6 py-3 text-sm font-medium text-text transition hover:border-text/30"
          >
            View source
          </a>
        </div>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="group rounded-xl border border-border bg-bg p-6 transition hover:border-accent/40 hover:shadow-cardHover"
          >
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 font-medium text-accent">
              {f.tag}
            </div>
            <h3 className="text-lg font-medium tracking-tight text-text">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    tag: "01",
    title: "Structured journaling",
    body: "Symptoms, vitals, mood and sleep — captured fast in a single daily form. No clutter, no nagging.",
  },
  {
    tag: "02",
    title: "Claude-powered analysis",
    body: "Retrieval-augmented context of your last week of entries, returned as structured insights with explicit urgency levels.",
  },
  {
    tag: "03",
    title: "Trends you can see",
    body: "Vitals over time, a 90-day symptom heatmap, and correlation cards that link sleep to next-day symptoms.",
  },
];
