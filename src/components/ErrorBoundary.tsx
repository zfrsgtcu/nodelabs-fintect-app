"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8 text-center"
          role="alert"
        >
          <h1 className="text-xl font-semibold text-slate-dark font-kumbh-sans">
            Bir hata oluştu
          </h1>
          <p className="text-slate text-sm max-w-md font-kumbh-sans">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-lg bg-green-primary text-slate-dark font-semibold text-sm font-kumbh-sans hover:opacity-90"
          >
            Tekrar dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
