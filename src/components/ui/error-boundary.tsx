"use client";

// Professional error boundary component
import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">Algo deu errado</h1>
              <p className="text-gray-400">
                Desculpe, encontramos um erro inesperado. Tente recarregar a página.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all"
                aria-label="Recarregar página"
              >
                <RefreshCw className="w-5 h-5" />
                Recarregar
              </button>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                aria-label="Voltar para página inicial"
              >
                <Home className="w-5 h-5" />
                Página Inicial
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
