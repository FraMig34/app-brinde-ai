"use client";

import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-6">
              <Shield className="w-4 h-4 text-[#00FF00]" />
              <span className="text-sm text-[#00FF00] font-medium">Pagamento Seguro</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Processamento de Pagamento
            </h1>
            <p className="text-xl text-gray-400">
              Complete sua assinatura Premium
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-8 sm:p-12 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <CreditCard className="w-8 h-8 text-[#00FF00]" />
              <h2 className="text-2xl font-bold">Plano Premium</h2>
            </div>

            {/* Price Summary */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Plano Mensal</span>
                <span className="text-2xl font-bold text-white">R$ 19,90</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Renovação automática</span>
                <span>Cancele quando quiser</span>
              </div>
            </div>

            {/* Placeholder for Payment Integration */}
            <div className="bg-gradient-to-br from-[#00FF00]/5 to-transparent rounded-2xl p-8 border border-[#00FF00]/20 text-center">
              <Lock className="w-12 h-12 text-[#00FF00] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Integração de Pagamento</h3>
              <p className="text-gray-400 mb-6">
                Esta área será integrada com seu gateway de pagamento preferido
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <p>✓ Stripe, PayPal, Mercado Pago</p>
                <p>✓ Pagamento seguro com criptografia SSL</p>
                <p>✓ Garantia de 7 dias</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos com criptografia de ponta</span>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Ao confirmar o pagamento, você concorda com nossos</p>
            <p>
              <Link href="/terms" className="text-[#00FF00] hover:underline">
                Termos de Serviço
              </Link>
              {" e "}
              <Link href="/privacy" className="text-[#00FF00] hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
