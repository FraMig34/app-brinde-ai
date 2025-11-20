"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Zap, Heart, Plus, X, Music, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";
import { CustomCardsManager } from "@/components/custom/custom-cards-manager";
import { supabase } from "@/lib/supabase";

type DifficultyLevel = "leve" | "moderado";

interface Word {
  text: string;
  isCustom?: boolean;
}

const words: Record<DifficultyLevel, Word[]> = {
  leve: [
    { text: "amor" }, { text: "casa" }, { text: "gato" }, { text: "sol" }, 
    { text: "mar" }, { text: "flor" }, { text: "lua" }, { text: "céu" },
    { text: "pão" }, { text: "mel" }, { text: "luz" }, { text: "paz" }, 
    { text: "cor" }, { text: "som" }, { text: "dor" }, { text: "sal" },
    { text: "mão" }, { text: "pé" }, { text: "voz" }, { text: "ar" }, 
    { text: "fé" }, { text: "rei" }, { text: "lei" }, { text: "bem" },
  ],
  moderado: [
    { text: "coração" }, { text: "saudade" }, { text: "paixão" }, { text: "emoção" }, 
    { text: "canção" }, { text: "razão" }, { text: "ilusão" }, { text: "solidão" },
    { text: "amizade" }, { text: "liberdade" }, { text: "felicidade" }, { text: "verdade" }, 
    { text: "cidade" }, { text: "vontade" }, { text: "idade" },
    { text: "esperança" }, { text: "lembrança" }, { text: "mudança" }, { text: "confiança" }, 
    { text: "dança" }, { text: "criança" }, { text: "balança" },
  ],
};

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve", time: 20 },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado", time: 15 },
};

export default function ReiDaRimaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [usedWords, setUsedWords] = useState<Word[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customCards, setCustomCards] = useState<Word[]>([]);

  const isPremium = user?.isPremium || false;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (!isPremium) {
        router.push("/premium");
      }
    }
  }, [user, isPremium, loading, router]);

  useEffect(() => {
    if (user && difficulty) {
      loadCustomCards();
    }
  }, [user, difficulty]);

  const loadCustomCards = async () => {
    if (!user || !difficulty) return;

    try {
      const { data, error } = await supabase
        .from("custom_cards")
        .select("card_text")
        .eq("user_id", user.id)
        .eq("game_type", "rei-da-rima")
        .eq("difficulty", difficulty);

      if (error) throw error;

      const cards = (data || []).map((card) => ({
        text: card.card_text,
        isCustom: true,
      }));

      setCustomCards(cards);
    } catch (error) {
      console.error("Erro ao carregar cartas personalizadas:", error);
    }
  };

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const addPlayer = () => {
    if (newPlayer.trim() && players.length < 12) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
  };

  const handleSelectList = (names: string[]) => {
    setPlayers(names);
  };

  const getAllWords = () => {
    return [...words[difficulty!], ...customCards];
  };

  const getRandomWord = () => {
    const allWords = getAllWords();
    const availableWords = allWords.filter(w => !usedWords.includes(w));
    
    if (availableWords.length === 0) {
      setUsedWords([]);
      return allWords[Math.floor(Math.random() * allWords.length)];
    }
    
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setUsedWords([...usedWords, word]);
    return word;
  };

  const startRound = () => {
    if (players.length < 2 || !difficulty) return;
    
    const word = getRandomWord();
    setCurrentWord(word);
    setTimeLeft(difficultyConfig[difficulty].time);
    setIsPlaying(true);
    setGameOver(false);
  };

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    
    const word = getRandomWord();
    setCurrentWord(word);
    setTimeLeft(difficultyConfig[difficulty!].time);
    setIsPlaying(true);
    setGameOver(false);
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
                Rei da Rima
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Rime com a palavra sorteada. Quem falhar, bebe!
              </p>
            </div>

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
                        <p className="text-sm text-gray-400">{config.time}s por rodada</p>
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
  const currentPlayer = players[currentPlayerIndex];

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

            {!currentWord && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {showSettings && !currentWord && (
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
                <h4 className="font-bold mb-3">Palavras Personalizadas (Premium)</h4>
                <CustomCardsManager
                  userId={user.id}
                  gameType="rei-da-rima"
                  difficulty={difficulty}
                  onCardsChange={loadCustomCards}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-bold">{config.label}</span>
            </div>
          </div>

          {players.length === 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center">Adicionar Jogadores</h2>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                    placeholder="Nome do jogador"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50"
                    maxLength={20}
                  />
                  <button
                    onClick={addPlayer}
                    disabled={players.length >= 12}
                    className="px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-400 text-center">
                  Adicione pelo menos 2 jogadores para começar
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Player */}
              <div className="bg-gradient-to-br from-[#00FF00]/20 to-transparent rounded-2xl p-6 border border-[#00FF00]/30 text-center">
                <p className="text-sm text-gray-400 mb-2">Vez de</p>
                <h2 className="text-3xl font-bold">{currentPlayer}</h2>
              </div>

              {/* Word & Timer */}
              {currentWord && (
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Music className="w-8 h-8 text-[#00FF00]" />
                    <p className="text-sm text-gray-400">Rime com:</p>
                  </div>
                  <p className="text-5xl font-bold mb-8 text-[#00FF00]">{currentWord.text}</p>

                  {currentWord.isCustom && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-full">
                      <span className="text-xs text-[#00FF00] font-bold">Palavra Personalizada</span>
                    </div>
                  )}

                  {isPlaying && (
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#00FF00"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeLeft / config.time)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{timeLeft}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Game Over */}
              {gameOver && (
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl p-8 border border-red-500/30 text-center">
                  <h3 className="text-3xl font-bold mb-4">Tempo Esgotado!</h3>
                  <p className="text-xl text-gray-300 mb-2">{currentPlayer} bebe 3 goles!</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                {!isPlaying && !gameOver && currentWord && (
                  <button
                    onClick={startRound}
                    className="flex-1 px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300"
                  >
                    Iniciar Timer
                  </button>
                )}
                
                {(gameOver || (!isPlaying && currentWord)) && (
                  <button
                    onClick={nextPlayer}
                    className="flex-1 px-8 py-6 bg-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Próximo Jogador
                  </button>
                )}

                {!currentWord && (
                  <button
                    onClick={startRound}
                    className="flex-1 px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300"
                  >
                    Começar Rodada
                  </button>
                )}
              </div>

              {/* Players List */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold mb-3">Jogadores ({players.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-lg border ${
                        index === currentPlayerIndex
                          ? "bg-[#00FF00]/20 border-[#00FF00]/30 text-[#00FF00]"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      {player}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {players.length >= 2 && !currentWord && (
            <button
              onClick={startRound}
              className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 mt-6"
            >
              Começar Jogo
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
