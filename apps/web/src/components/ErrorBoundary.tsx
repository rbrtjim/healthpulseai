import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error(error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-600">
            Error
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-text">
            Something went wrong.
          </h1>
          <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-surface p-4 text-sm text-text">
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
