import { useTheme, type ThemeMode } from "../lib/theme.js";

const OPTIONS: { id: ThemeMode; label: string; icon: JSX.Element }[] = [
  {
    id: "light",
    label: "Light",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="7" r="2.6" />
        <path d="M7 1v1.4M7 11.6V13M1 7h1.4M11.6 7H13M2.6 2.6l1 1M10.4 10.4l1 1M2.6 11.4l1-1M10.4 3.6l1-1" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "System",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1.5" y="2" width="11" height="8" rx="1.2" />
        <path d="M5 12.5h4" />
        <path d="M7 10.5v2" />
      </svg>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8.2A5 5 0 1 1 5.8 2a4 4 0 0 0 6.2 6.2z" />
      </svg>
    ),
  },
];

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-bg p-0.5"
    >
      {OPTIONS.map((o) => {
        const active = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            onClick={() => setMode(o.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
              active
                ? "bg-accent/12 text-accent"
                : "text-muted hover:text-text"
            }`}
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}
