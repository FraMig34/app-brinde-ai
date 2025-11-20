"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { CheckCircle, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Aguardar alguns segundos para o webhook processar
      await new Promise(resolve => setTimeout(resolve, 3000));

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      // Verificar se usuário está premium
      const { data: userData } = await supabase
        .from("users")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (userData?.is_premium) {
        setVerified(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00FF00] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-12 border border-[#00FF00]/20">
          <div className="w-20 h-20 bg-[#00FF00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#00FF00]" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Pagamento Confirmado!
          </h1>

          {verified ? (
            <>
              <p className="text-gray-400 text-lg mb-8">
                Seu acesso Premium foi ativado com sucesso. Aproveite todos os recursos exclusivos!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games"
                  className="px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105"
                >
                  Explorar Jogos
                </Link>
                
                <Link
                  href="/profile"
                  className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  Ver Perfil
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-[#00FF00] mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">Recursos Desbloqueados</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>✓ Todos os jogos</div>
                  <div>✓ Modos extremos</div>
                  <div>✓ Cartas personalizadas</div>
                  <div>✓ 5 listas de jogadores</div>
                  <div>✓ Sem anúncios</div>
                  <div>✓ Suporte prioritário</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-lg mb-8">
                Seu pagamento foi processado. Estamos ativando seu acesso Premium, isso pode levar alguns minutos.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300"
              >
                Verificar Novamente
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Se o problema persistir, entre em contato com o suporte
              </p>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
