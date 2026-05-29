import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@healthpulse/store";
import Illustration from "../components/Illustration.js";

type IconName = "robot" | "pulse" | "constellation";

const FEATURES: { tag: string; title: string; body: string; icon: IconName }[] = [
  {
    tag: "01",
    title: "Structured journaling",
    body: "Symptoms, vitals, mood and sleep — captured fast in a single daily form. No clutter, no nagging.",
    icon: "pulse",
  },
  {
    tag: "02",
    title: "Claude-powered analysis",
    body: "Retrieval-augmented context of your last week of entries, returned as structured insights with explicit urgency levels.",
    icon: "robot",
  },
  {
    tag: "03",
    title: "Trends you can see",
    body: "Vitals over time, a 90-day symptom heatmap, and correlation cards that link sleep to next-day symptoms.",
    icon: "constellation",
  },
];

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-start gap-16 px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute right-4 top-4 hidden text-muted/30 md:block">
        <Illustration name="moon-stars" width={140} height={140} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl"
      >
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
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
        }}
        className="grid w-full gap-4 md:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <motion.article
            key={f.title}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="group rounded-xl border border-border bg-bg p-6 transition-shadow hover:border-accent/40 hover:shadow-cardHover"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Illustration name={f.icon} width={22} height={22} />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {f.tag}
            </p>
            <h3 className="mt-1 text-lg font-medium tracking-tight text-text">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
