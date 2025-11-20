"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, Users, Zap, Flame, Skull, Heart, Play, Plus, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type DifficultyLevel = "leve" | "moderado" | "corajoso" | "extremo";

interface Challenge {
  text: string;
  drinks: number;
}

const challenges: Record<DifficultyLevel, Challenge[]> = {
  leve: [
    { text: "Beba 1 gole", drinks: 1 },
    { text: "Escolha alguém para beber 1 gole", drinks: 0 },
    { text: "Beba 2 goles", drinks: 2 },
    { text: "Todos bebem 1 gole", drinks: 1 },
    { text: "Distribua 3 goles", drinks: 0 },
    { text: "Você está seguro!", drinks: 0 },
    { text: "Beba 3 goles", drinks: 3 },
    { text: "Escolha 2 pessoas para beberem 1 gole cada", drinks: 0 },
  ],
  moderado: [
    { text: "Beba 3 goles", drinks: 3 },
    { text: "Beba 4 goles", drinks: 4 },
    { text: "Escolha alguém para beber 3 goles", drinks: 0 },
    { text: "Todos bebem 2 goles", drinks: 2 },
    { text: "Distribua 5 goles", drinks: 0 },
    { text: "Beba 5 goles", drinks: 5 },
    { text: "Faça um shot", drinks: 0 },
    { text: "Escolha 2 pessoas para beberem 3 goles cada", drinks: 0 },
  ],
  corajoso: [
    { text: "Beba 6 goles", drinks: 6 },
    { text: "Faça um shot", drinks: 0 },
    { text: "Beba 7 goles", drinks: 7 },
    { text: "Todos fazem um shot", drinks: 0 },
    { text: "Distribua 8 goles", drinks: 0 },
    { text: "Beba 8 goles", drinks: 8 },
    { text: "Faça 2 shots", drinks: 0 },
    { text: "Escolha 3 pessoas para fazerem um shot", drinks: 0 },
  ],
  extremo: [
    { text: "Beba 10 goles", drinks: 10 },
    { text: "Faça 2 shots", drinks: 0 },
    { text: "Beba 12 goles", drinks: 12 },
    { text: "Todos fazem 2 shots", drinks: 0 },
    { text: "Distribua 15 goles", drinks: 0 },
    { text: "Beba 15 goles", drinks: 15 },
    { text: "Faça 3 shots", drinks: 0 },
    { text: "Vire sua bebida inteira", drinks: 0 },
  ],
};

const difficultyConfig = {
  leve: { icon: Heart, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Leve" },
  moderado: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Moderado" },
  corajoso: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", label: "Corajoso" },
  extremo: { icon: Skull, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Extremo" },
};

export default function RoletaBebadaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ player: string; challenge: Challenge } | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

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

  const spinWheel = () => {
    if (players.length < 2 || isSpinning || !difficulty) return;

    setIsSpinning(true);
    setResult(null);

    // Calcular rotação aleatória
    const spins = 5 + Math.random() * 3; // 5-8 voltas completas
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomDegree;

    setRotation(totalRotation);

    // Após animação, mostrar resultado
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / players.length;
      // CORREÇÃO: Invertida a fórmula para corresponder à seta no topo
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % players.length;
      
      const selectedPlayer = players[selectedIndex];
      const challengeList = challenges[difficulty];
      const selectedChallenge = challengeList[Math.floor(Math.random() * challengeList.length)];

      setResult({ player: selectedPlayer, challenge: selectedChallenge });
      setIsSpinning(false);
    }, 4000);
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
                Roleta Bebada
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Gire a roleta e descubra seu destino. Escolha o nível de dificuldade!
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
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Players Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Jogadores ({players.length}/12)</h2>
              
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

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <span className="font-medium">{player}</span>
                      <button
                        onClick={() => removePlayer(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {players.length < 2 && (
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    Adicione pelo menos 2 jogadores para começar
                  </p>
                )}
              </div>

              <button
                onClick={spinWheel}
                disabled={players.length < 2 || isSpinning}
                className="w-full px-8 py-6 bg-[#00FF00] text-[#0D0D0D] rounded-2xl font-bold text-xl hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Play className="w-6 h-6" />
                {isSpinning ? "Girando..." : "Girar Roleta"}
              </button>
            </div>

            {/* Wheel Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[400px] aspect-square">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#00FF00]" />
                </div>

                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className="relative w-full h-full rounded-full border-8 border-[#00FF00] overflow-hidden transition-transform duration-[4000ms] ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    background: `conic-gradient(${players
                      .map((_, i) => {
                        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788", "#E76F51", "#2A9D8F"];
                        const start = (i / players.length) * 100;
                        const end = ((i + 1) / players.length) * 100;
                        return `${colors[i % colors.length]} ${start}% ${end}%`;
                      })
                      .join(", ")})`,
                  }}
                >
                  {players.map((player, index) => {
                    const angle = (360 / players.length) * index;
                    return (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 origin-left"
                        style={{
                          transform: `rotate(${angle + 360 / players.length / 2}deg) translateX(40%)`,
                        }}
                      >
                        <span className="text-white font-bold text-sm drop-shadow-lg whitespace-nowrap">
                          {player}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {result && (
                <div className="mt-8 w-full bg-gradient-to-br from-[#00FF00]/20 to-transparent rounded-2xl p-6 border border-[#00FF00]/30 text-center animate-pulse">
                  <h3 className="text-2xl font-bold mb-2">{result.player}</h3>
                  <p className="text-xl text-gray-300">{result.challenge.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
