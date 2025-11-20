"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Zap, Flame, Skull, Heart, Plus, X, Settings, Wine, Camera } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";
import { CustomCardsManager } from "@/components/custom/custom-cards-manager";
import { DrinkCameraCapture } from "@/components/custom/drink-camera-capture";
import { supabase } from "@/lib/supabase";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Question {
  text: string;
  drinks: number;
  isCustom?: boolean;
}

const questions: Record<DifficultyLevel, Question[]> = {
  leve: [
    { text: "Qual é sua comida favorita?", drinks: 2 },
    { text: "Qual foi seu último sonho?", drinks: 2 },
    { text: "Qual é seu filme preferido?", drinks: 2 },
    { text: "Qual é sua cor favorita?", drinks: 2 },
    { text: "Qual foi a última série que assistiu?", drinks: 2 },
    { text: "Qual é seu hobby favorito?", drinks: 2 },
    { text: "Qual é sua música preferida?", drinks: 2 },
    { text: "Qual foi seu último livro?", drinks: 2 },
  ],
  moderado: [
    { text: "Qual foi sua maior vergonha na escola?", drinks: 4 },
    { text: "Qual foi o pior presente que já ganhou?", drinks: 4 },
    { text: "Qual foi sua pior mentira?", drinks: 4 },
    { text: "Qual foi seu pior encontro?", drinks: 4 },
    { text: "Qual foi sua maior gafe?", drinks: 4 },
    { text: "Qual foi seu pior corte de cabelo?", drinks: 4 },
    { text: "Qual foi sua pior roupa?", drinks: 4 },
    { text: "Qual foi seu maior mico?", drinks: 4 },
  ],
  corajoso: [
    { text: "Qual é seu maior segredo?", drinks: 6 },
    { text: "Qual foi sua maior traição?", drinks: 6 },
    { text: "Qual é seu maior arrependimento?", drinks: 6 },
    { text: "Qual foi sua maior mentira para um amigo?", drinks: 6 },
    { text: "Qual é seu maior medo?", drinks: 6 },
    { text: "Qual foi sua pior decisão?", drinks: 6 },
    { text: "Qual é seu crush secreto?", drinks: 6 },
    { text: "Qual foi sua maior decepção amorosa?", drinks: 6 },
  ],
  extremo: [
    { text: "Qual é a coisa mais ilegal que já fez?", drinks: 10 },
    { text: "Qual é seu segredo mais sombrio?", drinks: 10 },
    { text: "Qual foi sua maior traição amorosa?", drinks: 10 },
    { text: "Qual é a mentira mais absurda que contou?", drinks: 10 },
    { text: "Qual foi a coisa mais vergonhosa que fez bêbado?", drinks: 10 },
    { text: "Qual é seu fetiche mais estranho?", drinks: 10 },
    { text: "Qual foi a pior coisa que fez para alguém?", drinks: 10 },
    { text: "Qual é o segredo que nunca contou para ninguém?", drinks: 10 },
  ],
};

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve", time: 15 },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado", time: 12 },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso", time: 10 },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo", time: 8 },
};

export default function BatataBebadaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Estados inicializados SEMPRE na mesma ordem
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customCards, setCustomCards] = useState<Question[]>([]);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [showDrinkCamera, setShowDrinkCamera] = useState(false);
  const [showDrinkManagement, setShowDrinkManagement] = useState(false);

  const isPremium = user?.isPremium || false;

  // Efeito 1: Redirect de autenticação
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Efeito 2: Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  // Efeito 3: Carregar cartas personalizadas
  useEffect(() => {
    if (user && difficulty && isPremium) {
      loadCustomCards();
    }
  }, [user, difficulty, isPremium]);

  // Efeito 4: Carregar inventário de bebidas
  useEffect(() => {
    if (user) {
      loadDrinkInventory();
    }
  }, [user]);

  const loadCustomCards = async () => {
    if (!user || !difficulty) return;

    try {
      const { data, error } = await supabase
        .from("custom_cards")
        .select("card_text")
        .eq("user_id", user.id)
        .eq("game_type", "batata-bebada")
        .eq("difficulty", difficulty);

      if (error) throw error;

      const cards = (data || []).map((card) => ({
        text: card.card_text,
        drinks: difficultyConfig[difficulty].time === 15 ? 2 : difficultyConfig[difficulty].time === 12 ? 4 : difficultyConfig[difficulty].time === 10 ? 6 : 10,
        isCustom: true,
      }));

      setCustomCards(cards);
    } catch (error) {
      console.error("Erro ao carregar cartas personalizadas:", error);
    }
  };

  const loadDrinkInventory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("drink_inventory")
        .select("drink_name")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (error) throw error;

      const drinkNames = (data || []).map((item) => item.drink_name);
      setDrinks(drinkNames);
    } catch (error) {
      console.error("Erro ao carregar inventário de bebidas:", error);
    }
  };

  const saveDrinkToInventory = async (drinkName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("drink_inventory")
        .insert({
          user_id: user.id,
          drink_name: drinkName,
        });

      if (error) {
        // Se erro for de duplicata, ignora (bebida já existe)
        if (error.code !== "23505") {
          throw error;
        }
      }
    } catch (error) {
      console.error("Erro ao salvar bebida no inventário:", error);
    }
  };

  const removeDrinkFromInventory = async (drinkName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("drink_inventory")
        .delete()
        .eq("user_id", user.id)
        .eq("drink_name", drinkName);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao remover bebida do inventário:", error);
    }
  };

  // Loading state
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

  // Not authenticated
  if (!user) {
    return null;
  }

  const getAllQuestions = () => {
    if (!difficulty) return [];
    return [...questions[difficulty], ...customCards];
  };

  const addPlayer = () => {
    if (newPlayer.trim() && players.length < 12) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleSelectList = (names: string[]) => {
    setPlayers(names);
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    if (!isPremium && level !== "leve") {
      router.push("/premium");
      return;
    }
    setDifficulty(level);
  };

  const addDrink = async (drinkName: string) => {
    if (drinks.length < 20 && !drinks.includes(drinkName)) {
      setDrinks([...drinks, drinkName]);
      await saveDrinkToInventory(drinkName);
    }
  };

  const removeDrink = async (index: number) => {
    const drinkName = drinks[index];
    setDrinks(drinks.filter((_, i) => i !== index));
    await removeDrinkFromInventory(drinkName);
  };

  const startGame = () => {
    if (players.length < 2 || !difficulty) return;
    
    const questionList = getAllQuestions();
    const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    setCurrentQuestion(randomQuestion);
    setTimeLeft(difficultyConfig[difficulty].time);
    setIsPlaying(true);
    setGameOver(false);
    setGameStarted(true);
  };

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    
    const questionList = getAllQuestions();
    const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    setCurrentQuestion(randomQuestion);
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
                Batata Bebada
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Responda rápido antes que o timer exploda! Escolha o nível de dificuldade.
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
                const isLocked = !isPremium && level !== "leve";

                return (
                  <button
                    key={level}
                    onClick={() => selectDifficulty(level as DifficultyLevel)}
                    className={`relative p-8 rounded-2xl border ${config.border} ${config.bg} hover:scale-105 transition-all duration-300 ${
                      isLocked ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold">{config.label}</h3>
                        <p className="text-sm text-gray-400">{config.time}s por pergunta</p>
                      </div>
                    </div>
                    
                    {isLocked && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#00FF00]/20 text-[#00FF00] text-xs font-bold rounded-full border border-[#00FF00]/30">
                        Premium
                      </div>
                    )}
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

            {!gameStarted && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {showSettings && !gameStarted && (
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

              {isPremium && (
                <div>
                  <h4 className="font-bold mb-3">Cartas Personalizadas (Premium)</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Crie até 10 perguntas personalizadas para este nível de dificuldade
                  </p>
                  <CustomCardsManager
                    userId={user.id}
                    gameType="batata-bebada"
                    difficulty={difficulty}
                    onCardsChange={loadCustomCards}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-bold">{config.label}</span>
            </div>
          </div>

          {!gameStarted ? (
            <div className="space-y-6">
              {/* Drink Management */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wine className="w-5 h-5 text-[#00FF00]" />
                    <h2 className="text-xl font-bold">Inventário de Bebidas</h2>
                  </div>
                  <button
                    onClick={() => setShowDrinkManagement(!showDrinkManagement)}
                    className="text-sm text-gray-400 hover:text-[#00FF00] transition-colors"
                  >
                    {showDrinkManagement ? "Ocultar" : "Gerenciar"}
                  </button>
                </div>

                {showDrinkManagement && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Adicione as bebidas que estão disponíveis. Elas ficarão salvas no seu inventário até que você remova!
                    </p>

                    <button
                      onClick={() => setShowDrinkCamera(true)}
                      className="w-full px-4 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Identificar Bebida por Foto
                    </button>

                    {drinks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                          {drinks.length}/20 bebidas no inventário
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {drinks.map((drink, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20"
                            >
                              <Wine className="w-4 h-4 text-[#00FF00]" />
                              <span className="text-sm">{drink}</span>
                              <button
                                onClick={() => removeDrink(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {drinks.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Nenhuma bebida no inventário ainda
                      </p>
                    )}
                  </div>
                )}

                {!showDrinkManagement && drinks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-2">
                      {drinks.length} bebida{drinks.length !== 1 ? "s" : ""} no inventário
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {drinks.slice(0, 3).map((drink, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20"
                        >
                          <Wine className="w-4 h-4 text-[#00FF00]" />
                          <span className="text-sm">{drink}</span>
                        </div>
                      ))}
                      {drinks.length > 3 && (
                        <div className="px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-sm text-gray-400">
                          +{drinks.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Player Management */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-4">Adicionar Jogadores</h2>
                
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

                {players.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {players.map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20"
                      >
                        <span>{player}</span>
                        <button
                          onClick={() => removePlayer(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {players.length < 2 && (
                  <p className="text-sm text-gray-400 text-center">
                    Adicione pelo menos 2 jogadores para começar
                  </p>
                )}
              </div>

              {players.length >= 2 && (
                <button
                  onClick={startGame}
                  className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105"
                >
                  Começar Jogo
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Player */}
              <div className="bg-gradient-to-br from-[#00FF00]/20 to-transparent rounded-2xl p-6 border border-[#00FF00]/30 text-center">
                <p className="text-sm text-gray-400 mb-2">Vez de</p>
                <h2 className="text-3xl font-bold">{currentPlayer}</h2>
              </div>

              {/* Timer */}
              {isPlaying && (
                <div className="relative">
                  <div className="w-32 h-32 mx-auto">
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
                </div>
              )}

              {/* Question */}
              {currentQuestion && !gameOver && (
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center min-h-[200px] flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold mb-4">{currentQuestion.text}</p>
                  {currentQuestion.isCustom && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-full">
                      <span className="text-xs text-[#00FF00] font-bold">Carta Personalizada</span>
                    </div>
                  )}
                </div>
              )}

              {/* Game Over */}
              {gameOver && currentQuestion && (
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl p-8 border border-red-500/30 text-center">
                  <h3 className="text-3xl font-bold mb-4">Tempo Esgotado!</h3>
                  <p className="text-xl text-gray-300 mb-2">{currentPlayer} bebe {currentQuestion.drinks} goles!</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                {!isPlaying && !gameOver && (
                  <button
                    onClick={startGame}
                    className="flex-1 px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300"
                  >
                    Iniciar Timer
                  </button>
                )}
                
                {(gameOver || !isPlaying) && currentQuestion && (
                  <button
                    onClick={nextPlayer}
                    className="flex-1 px-8 py-6 bg-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Próximo Jogador
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Drink Camera Modal */}
      {showDrinkCamera && (
        <DrinkCameraCapture
          onDrinkConfirmed={(drinkName) => {
            addDrink(drinkName);
            setShowDrinkCamera(false);
          }}
          onClose={() => setShowDrinkCamera(false)}
        />
      )}
    </div>
  );
}
