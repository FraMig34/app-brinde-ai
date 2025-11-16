"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Algo deu errado
            </h2>
            <p className="text-gray-400 mb-6">
              Desculpe, ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-lg font-bold hover:bg-[#00FF00]/90 transition-all duration-300"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
