"use client";

import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Sparkles, Target, Users, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF00]/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Sobre o Brinde.AI
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transformando festas em experiências inesquecíveis através da tecnologia e inteligência artificial
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Nossa História</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              O Brinde.AI nasceu da paixão por criar momentos memoráveis entre amigos. Percebemos que as festas e reuniões poderiam ser muito mais divertidas e interativas com a ajuda da tecnologia. Combinamos jogos clássicos de bebida com inteligência artificial para criar uma plataforma única que revoluciona a forma como as pessoas se divertem juntas.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nossa Missão</h3>
              <p className="text-gray-400">
                Tornar cada festa uma experiência única e inesquecível, fornecendo ferramentas inovadoras que conectam pessoas e criam memórias duradouras.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nossa Visão</h3>
              <p className="text-gray-400">
                Ser a plataforma número 1 em entretenimento social, reconhecida globalmente por inovar na forma como as pessoas se divertem e interagem.
              </p>
            </div>
          </div>

          <section className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-2xl p-8 border border-[#00FF00]/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#00FF00]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-[#00FF00] mb-2">Inovação</h4>
                    <p className="text-gray-400">
                      Buscamos constantemente novas formas de melhorar a experiência dos usuários através da tecnologia.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#00FF00] mb-2">Responsabilidade</h4>
                    <p className="text-gray-400">
                      Promovemos o consumo consciente e responsável de bebidas alcoólicas.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#00FF00] mb-2">Comunidade</h4>
                    <p className="text-gray-400">
                      Valorizamos cada membro da nossa comunidade e suas contribuições.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#00FF00] mb-2">Diversão</h4>
                    <p className="text-gray-400">
                      Acreditamos que a diversão é essencial para criar conexões genuínas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Nossa Comunidade</h2>
                <p className="text-gray-400 mb-6">
                  Mais de 50.000 usuários ativos confiam no Brinde.AI para tornar suas festas mais divertidas. Junte-se a uma comunidade apaixonada por criar momentos especiais.
                </p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#00FF00] mb-1">50k+</div>
                    <div className="text-sm text-gray-400">Usuários Ativos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#00FF00] mb-1">1M+</div>
                    <div className="text-sm text-gray-400">Jogos Jogados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#00FF00] mb-1">10k+</div>
                    <div className="text-sm text-gray-400">Drinks Criados</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-12 border border-[#00FF00]/20 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Faça Parte da Nossa História
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram suas festas com o Brinde.AI
            </p>
            <a
              href="/auth"
              className="inline-block px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
            >
              Começar Agora
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
