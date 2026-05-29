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
        <div className="p-6">
          <h1 className="text-xl font-bold text-red-600">Something went wrong</h1>
          <pre className="mt-2 text-sm">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
