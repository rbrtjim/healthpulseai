import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Entries, Vitals, Mood, Wellbeing } from "@healthpulse/api-client";
import { todayISO } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import { computeStreak } from "../lib/wellbeingStreak.js";
import Illustration from "../components/Illustration.js";

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const today = todayISO();
  const entries = useQuery({
    queryKey: ["entries", "recent"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 5),
  });
  const vitals = useQuery({
    queryKey: ["vitals-recent"],
    queryFn: () => Vitals.listVitals(apiConfig),
  });
  const mood = useQuery({
    queryKey: ["mood-recent"],
    queryFn: () => Mood.listMood(apiConfig),
  });
  const wb = useQuery({
    queryKey: ["wellbeing-streak"],
    queryFn: () => Wellbeing.listWellbeing(apiConfig, 1, 60),
  });
  const streak = wb.data ? computeStreak(wb.data.entries, today) : 0;
  const todayEntry = wb.data?.entries.find((e) => e.date === today);
  const totalEntries = entries.data?.total ?? 0;
  const latestVital = vitals.data?.vitals.at(-1);
  const latestMood = mood.data?.mood.at(-1);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            {new Date(today).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
            Dashboard
          </h1>
        </div>
        <Link
          to="/journal/new"
          className="self-start rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent/90"
        >
          Log today
        </Link>
      </motion.header>

      <motion.section
        variants={grid}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-4"
      >
        <StatCard label="Total entries" value={String(totalEntries)} />
        <StatCard
          label="Wellbeing streak"
          value={`${streak} ${streak === 1 ? "day" : "days"}`}
        />
        <StatCard
          label="Latest heart rate"
          value={latestVital?.heart_rate ? `${latestVital.heart_rate} bpm` : "—"}
        />
        <StatCard
          label="Latest sleep"
          value={
            latestMood?.sleep_hours != null ? `${latestMood.sleep_hours} h` : "—"
          }
        />
      </motion.section>

      <motion.div
        variants={grid}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.section
          variants={item}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="md:col-span-2 rounded-xl border border-border bg-bg p-6 shadow-card"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
              Recent entries
            </h2>
            <Link
              to="/history"
              className="text-xs text-accent transition hover:underline"
            >
              View all
            </Link>
          </div>
          {!entries.data || entries.data.entries.length === 0 ? (
            <EmptyState
              title="No entries yet"
              body="Your journal will populate here once you log a first day."
              cta={{ to: "/journal/new", label: "Log your first entry" }}
            />
          ) : (
            <ul className="divide-y divide-border">
              {entries.data.entries.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/journal/${e.id}`}
                    className="group flex items-baseline justify-between gap-4 py-3 transition hover:text-accent"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text group-hover:text-accent">
                        {e.symptoms.map((s) => s.name).join(", ")}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {e.symptoms.length} symptom
                        {e.symptoms.length === 1 ? "" : "s"} logged
                      </p>
                    </div>
                    <time className="whitespace-nowrap text-xs uppercase tracking-wider text-muted">
                      {e.date}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        <motion.section
          variants={item}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="pointer-events-none absolute -right-4 -top-4 text-accent/15">
            <Illustration name="leaf" width={120} height={120} />
          </div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
            Wellbeing
          </h2>
          <p className="mt-4 text-3xl font-light tracking-tight text-text">
            {streak}
            <span className="ml-2 text-base text-muted">day streak</span>
          </p>
          {todayEntry ? (
            <p className="mt-3 text-sm text-muted">
              Today:{" "}
              <span className="text-text">
                {todayEntry.gratitude_things[0] ?? "saved"}
              </span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">No entry today yet.</p>
          )}
          <Link
            to="/journal/wellbeing"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
          >
            {todayEntry ? "Edit today's entry" : "Write today's entry"}
            <span aria-hidden>→</span>
          </Link>
        </motion.section>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={item}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-bg p-5 shadow-card transition-shadow hover:shadow-cardHover"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-3 text-2xl font-light tracking-tight text-text">{value}</p>
    </motion.div>
  );
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { to: string; label: string };
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <div className="mx-auto mb-3 inline-flex text-muted/40">
        <Illustration name="robot" width={64} height={64} />
      </div>
      <p className="text-base font-medium text-text">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <Link
        to={cta.to}
        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
      >
        {cta.label}
      </Link>
    </div>
  );
}
