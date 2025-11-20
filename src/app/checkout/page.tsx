"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Check, CreditCard, Shield, Zap, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [region, setRegion] = useState<'brasil' | 'portugal'>('brasil');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      toast.error("Você precisa estar logado para continuar");
      router.push("/auth");
      return;
    }

    // Buscar dados do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userData) {
      setUser(userData);
      setRegion(userData.region);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Erro ao carregar dados do usuário");
      return;
    }

    setLoading(true);

    try {
      // Criar pedido no Paga Keoto
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          region: region,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirecionar para página de pagamento do Paga Keoto
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Erro ao processar pagamento");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento");
      setLoading(false);
    }
  };

  const price = region === 'brasil' ? 'R$ 19,90' : '€ 4,99';
  const currency = region === 'brasil' ? 'BRL' : 'EUR';

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#00FF00]" />
            <span className="text-sm text-[#00FF00] font-medium">Upgrade para Premium</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-gray-400 text-lg">
            Acesso completo a todos os jogos, modos e recursos exclusivos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plano Premium */}
          <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-2xl p-8 border border-[#00FF00]/30">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">Premium</h2>
              <span className="px-2 py-1 bg-[#00FF00] text-[#0D0D0D] text-xs font-bold rounded">
                POPULAR
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-[#00FF00]">{price}</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Cancele quando quiser, sem compromisso
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">Todos os Jogos Desbloqueados</p>
                  <p className="text-sm text-gray-400">Acesso completo a 10+ jogos épicos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">Modos Extremos</p>
                  <p className="text-sm text-gray-400">Desafios intensos para os corajosos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">Cartas Personalizadas</p>
                  <p className="text-sm text-gray-400">Crie suas próprias cartas e desafios</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">5 Listas de Jogadores</p>
                  <p className="text-sm text-gray-400">Salve suas turmas favoritas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">Sem Anúncios</p>
                  <p className="text-sm text-gray-400">Experiência limpa e sem interrupções</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#00FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00FF00]" />
                </div>
                <div>
                  <p className="font-medium">Suporte Prioritário</p>
                  <p className="text-sm text-gray-400">Atendimento rápido e dedicado</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Assinar Agora
                </>
              )}
            </button>
          </div>

          {/* Informações de Segurança */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00FF00]" />
                </div>
                <h3 className="text-lg font-bold">Pagamento Seguro</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Processado pelo Paga Keoto, plataforma líder em pagamentos seguros para Brasil e Portugal. Seus dados são protegidos com criptografia de ponta.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#00FF00]" />
                </div>
                <h3 className="text-lg font-bold">Ativação Instantânea</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Após a confirmação do pagamento, seu acesso Premium é ativado automaticamente. Comece a usar todos os recursos imediatamente.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#00FF00]" />
                </div>
                <h3 className="text-lg font-bold">Métodos de Pagamento</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Cartão de Crédito (Visa, Mastercard, Elo)</p>
                <p>• PIX (Brasil)</p>
                <p>• Multibanco (Portugal)</p>
                <p>• MB WAY (Portugal)</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00FF00]/5 to-transparent rounded-2xl p-6 border border-[#00FF00]/20">
              <h3 className="text-lg font-bold mb-2">Garantia de 7 Dias</h3>
              <p className="text-gray-400 text-sm">
                Não está satisfeito? Reembolsamos 100% do seu dinheiro nos primeiros 7 dias, sem perguntas.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <details className="bg-white/5 rounded-xl p-6 border border-white/10 group">
              <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                Posso cancelar a qualquer momento?
                <span className="text-[#00FF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4 text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento através do seu perfil. Não há multas ou taxas de cancelamento.
              </p>
            </details>

            <details className="bg-white/5 rounded-xl p-6 border border-white/10 group">
              <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                O pagamento é seguro?
                <span className="text-[#00FF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4 text-sm">
                Absolutamente! Utilizamos o Paga Keoto, uma plataforma certificada e segura. Seus dados de pagamento são criptografados e nunca armazenados em nossos servidores.
              </p>
            </details>

            <details className="bg-white/5 rounded-xl p-6 border border-white/10 group">
              <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                Quando meu Premium é ativado?
                <span className="text-[#00FF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4 text-sm">
                Seu acesso Premium é ativado instantaneamente após a confirmação do pagamento. Você receberá um email de confirmação e poderá usar todos os recursos imediatamente.
              </p>
            </details>

            <details className="bg-white/5 rounded-xl p-6 border border-white/10 group">
              <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                Posso usar em múltiplos dispositivos?
                <span className="text-[#00FF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4 text-sm">
                Sim! Sua conta Premium funciona em todos os seus dispositivos. Basta fazer login com suas credenciais.
              </p>
            </details>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
