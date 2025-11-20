"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/custom/navigation';
import { Footer } from '@/components/custom/footer';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aqui você pode verificar o status do pagamento
    // e atualizar o status do usuário no banco de dados
    if (sessionId) {
      // TODO: Verificar sessão e atualizar usuário
      console.log('Session ID:', sessionId);
      setTimeout(() => setLoading(false), 1500);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Processando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-[#00FF00]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-[#00FF00]" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Pagamento Confirmado!
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              Bem-vindo ao Brinde.AI Premium! 🎉
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-8 border border-[#00FF00]/20 mb-8">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#00FF00]" />
              <h2 className="text-2xl font-bold">Você agora tem acesso a:</h2>
            </div>

            <ul className="space-y-3 text-left max-w-md mx-auto">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                <span>Todos os jogos desbloqueados</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                <span>Modos extremos e corajosos</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                <span>Cartas personalizadas ilimitadas</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                <span>Drinks IA ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                <span>Experiência sem anúncios</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/games">
              <Button className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90 px-8">
                Explorar Jogos
              </Button>
            </Link>

            <Link href="/drinks/create">
              <Button variant="outline" className="px-8">
                Criar Drinks
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Você receberá um email de confirmação em breve com os detalhes da sua assinatura.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
