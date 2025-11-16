"use client";

import { useState } from "react";
import { Navigation } from "@/components/custom/navigation";
import { Gamepad2, Lock, Zap, Flame, Skull, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// Definição dos jogos disponíveis
const games = [
  {
    id: "jogo-da-casa",
    name: "Jogo da Casa",
    description: "Frases, desafios, ações e votações aleatórias. Prepare-se para rir muito!",
    icon: Gamepad2,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: true,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "roleta-bebada",
    name: "Roleta Bebada",
    description: "Gire a roleta digital e descubra seu destino. Sorte ou azar?",
    icon: Zap,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: true,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "batata-bebada",
    name: "Batata Bebada",
    description: "Responda rápido antes que o timer exploda! Tensão garantida.",
    icon: Flame,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: true,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
  },
  {
    id: "cumpra-ou-beba",
    name: "Cumpra ou Beba",
    description: "Desafios absurdos. Cumpra ou tome um shot. Você tem coragem?",
    icon: Skull,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: false,
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
  },
  {
    id: "eu-nunca",
    name: "Eu Nunca",
    description: "Descubra segredos dos seus amigos. Quem vai beber mais?",
    icon: Heart,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: false,
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
  },
  {
    id: "verdade-ou-shot",
    name: "Verdade ou Shot",
    description: "Perguntas comprometedoras. Responda ou beba!",
    icon: Zap,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: false,
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
  },
  {
    id: "dedo-magico",
    name: "Dedo Mágico",
    description: "Todos tocam na tela. Um será escolhido aleatoriamente. Será você?",
    icon: Gamepad2,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: false,
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
  },
  {
    id: "jogo-da-velha",
    name: "Jogo da Velha Bebado",
    description: "Jogo da velha com ícones engraçados. Quem perder, bebe!",
    icon: Gamepad2,
    difficulty: ["leve", "moderado"],
    free: false,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    id: "curiosidade-shot",
    name: "Curiosidade = Shot",
    description: "Perguntas secretas. Quer saber? Então beba!",
    icon: Skull,
    difficulty: ["leve", "moderado", "corajoso", "extremo"],
    free: false,
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
  },
  {
    id: "rei-da-rima",
    name: "Rei da Rima",
    description: "Rime com a palavra sorteada. Quem falhar, bebe!",
    icon: Zap,
    difficulty: ["leve", "moderado"],
    free: false,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
  },
];

const difficultyIcons = {
  leve: { icon: Heart, color: "text-green-400", label: "Leve" },
  moderado: { icon: Zap, color: "text-yellow-400", label: "Moderado" },
  corajoso: { icon: Flame, color: "text-orange-400", label: "Corajoso" },
  extremo: { icon: Skull, color: "text-red-400", label: "Extremo" },
};

export default function GamesPage() {
  const { user } = useAuth();
  const isPremium = user?.isPremium || false;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      {/* Header */}
      <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
              Escolha Seu Jogo
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {games.length} jogos épicos para transformar qualquer festa em uma experiência inesquecível
            </p>
          </div>

          {/* Friends Button */}
          <div className="max-w-4xl mx-auto mb-8 flex justify-end">
            <Link
              href="/friends"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF00]/50 rounded-xl transition-all"
            >
              <Users className="w-5 h-5 text-[#00FF00]" />
              <span className="font-medium">Minhas Listas de Amigos</span>
            </Link>
          </div>

          {/* Free vs Premium Info */}
          {!isPremium && (
            <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-[#00FF00]/10 to-transparent rounded-2xl p-6 border border-[#00FF00]/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold mb-1">Conta Gratuita</h3>
                  <p className="text-sm text-gray-400">
                    Acesso a 3 jogos no modo leve. Upgrade para desbloquear tudo!
                  </p>
                </div>
                <Link
                  href="/premium"
                  className="px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  Virar Premium
                </Link>
              </div>
            </div>
          )}

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              const isLocked = !game.free && !isPremium;

              return (
                <div
                  key={game.id}
                  className={`group relative bg-gradient-to-br ${game.color} rounded-2xl p-6 border ${game.borderColor} hover:border-[#00FF00]/50 transition-all duration-300 ${
                    isLocked ? "opacity-60" : "hover:scale-105"
                  }`}
                >
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-[#00FF00] mx-auto mb-3" />
                        <p className="text-sm font-bold text-[#00FF00]">Premium</p>
                      </div>
                    </div>
                  )}

                  <div className="relative z-0">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                      <Icon className="w-7 h-7 text-[#00FF00]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{game.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4">{game.description}</p>

                    {/* Difficulty Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.difficulty.map((diff) => {
                        const DiffIcon = difficultyIcons[diff as keyof typeof difficultyIcons].icon;
                        const diffColor = difficultyIcons[diff as keyof typeof difficultyIcons].color;
                        const diffLabel = difficultyIcons[diff as keyof typeof difficultyIcons].label;
                        
                        // Para usuários gratuitos, apenas o modo leve está disponível em jogos gratuitos
                        const isDiffLocked = !isPremium && (diff !== "leve" || !game.free);

                        return (
                          <div
                            key={diff}
                            className={`flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10 ${
                              isDiffLocked ? "opacity-40" : ""
                            }`}
                          >
                            <DiffIcon className={`w-3 h-3 ${diffColor}`} />
                            <span className="text-xs text-gray-300">{diffLabel}</span>
                            {isDiffLocked && <Lock className="w-3 h-3 text-gray-500 ml-1" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Play Button */}
                    {!isLocked ? (
                      <Link
                        href={`/games/${game.id}`}
                        className="block w-full px-4 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-center hover:bg-[#00FF00]/90 transition-all duration-300"
                      >
                        Jogar Agora
                      </Link>
                    ) : (
                      <Link
                        href="/premium"
                        className="block w-full px-4 py-3 bg-white/10 text-white rounded-xl font-bold text-center hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        Desbloquear
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Brinde.AI - Beba com responsabilidade. Proibido para menores de 18 anos.</p>
        </div>
      </footer>
    </div>
  );
}
