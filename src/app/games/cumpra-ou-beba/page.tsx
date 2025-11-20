"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Zap, Flame, Skull, Heart, RefreshCw, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";
import { CustomCardsManager } from "@/components/custom/custom-cards-manager";
import { supabase } from "@/lib/supabase";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Challenge {
  text: string;
  drinks: number;
  isCustom?: boolean;
}

const challenges: Record<DifficultyLevel, Challenge[]> = {
  leve: [
    { text: "Faça 10 polichinelos", drinks: 2 },
    { text: "Cante uma música infantil", drinks: 2 },
    { text: "Imite um animal por 30 segundos", drinks: 2 },
    { text: "Conte uma piada", drinks: 2 },
    { text: "Dance por 20 segundos", drinks: 2 },
    { text: "Faça uma careta engraçada", drinks: 2 },
    { text: "Fale com sotaque por 1 minuto", drinks: 2 },
    { text: "Faça 5 flexões", drinks: 2 },
  ],
  moderado: [
    { text: "Ligue para alguém e cante parabéns", drinks: 4 },
    { text: "Poste algo engraçado nas redes sociais", drinks: 4 },
    { text: "Faça uma declaração de amor para um objeto", drinks: 4 },
    { text: "Imite alguém do grupo por 1 minuto", drinks: 4 },
    { text: "Conte um segredo constrangedor", drinks: 4 },
    { text: "Dance uma música escolhida pelo grupo", drinks: 4 },
    { text: "Fale apenas em rimas por 2 minutos", drinks: 4 },
    { text: "Faça 20 agachamentos", drinks: 4 },
  ],
  corajoso: [
    { text: "Ligue para seu crush e declare seu amor", drinks: 6 },
    { text: "Mostre suas últimas 5 fotos da galeria", drinks: 6 },
    { text: "Deixe alguém postar algo no seu Instagram", drinks: 6 },
    { text: "Conte sua mentira mais absurda", drinks: 6 },
    { text: "Beije a mão de todos do grupo", drinks: 6 },
    { text: "Revele seu maior arrependimento", drinks: 6 },
    { text: "Faça uma dança sensual", drinks: 6 },
    { text: "Conte algo que nunca contou para ninguém", drinks: 6 },
  ],
  extremo: [
    { text: "Tire uma peça de roupa", drinks: 10 },
    { text: "Beije alguém do grupo (com consentimento)", drinks: 10 },
    { text: "Mostre seu histórico de navegação", drinks: 10 },
    { text: "Leia sua última conversa no WhatsApp em voz alta", drinks: 10 },
    { text: "Deixe o grupo escolher sua foto de perfil por 1 semana", drinks: 10 },
    { text: "Conte seu segredo mais sombrio", drinks: 10 },
    { text: "Faça um vídeo constrangedor e poste", drinks: 10 },
    { text: "Revele algo ilegal que já fez", drinks: 10 },
  ],
};

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve" },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado" },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso" },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo" },
};

export default function CumpraOuBebaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<Challenge[]>([]);
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customCards, setCustomCards] = useState<Challenge[]>([]);

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
        .eq("game_type", "cumpra-ou-beba")
        .eq("difficulty", difficulty);

      if (error) throw error;

      const cards = (data || []).map((card) => ({
        text: card.card_text,
        drinks: difficultyConfig[difficulty].label === "Leve" ? 2 : difficultyConfig[difficulty].label === "Moderado" ? 4 : difficultyConfig[difficulty].label === "Corajoso" ? 6 : 10,
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

  const getAllChallenges = () => {
    return [...challenges[difficulty!], ...customCards];
  };

  const getAvailableChallenges = () => {
    return getAllChallenges().filter(
      (challenge) => !usedChallenges.includes(challenge)
    );
  };

  const drawChallenge = () => {
    const availableChallenges = getAvailableChallenges();
    
    if (availableChallenges.length === 0) {
      setUsedChallenges([]);
      const allChallenges = getAllChallenges();
      const randomChallenge = allChallenges[Math.floor(Math.random() * allChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setUsedChallenges([randomChallenge]);
    } else {
      const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setUsedChallenges([...usedChallenges, randomChallenge]);
    }
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setCurrentChallenge(null);
    setUsedChallenges([]);
  };

  const handleSelectList = (names: string[]) => {
    setFriendNames(names);
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
                Cumpra ou Beba
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Desafios absurdos. Cumpra ou tome um shot. Você tem coragem?
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
                      <h3 className="text-2xl font-bold">{config.label}</h3>
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
                  gameType="cumpra-ou-beba"
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

          <div className="mb-8">
            {currentChallenge ? (
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 min-h-[400px] flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                  <p className="text-3xl sm:text-4xl font-bold leading-relaxed mb-6">
                    {currentChallenge.text}
                  </p>
                  <p className="text-xl text-gray-400">
                    Não cumpriu? Beba {currentChallenge.drinks} goles!
                  </p>
                  {currentChallenge.isCustom && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-full">
                      <span className="text-xs text-[#00FF00] font-bold">Carta Personalizada</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-6 right-6 text-sm text-gray-400">
                  {getAvailableChallenges().length} desafios restantes
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-8 border border-[#00FF00]/30 min-h-[400px] flex flex-col items-center justify-center">
                <Skull className="w-20 h-20 text-[#00FF00] mb-6" />
                <p className="text-xl text-gray-400 text-center">
                  Clique em "Novo Desafio" para começar!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={drawChallenge}
            className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-6 h-6" />
            {currentChallenge ? "Próximo Desafio" : "Novo Desafio"}
          </button>
        </div>
      </section>
    </div>
  );
}
