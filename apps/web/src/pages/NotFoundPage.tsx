import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-12 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">That page doesn't exist.</p>
      <Link to="/dashboard" className="mt-4 inline-block text-brand-600">
        ← Dashboard
      </Link>
    </div>
  );
}
