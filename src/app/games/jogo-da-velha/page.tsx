"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { ArrowLeft, X as XIcon, Circle, RotateCcw, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FriendListSelector } from "@/components/custom/friend-list-selector";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6], // diagonals
];

export default function JogoDaVelhaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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
    if (names.length >= 2) {
      setPlayer1Name(names[0]);
      setPlayer2Name(names[1]);
    }
  };

  const checkWinner = (board: Board): Player | "draw" | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    if (board.every(cell => cell !== null)) {
      return "draw";
    }
    
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  const startGame = () => {
    if (player1Name.trim() && player2Name.trim()) {
      setGameStarted(true);
    }
  };

  if (!gameStarted) {
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
                Jogo da Velha Bebado
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Jogo da velha clássico. Quem perder, bebe 5 goles!
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

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Jogadores</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Jogador 1 (X)</label>
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Nome do jogador 1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Jogador 2 (O)</label>
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Nome do jogador 2"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50"
                    maxLength={20}
                  />
                </div>

                <button
                  onClick={startGame}
                  disabled={!player1Name.trim() || !player2Name.trim()}
                  className="w-full px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Começar Jogo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentPlayerName = currentPlayer === "X" ? player1Name : player2Name;
  const winnerName = winner === "X" ? player1Name : winner === "O" ? player2Name : null;

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

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Jogo da Velha Bebado</h1>
            
            {!winner && (
              <div className="flex items-center justify-center gap-3">
                <p className="text-xl text-gray-400">Vez de:</p>
                <div className="px-4 py-2 bg-[#00FF00]/20 border border-[#00FF00]/30 rounded-xl">
                  <span className="font-bold text-[#00FF00]">{currentPlayerName}</span>
                </div>
              </div>
            )}

            {winner && (
              <div className="bg-gradient-to-br from-[#00FF00]/20 to-transparent rounded-2xl p-6 border border-[#00FF00]/30 max-w-md mx-auto">
                {winner === "draw" ? (
                  <>
                    <h2 className="text-3xl font-bold mb-2">Empate!</h2>
                    <p className="text-gray-400">Todos bebem 3 goles!</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold mb-2">{winnerName} Venceu!</h2>
                    <p className="text-gray-400">
                      {winnerName === player1Name ? player2Name : player1Name} bebe 5 goles!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="max-w-md mx-auto mb-8">
            <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className="aspect-square bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center text-4xl font-bold disabled:cursor-not-allowed"
                  disabled={!!cell || !!winner}
                >
                  {cell === "X" && <XIcon className="w-12 h-12 text-[#00FF00]" />}
                  {cell === "O" && <Circle className="w-12 h-12 text-[#FF00FF]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Players Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
            <div className={`p-4 rounded-xl border ${currentPlayer === "X" && !winner ? "bg-[#00FF00]/20 border-[#00FF00]/30" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-2">
                <XIcon className="w-5 h-5 text-[#00FF00]" />
                <span className="font-bold">{player1Name}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${currentPlayer === "O" && !winner ? "bg-[#FF00FF]/20 border-[#FF00FF]/30" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-5 h-5 text-[#FF00FF]" />
                <span className="font-bold">{player2Name}</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetGame}
            className="w-full max-w-md mx-auto block px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </button>
        </div>
      </section>
    </div>
  );
}
