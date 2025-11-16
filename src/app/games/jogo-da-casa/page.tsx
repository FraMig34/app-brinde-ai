"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Users, Zap, Flame, Skull, Heart, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Card {
  type: "frase" | "desafio" | "acao" | "votacao";
  content: string;
  difficulty: DifficultyLevel;
}

const cards: Card[] = [
  // LEVE
  { type: "frase", content: "Conte uma piada. Se ninguém rir, beba 2 goles.", difficulty: "leve" },
  { type: "desafio", content: "Faça 10 polichinelos. Se não conseguir, beba 3 goles.", difficulty: "leve" },
  { type: "acao", content: "Escolha alguém para beber 1 gole com você.", difficulty: "leve" },
  { type: "votacao", content: "Votação: Quem é o mais engraçado? O perdedor bebe 2 goles.", difficulty: "leve" },
  { type: "frase", content: "Imite um animal. O grupo vota se foi bom. Se não, beba 2 goles.", difficulty: "leve" },
  { type: "desafio", content: "Fale 5 palavras que começam com 'B' em 10 segundos. Falhou? Beba 2 goles.", difficulty: "leve" },
  { type: "acao", content: "Distribua 3 goles entre os jogadores como quiser.", difficulty: "leve" },
  { type: "votacao", content: "Votação: Quem tem o melhor estilo? O vencedor escolhe quem bebe 2 goles.", difficulty: "leve" },
  
  // MODERADO
  { type: "frase", content: "Conte um segredo constrangedor. Se recusar, beba 4 goles.", difficulty: "moderado" },
  { type: "desafio", content: "Fique em uma perna só por 30 segundos. Falhou? Beba 4 goles.", difficulty: "moderado" },
  { type: "acao", content: "Escolha 2 pessoas para beberem 3 goles cada.", difficulty: "moderado" },
  { type: "votacao", content: "Votação: Quem é o mais dramático? O 'vencedor' bebe 4 goles.", difficulty: "moderado" },
  { type: "frase", content: "Cante uma música infantil. Se errar a letra, beba 4 goles.", difficulty: "moderado" },
  { type: "desafio", content: "Faça uma dança estranha por 20 segundos. Se recusar, beba 5 goles.", difficulty: "moderado" },
  { type: "acao", content: "Todos bebem 2 goles, exceto você.", difficulty: "moderado" },
  { type: "votacao", content: "Votação: Quem seria o pior motorista? O 'vencedor' bebe 4 goles.", difficulty: "moderado" },
  
  // CORAJOSO
  { type: "frase", content: "Revele seu crush secreto. Se recusar, beba 6 goles.", difficulty: "corajoso" },
  { type: "desafio", content: "Ligue para alguém e declare seu amor. Se recusar, beba 7 goles.", difficulty: "corajoso" },
  { type: "acao", content: "Escolha alguém para fazer um shot com você. Depois, distribua 5 goles.", difficulty: "corajoso" },
  { type: "votacao", content: "Votação: Quem seria o melhor em uma ilha deserta? O perdedor bebe 6 goles.", difficulty: "corajoso" },
  { type: "frase", content: "Conte a mentira mais absurda que já contou. Se recusar, beba 6 goles.", difficulty: "corajoso" },
  { type: "desafio", content: "Poste algo constrangedor nas redes sociais. Se recusar, beba 8 goles.", difficulty: "corajoso" },
  { type: "acao", content: "Faça um shot e escolha 2 pessoas para fazerem também.", difficulty: "corajoso" },
  { type: "votacao", content: "Votação: Quem é o mais provável de ser preso? O 'vencedor' bebe 6 goles.", difficulty: "corajoso" },
  
  // EXTREMO
  { type: "frase", content: "Revele seu maior arrependimento. Se recusar, beba 10 goles.", difficulty: "extremo" },
  { type: "desafio", content: "Beije alguém do grupo (com consentimento). Se recusar, beba 12 goles.", difficulty: "extremo" },
  { type: "acao", content: "Todos fazem um shot. Você faz dois.", difficulty: "extremo" },
  { type: "votacao", content: "Votação: Quem é o mais provável de trair? O 'vencedor' bebe 10 goles.", difficulty: "extremo" },
  { type: "frase", content: "Conte algo que nunca contou para ninguém. Se recusar, beba 12 goles.", difficulty: "extremo" },
  { type: "desafio", content: "Tire uma peça de roupa. Se recusar, beba 15 goles.", difficulty: "extremo" },
  { type: "acao", content: "Escolha 3 pessoas para fazerem um shot. Você faz dois.", difficulty: "extremo" },
  { type: "votacao", content: "Votação: Quem seria o pior namorado(a)? O 'vencedor' bebe 10 goles.", difficulty: "extremo" },
];

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve" },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado" },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso" },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo" },
};

const typeConfig = {
  frase: { label: "Frase", color: "bg-blue-500/20 border-blue-500/30" },
  desafio: { label: "Desafio", color: "bg-purple-500/20 border-purple-500/30" },
  acao: { label: "Ação", color: "bg-green-500/20 border-green-500/30" },
  votacao: { label: "Votação", color: "bg-orange-500/20 border-orange-500/30" },
};

export default function JogoDaCasaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [usedCards, setUsedCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

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

  const getAvailableCards = () => {
    return cards.filter(
      (card) => card.difficulty === difficulty && !usedCards.includes(card)
    );
  };

  const drawCard = () => {
    const availableCards = getAvailableCards();
    
    if (availableCards.length === 0) {
      // Resetar cartas usadas se acabaram
      setUsedCards([]);
      const allCards = cards.filter((card) => card.difficulty === difficulty);
      const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
      setCurrentCard(randomCard);
      setUsedCards([randomCard]);
    } else {
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      setCurrentCard(randomCard);
      setUsedCards([...usedCards, randomCard]);
    }
    
    setIsFlipped(true);
    setTimeout(() => setIsFlipped(false), 300);
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    // Verificar se usuário tem acesso
    if (!isPremium && level !== "leve") {
      router.push("/premium");
      return;
    }
    
    setDifficulty(level);
    setCurrentCard(null);
    setUsedCards([]);
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navigation />

        <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF00] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar aos Jogos
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
                Jogo da Casa
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Frases, desafios, ações e votações aleatórias. Escolha o nível de dificuldade!
              </p>
            </div>

            {/* Difficulty Selection */}
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
                      <h3 className="text-2xl font-bold">{config.label}</h3>
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => setDifficulty(null)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF00] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Trocar Dificuldade
          </button>

          {/* Difficulty Badge */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-bold">{config.label}</span>
            </div>
          </div>

          {/* Card Display */}
          <div className="mb-8">
            {currentCard ? (
              <div
                className={`relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300 ${
                  isFlipped ? "scale-95 opacity-50" : "scale-100 opacity-100"
                }`}
              >
                {/* Type Badge */}
                <div className={`absolute top-6 left-6 px-4 py-2 rounded-xl border ${typeConfig[currentCard.type].color}`}>
                  <span className="text-sm font-bold">{typeConfig[currentCard.type].label}</span>
                </div>

                {/* Card Content */}
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold leading-relaxed">
                    {currentCard.content}
                  </p>
                </div>

                {/* Cards Remaining */}
                <div className="absolute bottom-6 right-6 text-sm text-gray-400">
                  {getAvailableCards().length} cartas restantes
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-8 border border-[#00FF00]/30 min-h-[400px] flex flex-col items-center justify-center">
                <Users className="w-20 h-20 text-[#00FF00] mb-6" />
                <p className="text-xl text-gray-400 text-center">
                  Clique em "Puxar Carta" para começar!
                </p>
              </div>
            )}
          </div>

          {/* Draw Button */}
          <button
            onClick={drawCard}
            className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-6 h-6" />
            {currentCard ? "Próxima Carta" : "Puxar Carta"}
          </button>
        </div>
      </section>
    </div>
  );
}
