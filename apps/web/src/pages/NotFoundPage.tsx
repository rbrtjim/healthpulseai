import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6 py-12">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
        404
      </p>
      <h1 className="mt-4 text-5xl font-light tracking-tight text-text md:text-6xl">
        That page doesn't exist.
      </h1>
      <p className="mt-4 max-w-lg text-base text-muted">
        The link you followed is broken, or the page has moved. The dashboard
        is a good place to land.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
