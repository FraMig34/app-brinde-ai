"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, User, Crown } from "lucide-react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/games", label: "Jogos" },
    { href: "/drinks/create", label: "Drinks" },
    { href: "/inventory", label: "Inventário" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FF00] to-[#00FF00]/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-[#0D0D0D]" />
            </div>
            <span className="text-xl font-bold text-white">Brinde.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/premium"
              className="group relative px-4 py-2 bg-gradient-to-r from-[#00FF00] to-[#00FF00]/80 text-[#0D0D0D] rounded-lg font-bold hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Premium
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0D0D0D]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 space-y-2 border-t border-white/10">
              <Link
                href="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <User className="w-5 h-5" />
                Entrar
              </Link>
              <Link
                href="/premium"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00FF00] to-[#00FF00]/80 text-[#0D0D0D] rounded-lg font-bold"
              >
                <Crown className="w-5 h-5" />
                Assinar Premium
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
