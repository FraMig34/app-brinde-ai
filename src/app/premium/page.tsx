"use client";

import { useState } from 'react';
import { Navigation } from '@/components/custom/navigation';
import { Footer } from '@/components/custom/footer';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { getStripe } from '@/lib/stripe-client';
import { toast } from 'sonner';

const plans = [
  {
    id: 'monthly',
    name: 'Premium Mensal',
    price: 'R$ 19,90',
    interval: '/mês',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    features: [
      'Todos os jogos desbloqueados',
      'Modos extremos e corajosos',
      'Cartas personalizadas ilimitadas',
      '5 listas de jogadores salvas',
      'Sem anúncios',
      'Suporte prioritário',
      'Novos jogos em primeira mão',
      'Drinks IA ilimitados',
    ],
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Premium Anual',
    price: 'R$ 199,90',
    interval: '/ano',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
    savings: 'Economize R$ 38,90',
    features: [
      'Todos os jogos desbloqueados',
      'Modos extremos e corajosos',
      'Cartas personalizadas ilimitadas',
      '5 listas de jogadores salvas',
      'Sem anúncios',
      'Suporte prioritário',
      'Novos jogos em primeira mão',
      'Drinks IA ilimitados',
      '2 meses grátis',
    ],
    popular: true,
  },
];

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | undefined, planId: string) => {
    if (!priceId) {
      toast.error('Configuração de preço não encontrada');
      return;
    }

    setLoading(planId);

    try {
      // Aqui você pegaria o userId e userEmail do contexto de autenticação
      // Por enquanto, usando valores de exemplo
      const userId = 'user_123'; // TODO: Pegar do contexto de auth
      const userEmail = 'usuario@exemplo.com'; // TODO: Pegar do contexto de auth

      // Criar sessão de checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de pagamento');
      }

      const { sessionId } = await response.json();

      // Redirecionar para o checkout do Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe não carregado');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-6">
              <Crown className="w-4 h-4 text-[#00FF00]" />
              <span className="text-sm text-[#00FF00] font-medium">
                Desbloqueie Todo o Potencial
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
              Brinde.AI Premium
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Acesso ilimitado a todos os jogos, modos extremos e recursos exclusivos
            </p>
          </div>

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${
                  plan.popular
                    ? 'from-[#00FF00]/10 to-[#00FF00]/[0.02] border-[#00FF00]/30'
                    : 'from-white/5 to-white/[0.02] border-white/10'
                } rounded-3xl p-8 border transition-all duration-300 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 bg-[#00FF00] text-[#0D0D0D] rounded-full text-sm font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.interval}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-[#00FF00] text-sm mt-2">{plan.savings}</p>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  disabled={loading !== null}
                  className={`w-full mb-6 ${
                    plan.popular
                      ? 'bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {loading === plan.id ? 'Processando...' : 'Assinar Agora'}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00FF00] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acesso Instantâneo</h3>
              <p className="text-gray-400">
                Desbloqueie todos os recursos imediatamente após o pagamento
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
              <p className="text-gray-400">
                Processado pelo Stripe com criptografia de ponta a ponta
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cancele Quando Quiser</h3>
              <p className="text-gray-400">
                Sem compromisso. Cancele sua assinatura a qualquer momento
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              <details className="bg-white/5 rounded-xl p-6 border border-white/10">
                <summary className="font-bold cursor-pointer">
                  Como funciona o pagamento?
                </summary>
                <p className="text-gray-400 mt-3">
                  Utilizamos o Stripe, uma das plataformas de pagamento mais seguras do mundo. Seus dados de cartão são criptografados e nunca passam pelos nossos servidores.
                </p>
              </details>

              <details className="bg-white/5 rounded-xl p-6 border border-white/10">
                <summary className="font-bold cursor-pointer">
                  Posso cancelar a qualquer momento?
                </summary>
                <p className="text-gray-400 mt-3">
                  Sim! Você pode cancelar sua assinatura a qualquer momento através do portal de gerenciamento. Você continuará tendo acesso até o final do período pago.
                </p>
              </details>

              <details className="bg-white/5 rounded-xl p-6 border border-white/10">
                <summary className="font-bold cursor-pointer">
                  Quais métodos de pagamento são aceitos?
                </summary>
                <p className="text-gray-400 mt-3">
                  Aceitamos todos os principais cartões de crédito e débito (Visa, Mastercard, American Express, etc).
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
