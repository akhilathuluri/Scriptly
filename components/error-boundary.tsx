'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center space-y-6 animate-fade-in-up max-w-md text-center p-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-destructive to-destructive/60 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred while loading the application.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Error Details
              </summary>
              <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={resetError}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Reload Page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook for error boundary
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);
  };
}
