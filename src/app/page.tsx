"use client";

import { useState, useEffect } from "react";
import { AgeVerificationModal } from "@/components/custom/age-verification-modal";
import { Navigation } from "@/components/custom/navigation";
import { Sparkles, Gamepad2, Wine, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("age_verified");
    if (verified === "true") {
      setIsAgeVerified(true);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
    setShowModal(false);
    if (verified) {
      localStorage.setItem("age_verified", "true");
    }
  };

  if (!isAgeVerified) {
    return (
      <AgeVerificationModal
        isOpen={showModal}
        onVerify={handleAgeVerification}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-8">
            <Sparkles className="w-4 h-4 text-[#00FF00]" />
            <span className="text-sm text-[#00FF00] font-medium">Transforme suas festas em experiências inesquecíveis</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
            Brinde.AI
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            A plataforma definitiva para jogos de bebida inteligentes e drinks personalizados com IA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/games"
              className="group relative px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] w-full sm:w-auto"
            >
              <span className="relative z-10">Explorar Jogos</span>
            </Link>
            
            <Link
              href="/drinks/create"
              className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00FF00]/50 w-full sm:w-auto"
            >
              Criar Drinks
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Jogos */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/20 transition-colors">
                  <Gamepad2 className="w-7 h-7 text-[#00FF00]" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">10+ Jogos Épicos</h3>
                <p className="text-gray-400 mb-4">
                  Roleta Bebada, Batata Quente, Eu Nunca, Verdade ou Shot e muito mais
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20">
                    Leve
                  </span>
                  <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20">
                    Moderado
                  </span>
                  <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20">
                    Corajoso
                  </span>
                  <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20">
                    Extremo
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 2 - Drinks IA */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/20 transition-colors">
                  <Wine className="w-7 h-7 text-[#00FF00]" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Drinks com IA</h3>
                <p className="text-gray-400 mb-4">
                  Tire foto das suas bebidas e receba receitas personalizadas baseadas no seu gosto
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Reconhecimento por foto
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Inventário inteligente
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Receitas personalizadas
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Premium */}
            <div className="group relative bg-gradient-to-br from-[#00FF00]/10 to-[#00FF00]/[0.02] rounded-2xl p-8 border border-[#00FF00]/30 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#00FF00]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/30 transition-colors">
                  <BookOpen className="w-7 h-7 text-[#00FF00]" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <span className="px-2 py-1 bg-[#00FF00] text-[#0D0D0D] text-xs font-bold rounded">PRO</span>
                </div>
                
                <p className="text-gray-400 mb-4">
                  Desbloqueie todos os jogos, modos extremos e cartas personalizadas
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Todos os jogos e modos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Cartas personalizadas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    5 listas de jogadores
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                    Sem anúncios
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-12 border border-[#00FF00]/20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para elevar suas festas?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Crie sua conta gratuita e comece a jogar agora
            </p>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
            >
              Começar Gratuitamente
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Brinde.AI - Beba com responsabilidade. Proibido para menores de 18 anos.</p>
        </div>
      </footer>
    </div>
  );
}
