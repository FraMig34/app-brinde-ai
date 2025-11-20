"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Hand, Zap, Flame, Skull, Heart, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";
import { CustomCardsManager } from "@/components/custom/custom-cards-manager";
import { supabase } from "@/lib/supabase";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Touch {
  id: number;
  x: number;
  y: number;
  name?: string;
}

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve", drinks: 2 },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado", drinks: 4 },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso", drinks: 6 },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo", drinks: 10 },
};

export default function DedoMagicoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [touches, setTouches] = useState<Touch[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTouch, setSelectedTouch] = useState<Touch | null>(null);
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const isPremium = user?.isPremium || false;

  useEffect(() => {
    // Só redireciona DEPOIS que terminar de carregar
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (!isPremium) {
        router.push("/premium");
      }
    }
  }, [user, isPremium, loading, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isPremium) {
    return null;
  }

  const handleSelectList = (names: string[]) => {
    setFriendNames(names);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSelecting) return;

    const newTouches: Touch[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const name = friendNames[i % friendNames.length] || `Jogador ${i + 1}`;
      newTouches.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        name,
      });
    }
    setTouches(newTouches);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelecting) return;
    
    const name = friendNames[0] || "Jogador 1";
    setTouches([{
      id: 0,
      x: e.clientX,
      y: e.clientY,
      name,
    }]);
  };

  const selectRandom = () => {
    if (touches.length === 0) return;
    
    setIsSelecting(true);
    const randomTouch = touches[Math.floor(Math.random() * touches.length)];
    setSelectedTouch(randomTouch);
  };

  const reset = () => {
    setTouches([]);
    setSelectedTouch(null);
    setIsSelecting(false);
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    reset();
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navigation />

        <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF00] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar aos Jogos
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
                Dedo Mágico
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Todos tocam na tela. Um será escolhido aleatoriamente. Será você?
              </p>
            </div>

            {/* Friend List Selector */}
            <div className="mb-8">
              <FriendListSelector
                userId={user.id}
                onSelectList={(names) => {
                  handleSelectList(names);
                  setSelectedListId(names.length > 0 ? "selected" : null);
                }}
                selectedListId={selectedListId}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(difficultyConfig).map(([level, config]) => {
                const Icon = config.icon;

                return (
                  <button
                    key={level}
                    onClick={() => selectDifficulty(level as DifficultyLevel)}
                    className={`relative p-8 rounded-2xl border ${config.border} ${config.bg} hover:scale-105 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold">{config.label}</h3>
                        <p className="text-sm text-gray-400">{config.drinks} goles</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const config = difficultyConfig[difficulty];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setDifficulty(null)}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF00] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Trocar Dificuldade
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-xl font-bold mb-4">Configurações</h3>
              
              <div>
                <h4 className="font-bold mb-3">Lista de Amigos</h4>
                <FriendListSelector
                  userId={user.id}
                  onSelectList={(names) => {
                    handleSelectList(names);
                    setSelectedListId(names.length > 0 ? "selected" : null);
                  }}
                  selectedListId={selectedListId}
                />
              </div>

              <div>
                <h4 className="font-bold mb-3">Cartas Personalizadas (Premium)</h4>
                <CustomCardsManager
                  userId={user.id}
                  gameType="dedo-magico"
                  difficulty={difficulty}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-bold">{config.label} - {config.drinks} goles</span>
            </div>
          </div>

          <div
            className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 min-h-[500px] flex flex-col items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onMouseDown={handleMouseDown}
          >
            {touches.length === 0 && !selectedTouch && (
              <div className="text-center p-8">
                <Hand className="w-20 h-20 text-[#00FF00] mx-auto mb-6" />
                <p className="text-2xl font-bold mb-2">Todos tocam na tela!</p>
                <p className="text-gray-400">Use vários dedos ou peça para cada um tocar</p>
              </div>
            )}

            {touches.length > 0 && !selectedTouch && (
              <div className="text-center p-8">
                <p className="text-3xl font-bold mb-4">{touches.length} {touches.length === 1 ? "dedo" : "dedos"} detectado(s)</p>
                <p className="text-gray-400">Mantenha todos na tela e clique em "Escolher"</p>
              </div>
            )}

            {selectedTouch && (
              <div className="text-center p-8">
                <div className="w-32 h-32 bg-[#00FF00] rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Hand className="w-16 h-16 text-[#0D0D0D]" />
                </div>
                <p className="text-3xl font-bold mb-2">{selectedTouch.name || "Este"} foi escolhido!</p>
                <p className="text-xl text-gray-400">Beba {config.drinks} goles!</p>
              </div>
            )}

            {/* Touch indicators */}
            {touches.map((touch) => (
              <div
                key={touch.id}
                className={`absolute transition-all duration-300 ${
                  selectedTouch?.id === touch.id
                    ? "w-32 h-32 scale-150"
                    : "w-16 h-16 scale-100"
                }`}
                style={{
                  left: touch.x - (selectedTouch?.id === touch.id ? 64 : 32),
                  top: touch.y - (selectedTouch?.id === touch.id ? 64 : 32),
                }}
              >
                <div className={`w-full h-full rounded-full flex flex-col items-center justify-center ${
                  selectedTouch?.id === touch.id
                    ? "bg-[#00FF00]"
                    : "bg-white/20"
                }`}>
                  <Hand className={`w-8 h-8 ${selectedTouch?.id === touch.id ? "text-[#0D0D0D]" : "text-white"}`} />
                  {touch.name && (
                    <span className={`text-xs font-bold mt-1 ${selectedTouch?.id === touch.id ? "text-[#0D0D0D]" : "text-white"}`}>
                      {touch.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            {touches.length > 0 && !selectedTouch && (
              <button
                onClick={selectRandom}
                className="flex-1 px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105"
              >
                Escolher Aleatoriamente
              </button>
            )}

            {selectedTouch && (
              <button
                onClick={reset}
                className="flex-1 px-8 py-6 bg-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Jogar Novamente
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
