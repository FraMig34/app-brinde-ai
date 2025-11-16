"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerify: (verified: boolean) => void;
}

export function AgeVerificationModal({ isOpen, onVerify }: AgeVerificationModalProps) {
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    
    if (!year || year < 1900 || year > currentYear) {
      setError("Por favor, insira um ano válido");
      return;
    }

    const age = currentYear - year;
    
    if (age < 18) {
      setError("Você precisa ter 18 anos ou mais para acessar este site");
      setTimeout(() => {
        window.location.href = "https://www.google.com";
      }, 2000);
      return;
    }

    onVerify(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#0D0D0D] border-2 border-[#00FF00]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.2)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#00FF00]/10 rounded-full flex items-center justify-center border-2 border-[#00FF00]/30">
              <AlertTriangle className="w-10 h-10 text-[#00FF00]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 text-white">
            Verificação de Idade
          </h2>
          
          <p className="text-center text-gray-400 mb-8">
            Este site contém conteúdo relacionado a bebidas alcoólicas. Você precisa ter 18 anos ou mais para continuar.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-300 mb-2">
                Ano de Nascimento
              </label>
              <input
                type="number"
                id="birthYear"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="Ex: 1995"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 focus:ring-2 focus:ring-[#00FF00]/20 transition-all"
                required
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
            >
              Verificar e Entrar
            </button>
          </form>

          {/* Warning */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-500 text-center">
              Ao continuar, você confirma que tem 18 anos ou mais e concorda com nossos Termos de Uso. Beba com responsabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
