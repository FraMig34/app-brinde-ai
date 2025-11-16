"use client";

import Link from "next/link";
import { Sparkles, Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00FF00] to-[#00FF00]/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-[#0D0D0D]" />
              </div>
              <span className="text-xl font-bold text-white">Brinde.AI</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              A plataforma definitiva para jogos de bebida inteligentes e drinks personalizados com IA. Transforme suas festas em experiências inesquecíveis.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF00]/10 hover:text-[#00FF00] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF00]/10 hover:text-[#00FF00] transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF00]/10 hover:text-[#00FF00] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@brinde.ai"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF00]/10 hover:text-[#00FF00] transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links - Produto */}
          <div>
            <h3 className="text-white font-bold mb-4">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Jogos
                </Link>
              </li>
              <li>
                <Link href="/drinks/create" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Criar Drinks
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Inventário
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Empresa */}
          <div>
            <h3 className="text-white font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-[#00FF00] transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Brinde.AI - Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm text-center md:text-right">
              Beba com responsabilidade. Proibido para menores de 18 anos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
