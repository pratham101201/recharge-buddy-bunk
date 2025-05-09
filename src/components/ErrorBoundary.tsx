
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    // You could also log to an error reporting service here
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We apologize for the inconvenience. Please try again later.
              </p>
              {this.state.error && (
                <pre className="mt-4 bg-gray-100 p-4 rounded-md text-left overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              )}
              <div className="mt-6">
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600"
                >
                  Return to Home Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
