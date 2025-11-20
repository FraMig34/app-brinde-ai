"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { AgeVerificationModal } from "@/components/custom/age-verification-modal";
import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Sparkles, Gamepad2, Wine, BookOpen, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";

// Memoizar componentes estáticos para evitar re-renders desnecessários
const HeroSection = memo(() => (
  <section 
    className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden"
    role="banner"
    aria-label="Seção principal"
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#00FF00]/5 via-transparent to-transparent opacity-50 animate-pulse" aria-hidden="true" />
    
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-8 animate-fade-in">
        <Sparkles className="w-4 h-4 text-[#00FF00] animate-pulse" aria-hidden="true" />
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
          aria-label="Explorar jogos de bebida disponíveis"
          prefetch={true}
        >
          <span className="relative z-10">Explorar Jogos</span>
        </Link>
        
        <Link
          href="/drinks/create"
          className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00FF00]/50 w-full sm:w-auto"
          aria-label="Criar drinks personalizados com inteligência artificial"
          prefetch={true}
        >
          Criar Drinks
        </Link>
      </div>
    </div>
  </section>
));

HeroSection.displayName = "HeroSection";

const StatsSection = memo(() => (
  <section 
    className="px-4 py-12 sm:px-6 lg:px-8 border-y border-white/10"
    aria-label="Estatísticas da plataforma"
  >
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#00FF00] mb-2" aria-label="10 ou mais jogos">10+</div>
          <div className="text-gray-400 text-sm">Jogos Épicos</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[#00FF00] mb-2" aria-label="Mais de 1000 receitas">1000+</div>
          <div className="text-gray-400 text-sm">Receitas de Drinks</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[#00FF00] mb-2" aria-label="Mais de 50 mil usuários">50k+</div>
          <div className="text-gray-400 text-sm">Usuários Ativos</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[#00FF00] mb-2" aria-label="Avaliação 4.9 estrelas">4.9★</div>
          <div className="text-gray-400 text-sm">Avaliação Média</div>
        </div>
      </div>
    </div>
  </section>
));

StatsSection.displayName = "StatsSection";

const FeaturesGrid = memo(() => (
  <section 
    className="px-4 py-16 sm:px-6 lg:px-8"
    aria-labelledby="features-heading"
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4">
          Tudo que você precisa para festas épicas
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Recursos profissionais para transformar qualquer reunião em uma experiência inesquecível
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 - Jogos */}
        <article className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" aria-hidden="true" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/20 transition-colors" aria-hidden="true">
              <Gamepad2 className="w-7 h-7 text-[#00FF00]" />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">10+ Jogos Épicos</h3>
            <p className="text-gray-400 mb-4">
              Roleta Bebada, Batata Quente, Eu Nunca, Verdade ou Shot e muito mais
            </p>
            
            <div className="flex flex-wrap gap-2" role="list" aria-label="Níveis de dificuldade">
              <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20" role="listitem">
                Leve
              </span>
              <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20" role="listitem">
                Moderado
              </span>
              <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20" role="listitem">
                Corajoso
              </span>
              <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20" role="listitem">
                Extremo
              </span>
            </div>
          </div>
        </article>

        {/* Feature 2 - Drinks IA */}
        <article className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" aria-hidden="true" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/20 transition-colors" aria-hidden="true">
              <Wine className="w-7 h-7 text-[#00FF00]" />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">Drinks com IA</h3>
            <p className="text-gray-400 mb-4">
              Tire foto das suas bebidas e receba receitas personalizadas baseadas no seu gosto
            </p>
            
            <ul className="space-y-2" aria-label="Recursos de drinks com IA">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Reconhecimento por foto
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Inventário inteligente
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Receitas personalizadas
              </li>
            </ul>
          </div>
        </article>

        {/* Feature 3 - Premium */}
        <article className="group relative bg-gradient-to-br from-[#00FF00]/10 to-[#00FF00]/[0.02] rounded-2xl p-8 border border-[#00FF00]/30 hover:border-[#00FF00]/50 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" aria-hidden="true" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#00FF00]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF00]/30 transition-colors" aria-hidden="true">
              <BookOpen className="w-7 h-7 text-[#00FF00]" />
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold">Premium</h3>
              <span className="px-2 py-1 bg-[#00FF00] text-[#0D0D0D] text-xs font-bold rounded" aria-label="Plano profissional">PRO</span>
            </div>
            
            <p className="text-gray-400 mb-4">
              Desbloqueie todos os jogos, modos extremos e cartas personalizadas
            </p>
            
            <ul className="space-y-2" aria-label="Benefícios do plano premium">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Todos os jogos e modos
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Cartas personalizadas
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                5 listas de jogadores
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full" aria-hidden="true" />
                Sem anúncios
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
));

FeaturesGrid.displayName = "FeaturesGrid";

const BenefitsSection = memo(() => (
  <section 
    className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.02]"
    aria-labelledby="benefits-heading"
  >
    <div className="max-w-7xl mx-auto">
      <h2 id="benefits-heading" className="sr-only">Benefícios da plataforma</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
            <Zap className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Rápido e Fácil</h3>
          <p className="text-gray-400">
            Configure seus jogos em segundos e comece a diversão imediatamente
          </p>
        </article>

        <article className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
            <Shield className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Seguro e Privado</h3>
          <p className="text-gray-400">
            Seus dados são protegidos com criptografia de ponta a ponta
          </p>
        </article>

        <article className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
            <Users className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Comunidade Ativa</h3>
          <p className="text-gray-400">
            Junte-se a milhares de usuários que já transformaram suas festas
          </p>
        </article>
      </div>
    </div>
  </section>
));

BenefitsSection.displayName = "BenefitsSection";

const CTASection = memo(() => (
  <section 
    className="px-4 py-16 sm:px-6 lg:px-8"
    aria-labelledby="cta-heading"
  >
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-12 border border-[#00FF00]/20">
        <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold mb-4">
          Pronto para elevar suas festas?
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Crie sua conta gratuita e comece a jogar agora
        </p>
        <Link
          href="/auth"
          className="inline-block px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
          aria-label="Criar conta gratuita e começar a jogar"
          prefetch={true}
        >
          Começar Gratuitamente
        </Link>
      </div>
    </div>
  </section>
));

CTASection.displayName = "CTASection";

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

  const handleAgeVerification = useMemo(() => (verified: boolean) => {
    setIsAgeVerified(verified);
    setShowModal(false);
    if (verified) {
      localStorage.setItem("age_verified", "true");
    }
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
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
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
