"use client";

import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF00]/10 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-400 text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Aceitação dos Termos</h2>
                <p className="text-gray-400">
                  Ao acessar e usar o Brinde.AI, você concorda com estes termos de uso. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Uso da Plataforma</h2>
                <p className="text-gray-400 mb-4">
                  Você concorda em usar o Brinde.AI apenas para fins legais e de acordo com estas diretrizes:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Ter 18 anos ou mais para acessar conteúdo relacionado a bebidas alcoólicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Não usar a plataforma para atividades ilegais ou prejudiciais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Respeitar os direitos de outros usuários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Não tentar acessar áreas restritas da plataforma</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Responsabilidade</h2>
                <p className="text-gray-400 mb-4">
                  O Brinde.AI é uma plataforma de entretenimento. Você é responsável por:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Consumir bebidas alcoólicas de forma responsável</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Conhecer seus limites e respeitar os limites dos outros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Não dirigir após consumir álcool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Seguir as leis locais sobre consumo de álcool</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Proibições</h2>
                <p className="text-gray-400 mb-4">
                  É estritamente proibido:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Compartilhar conteúdo ofensivo ou discriminatório</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Fazer spam ou enviar mensagens não solicitadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Tentar hackear ou comprometer a segurança da plataforma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Usar bots ou automação não autorizada</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Propriedade Intelectual</h2>
                <p className="text-gray-400">
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logos e software, é propriedade do Brinde.AI e protegido por leis de direitos autorais.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Modificações</h2>
                <p className="text-gray-400">
                  Reservamos o direito de modificar estes termos a qualquer momento. Mudanças significativas serão comunicadas aos usuários. O uso continuado da plataforma após alterações constitui aceitação dos novos termos.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-2xl p-8 border border-[#00FF00]/20 text-center">
            <p className="text-gray-400 mb-4">
              Para dúvidas sobre estes termos, entre em contato:
            </p>
            <a 
              href="mailto:legal@brinde.ai"
              className="text-[#00FF00] hover:underline font-medium"
            >
              legal@brinde.ai
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
