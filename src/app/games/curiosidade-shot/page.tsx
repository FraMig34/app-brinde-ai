"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Zap, Flame, Skull, Heart, Eye, EyeOff, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";
import { CustomCardsManager } from "@/components/custom/custom-cards-manager";
import { supabase } from "@/lib/supabase";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Question {
  question: string;
  answer: string;
  isCustom?: boolean;
}

const questions: Record<DifficultyLevel, Question[]> = {
  leve: [
    { question: "Qual é a capital da França?", answer: "Paris" },
    { question: "Quantos dias tem um ano?", answer: "365" },
    { question: "Qual é a cor do céu?", answer: "Azul" },
    { question: "Quantos continentes existem?", answer: "7" },
    { question: "Qual é o maior planeta do sistema solar?", answer: "Júpiter" },
    { question: "Quantas patas tem um cachorro?", answer: "4" },
    { question: "Qual é a capital do Brasil?", answer: "Brasília" },
    { question: "Quantos lados tem um triângulo?", answer: "3" },
  ],
  moderado: [
    { question: "Qual é o rio mais longo do mundo?", answer: "Nilo" },
    { question: "Quem pintou a Mona Lisa?", answer: "Leonardo da Vinci" },
    { question: "Qual é o menor país do mundo?", answer: "Vaticano" },
    { question: "Quantos ossos tem o corpo humano?", answer: "206" },
    { question: "Qual é a montanha mais alta do mundo?", answer: "Everest" },
    { question: "Quem descobriu o Brasil?", answer: "Pedro Álvares Cabral" },
    { question: "Qual é o oceano mais profundo?", answer: "Pacífico" },
    { question: "Quantos estados tem o Brasil?", answer: "26" },
  ],
  corajoso: [
    { question: "Qual é a velocidade da luz?", answer: "300.000 km/s" },
    { question: "Quem escreveu Dom Casmurro?", answer: "Machado de Assis" },
    { question: "Qual é o elemento químico mais abundante no universo?", answer: "Hidrogênio" },
    { question: "Em que ano caiu o Muro de Berlim?", answer: "1989" },
    { question: "Qual é a fórmula da água?", answer: "H2O" },
    { question: "Quem foi o primeiro homem na Lua?", answer: "Neil Armstrong" },
    { question: "Qual é a capital da Austrália?", answer: "Canberra" },
    { question: "Quantos planetas tem o sistema solar?", answer: "8" },
  ],
  extremo: [
    { question: "Qual é a constante de Planck?", answer: "6.626 x 10^-34 J·s" },
    { question: "Quem formulou a teoria da relatividade?", answer: "Albert Einstein" },
    { question: "Qual é o número atômico do ouro?", answer: "79" },
    { question: "Em que ano começou a Segunda Guerra Mundial?", answer: "1939" },
    { question: "Qual é a capital do Cazaquistão?", answer: "Astana" },
    { question: "Quantos cromossomos tem o ser humano?", answer: "46" },
    { question: "Qual é a distância da Terra ao Sol?", answer: "150 milhões de km" },
    { question: "Quem escreveu A Divina Comédia?", answer: "Dante Alighieri" },
  ],
};

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve", drinks: 2 },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado", drinks: 4 },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso", drinks: 6 },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo", drinks: 10 },
};

export default function CuriosidadeShotPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Question[]>([]);
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customCards, setCustomCards] = useState<Question[]>([]);

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
        .eq("game_type", "curiosidade-shot")
        .eq("difficulty", difficulty);

      if (error) throw error;

      const cards = (data || []).map((card) => {
        const parts = card.card_text.split("|");
        return {
          question: parts[0] || card.card_text,
          answer: parts[1] || "Resposta personalizada",
          isCustom: true,
        };
      });

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

  const getAllQuestions = () => {
    return [...questions[difficulty!], ...customCards];
  };

  const getAvailableQuestions = () => {
    return getAllQuestions().filter(
      (question) => !usedQuestions.includes(question)
    );
  };

  const drawQuestion = () => {
    const availableQuestions = getAvailableQuestions();
    
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      const allQuestions = getAllQuestions();
      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions([randomQuestion]);
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions([...usedQuestions, randomQuestion]);
    }
    setShowAnswer(false);
  };

  const selectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setCurrentQuestion(null);
    setUsedQuestions([]);
    setShowAnswer(false);
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
                Curiosidade = Shot
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Perguntas secretas. Quer saber a resposta? Então beba!
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
                        <p className="text-sm text-gray-400">{config.drinks} goles por resposta</p>
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
                <p className="text-sm text-gray-400 mb-2">
                  Formato: Pergunta|Resposta (ex: "Qual sua cor favorita?|Azul")
                </p>
                <CustomCardsManager
                  userId={user.id}
                  gameType="curiosidade-shot"
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
            {currentQuestion ? (
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 min-h-[400px] flex flex-col items-center justify-center">
                <div className="text-center mb-8 w-full">
                  <p className="text-3xl sm:text-4xl font-bold leading-relaxed mb-8">
                    {currentQuestion.question}
                  </p>

                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-8 py-4 bg-[#00FF00]/20 text-[#00FF00] rounded-xl font-bold hover:bg-[#00FF00]/30 transition-all border border-[#00FF00]/30 flex items-center gap-2 mx-auto"
                    >
                      <Eye className="w-5 h-5" />
                      Ver Resposta ({config.drinks} goles)
                    </button>
                  ) : (
                    <div className="bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-2xl p-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <EyeOff className="w-5 h-5 text-[#00FF00]" />
                        <span className="text-sm font-bold text-[#00FF00]">Resposta Revelada</span>
                      </div>
                      <p className="text-2xl font-bold text-[#00FF00]">
                        {currentQuestion.answer}
                      </p>
                      <p className="text-sm text-gray-400 mt-3">
                        Quem viu a resposta bebe {config.drinks} goles!
                      </p>
                    </div>
                  )}

                  {currentQuestion.isCustom && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-full">
                      <span className="text-xs text-[#00FF00] font-bold">Carta Personalizada</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-6 right-6 text-sm text-gray-400">
                  {getAvailableQuestions().length} perguntas restantes
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-3xl p-8 border border-[#00FF00]/30 min-h-[400px] flex flex-col items-center justify-center">
                <Skull className="w-20 h-20 text-[#00FF00] mb-6" />
                <p className="text-xl text-gray-400 text-center">
                  Clique em "Nova Pergunta" para começar!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={drawQuestion}
            className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
          >
            {currentQuestion ? "Próxima Pergunta" : "Nova Pergunta"}
          </button>
        </div>
      </section>
    </div>
  );
}
