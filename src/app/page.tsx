"use client";

import { useState, useEffect } from "react";
import { AgeVerificationModal } from "@/components/custom/age-verification-modal";
import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Sparkles, Gamepad2, Wine, BookOpen, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verified = localStorage.getItem("age_verified");
    if (verified === "true") {
      setIsAgeVerified(true);
    } else {
      setShowModal(true);
    }
    setIsLoading(false);
  }, []);

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
    setShowModal(false);
    if (verified) {
      localStorage.setItem("age_verified", "true");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#00FF00]/20 border-t-[#00FF00] rounded-full animate-spin" />
          <p className="text-gray-400 animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

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
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF00]/5 via-transparent to-transparent opacity-50 animate-pulse" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#00FF00] animate-pulse" />
            <span className="text-sm text-[#00FF00] font-medium">Transforme suas festas em experiências inesquecíveis</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent animate-fade-in-up">
            Brinde.AI
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            A plataforma definitiva para jogos de bebida inteligentes e drinks personalizados com IA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link
              href="/games"
              className="group relative px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] w-full sm:w-auto"
              aria-label="Explorar jogos de bebida"
            >
              <span className="relative z-10">Explorar Jogos</span>
            </Link>
            
            <Link
              href="/drinks/create"
              className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00FF00]/50 w-full sm:w-auto"
              aria-label="Criar drinks personalizados"
            >
              Criar Drinks
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00FF00] mb-2">10+</div>
              <div className="text-gray-400 text-sm">Jogos Épicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00FF00] mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Receitas de Drinks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00FF00] mb-2">50k+</div>
              <div className="text-gray-400 text-sm">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00FF00] mb-2">4.9★</div>
              <div className="text-gray-400 text-sm">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo que você precisa para festas épicas
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Recursos profissionais para transformar qualquer reunião em uma experiência inesquecível
            </p>
          </div>

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

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rápido e Fácil</h3>
              <p className="text-gray-400">
                Configure seus jogos em segundos e comece a diversão imediatamente
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguro e Privado</h3>
              <p className="text-gray-400">
                Seus dados são protegidos com criptografia de ponta a ponta
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidade Ativa</h3>
              <p className="text-gray-400">
                Junte-se a milhares de usuários que já transformaram suas festas
              </p>
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
              aria-label="Começar gratuitamente"
            >
              Começar Gratuitamente
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
