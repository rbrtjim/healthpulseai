type IllustrationName =
  | "robot"
  | "planet"
  | "pulse"
  | "leaf"
  | "moon-stars"
  | "compass"
  | "spark"
  | "constellation";

interface Props {
  name: IllustrationName;
  className?: string;
  width?: number;
  height?: number;
}

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function Illustration({
  name,
  className,
  width = 120,
  height = 120,
}: Props) {
  switch (name) {
    case "robot":
      return (
        <svg
          viewBox="0 0 120 130"
          width={width}
          height={height}
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* antenna */}
          <path d="M60 22V14" />
          <circle cx="60" cy="11" r="1.8" />
          {/* head */}
          <rect x="22" y="24" width="76" height="52" rx="9" />
          {/* side speakers */}
          <rect x="10" y="38" width="12" height="22" rx="2.5" />
          <rect x="98" y="38" width="12" height="22" rx="2.5" />
          {/* inner face screen */}
          <rect x="30" y="34" width="60" height="32" rx="5" opacity="0.4" />
          {/* eyes */}
          <circle cx="46" cy="44" r="2.8" />
          <circle cx="74" cy="44" r="2.8" />
          {/* heartbeat ECG line across the face */}
          <path d="M32 56h7l3-7 5 13 4-11 4 9 3-4h30" />
          {/* neck */}
          <path d="M52 76v6M68 76v6" />
          {/* chest plate */}
          <rect x="38" y="82" width="44" height="22" rx="4" />
          {/* heart medallion on chest */}
          <path d="M60 87.5c-1.6-3-7-2.6-7 1.4 0 2.8 7 5.6 7 5.6s7-2.8 7-5.6c0-4-5.4-4.4-7-1.4z" />
          {/* legs */}
          <path d="M50 104v10" />
          <path d="M70 104v10" />
          {/* feet */}
          <path d="M44 114h12" />
          <path d="M64 114h12" />
        </svg>
      );
    case "planet":
      return (
        <svg
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className={className}
          {...common}
        >
          <circle cx="60" cy="60" r="22" />
          <ellipse
            cx="60"
            cy="60"
            rx="46"
            ry="14"
            transform="rotate(-22 60 60)"
          />
          <circle cx="52" cy="54" r="2" />
          <circle cx="68" cy="64" r="3" />
          <circle cx="46" cy="64" r="1.5" />
        </svg>
      );
    case "pulse":
      return (
        <svg
          viewBox="0 0 160 80"
          width={width}
          height={height ?? 80}
          className={className}
          {...common}
        >
          <path d="M2 40h30l8-22 12 44 10-30 8 16 14-8h74" />
        </svg>
      );
    case "leaf":
      return (
        <svg
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className={className}
          {...common}
        >
          <path d="M22 96C22 56 56 22 96 22c0 40-34 74-74 74z" />
          <path d="M28 92L86 34" />
          <path d="M46 84l-8 18" />
          <path d="M58 72l-8 18" />
          <path d="M70 60l-8 18" />
        </svg>
      );
    case "moon-stars":
      return (
        <svg
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className={className}
          {...common}
        >
          <path d="M90 70a36 36 0 1 1-44-44 28 28 0 0 0 44 44z" />
          <path d="M24 30l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
          <path d="M96 22l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
        </svg>
      );
    case "compass":
      return (
        <svg
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className={className}
          {...common}
        >
          <circle cx="60" cy="60" r="42" />
          <circle cx="60" cy="60" r="3" />
          <path d="M60 30v8M60 82v8M30 60h8M82 60h8" />
          <path d="M60 60l16-22-22 16z" />
        </svg>
      );
    case "spark":
      return (
        <svg
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className={className}
          {...common}
        >
          <path d="M60 18l8 26 26 8-26 8-8 26-8-26-26-8 26-8z" />
          <path d="M100 28l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
          <path d="M20 86l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
        </svg>
      );
    case "constellation":
      return (
        <svg
          viewBox="0 0 160 120"
          width={width}
          height={height ?? 120}
          className={className}
          {...common}
        >
          <circle cx="20" cy="40" r="2.5" />
          <circle cx="60" cy="22" r="2.5" />
          <circle cx="96" cy="50" r="2.5" />
          <circle cx="138" cy="32" r="2.5" />
          <circle cx="44" cy="86" r="2.5" />
          <circle cx="110" cy="92" r="2.5" />
          <path d="M20 40l40-18 36 28 42-18M60 22l-16 64M96 50l14 42" />
        </svg>
      );
  }
}
