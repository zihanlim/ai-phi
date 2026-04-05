"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-error mb-4 block">
              error
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-2">
              Something went wrong
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-surface-container-lowest rounded-sm font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}