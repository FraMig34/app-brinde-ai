"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Zap, Flame, Skull, Heart, Plus, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Question {
  text: string;
  drinks: number;
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
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const isPremium = user?.isPremium || false;

  // Redirect if not authenticated - moved to useEffect
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  // Show loading while checking auth
  if (!user) {
    return null;
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      // Tempo esgotado
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
    if (!isPremium && level !== "leve") {
      router.push("/premium");
      return;
    }
    setDifficulty(level);
  };

  const startGame = () => {
    if (players.length < 2 || !difficulty) return;
    
    const questionList = questions[difficulty];
    const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    setCurrentQuestion(randomQuestion);
    setTimeLeft(difficultyConfig[difficulty].time);
    setIsPlaying(true);
    setGameOver(false);
  };

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    
    const questionList = questions[difficulty!];
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
          <button
            onClick={() => setDifficulty(null)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF00] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Trocar Dificuldade
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-bold">{config.label}</span>
            </div>
          </div>

          {players.length === 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Adicionar Jogadores</h2>
              
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
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center min-h-[200px] flex items-center justify-center">
                  <p className="text-2xl font-bold">{currentQuestion.text}</p>
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
    </div>
  );
}
