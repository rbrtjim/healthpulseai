interface Props {
  email: string;
  name?: string;
  src?: string;
  size?: number;
  className?: string;
}

function initialsFor(name: string | undefined, email: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (email[0] ?? "?").toUpperCase();
}

export default function Avatar({
  email,
  name,
  src,
  size = 32,
  className = "",
}: Props) {
  const style = { width: size, height: size, fontSize: size * 0.4 };
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? email}
        style={style}
        className={`rounded-full border border-border object-cover ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <span
      style={style}
      className={`inline-flex items-center justify-center rounded-full border border-border bg-accent/15 font-medium text-accent ${className}`}
    >
      {initialsFor(name, email)}
    </span>
  );
}
