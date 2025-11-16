"use client";

import { ArrowLeft, Crown, Check, Zap } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  const features = [
    "Acesso a todos os 10+ jogos",
    "Todos os modos: Leve, Moderado, Corajoso e Extremo",
    "Cartas personalizadas ilimitadas",
    "5 listas de jogadores salvas",
    "Reconhecimento de bebidas por foto",
    "Receitas personalizadas com IA",
    "Inventário completo de bebidas",
    "Sem anúncios",
    "Suporte prioritário",
    "Novos jogos em primeira mão",
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-6">
            <Crown className="w-4 h-4 text-[#00FF00]" />
            <span className="text-sm text-[#00FF00] font-medium">Plano Premium</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Desbloqueie o{" "}
            <span className="bg-gradient-to-r from-[#00FF00] to-[#00FF00]/70 bg-clip-text text-transparent">
              Poder Total
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12">
            Acesso completo a todos os jogos, modos extremos e funcionalidades exclusivas
          </p>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-8 sm:p-12 border-2 border-[#00FF00]/30 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-bold text-white">R$ 19,90</span>
                  <span className="text-2xl text-gray-400">/mês</span>
                </div>
                <p className="text-gray-400">Cancele quando quiser</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#00FF00]/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-[#00FF00]" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/payment"
                className="w-full px-8 py-5 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Assinar Agora
              </Link>

              {/* Guarantee */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Garantia de 7 dias - Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Gratuito vs Premium</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Gratuito</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Check className="w-5 h-5 text-gray-600" />
                  3 jogos básicos
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check className="w-5 h-5 text-gray-600" />
                  Apenas modo Leve
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check className="w-5 h-5 text-gray-600" />
                  Cartas padrão
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check className="w-5 h-5 text-gray-600" />
                  Com anúncios
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-2xl p-8 border-2 border-[#00FF00]/30">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-2xl font-bold">Premium</h3>
                <Crown className="w-6 h-6 text-[#00FF00]" />
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  10+ jogos completos
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  Todos os modos
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  Cartas personalizadas
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  Sem anúncios
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  IA de drinks
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-[#00FF00]" />
                  Listas de jogadores
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
