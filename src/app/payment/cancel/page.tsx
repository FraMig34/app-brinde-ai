"use client";

import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/5 rounded-3xl p-12 border border-white/10">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Pagamento Cancelado
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105"
            >
              Tentar Novamente
            </Link>
            
            <Link
              href="/"
              className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              Voltar ao Início
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Precisa de ajuda? Entre em contato com nosso suporte
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
