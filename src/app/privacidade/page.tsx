"use client";

import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF00]/10 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-400 text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Coleta de Dados</h2>
                <p className="text-gray-400">
                  Coletamos apenas as informações necessárias para fornecer nossos serviços, incluindo:
                </p>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Informações de conta (email, nome de usuário)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Dados de uso da plataforma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Preferências e configurações</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Uso dos Dados</h2>
                <p className="text-gray-400">
                  Utilizamos seus dados para:
                </p>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Fornecer e melhorar nossos serviços</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Personalizar sua experiência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Comunicar atualizações e novidades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Garantir a segurança da plataforma</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Armazenamento e Segurança</h2>
                <p className="text-gray-400">
                  Seus dados são protegidos com:
                </p>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Criptografia de ponta a ponta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Servidores seguros e certificados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Backups regulares e redundância</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Monitoramento contínuo de segurança</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Seus Direitos</h2>
                <p className="text-gray-400">
                  Você tem direito a:
                </p>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Acessar seus dados pessoais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Corrigir informações incorretas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Solicitar exclusão de dados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FF00] mt-1">•</span>
                    <span>Exportar seus dados</span>
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
                <h2 className="text-2xl font-bold mb-2">Contato</h2>
                <p className="text-gray-400">
                  Para questões sobre privacidade, entre em contato:
                </p>
                <div className="mt-4">
                  <a 
                    href="mailto:privacidade@brinde.ai"
                    className="text-[#00FF00] hover:underline"
                  >
                    privacidade@brinde.ai
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
