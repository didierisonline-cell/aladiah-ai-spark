import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * App-wide render safety net. Without this, any uncaught error thrown while
 * rendering a route unmounts the entire React tree, leaving the user on a blank
 * dark page (the body background) with no UI — exactly the /portal blank-screen
 * symptom. This boundary catches the error and shows a recoverable fallback
 * (Reload / Sign in) instead, and logs the error to the console for diagnosis.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Surface the real error so it shows up in the browser console / logs.
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleSignIn = () => {
    window.location.href = '/auth';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-card/80 shadow-large p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page hit an unexpected error. Your session is safe — try reloading,
            or head back to sign in.
          </p>
          {this.state.message && (
            <p className="mt-3 break-words rounded-lg bg-muted/50 px-3 py-2 text-left font-mono text-[11px] text-muted-foreground">
              {this.state.message}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={this.handleReload}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Reload page
            </button>
            <button
              onClick={this.handleSignIn}
              className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
}
