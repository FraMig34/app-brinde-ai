"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, Save, X, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomCard {
  id: string;
  card_text: string;
  difficulty: string;
}

interface CustomCardsManagerProps {
  userId: string;
  gameType: string;
  difficulty: string;
  onCardsChange?: () => void;
}

const MAX_CARDS = 10;

export function CustomCardsManager({ userId, gameType, difficulty, onCardsChange }: CustomCardsManagerProps) {
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadCards();
  }, [userId, gameType, difficulty]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("custom_cards")
        .select("*")
        .eq("user_id", userId)
        .eq("game_type", gameType)
        .eq("difficulty", difficulty)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async () => {
    if (!newCardText.trim()) return;

    if (cards.length >= MAX_CARDS) {
      alert(`Você atingiu o limite de ${MAX_CARDS} cartas personalizadas por jogo/dificuldade.`);
      return;
    }

    try {
      const { error } = await supabase.from("custom_cards").insert({
        user_id: userId,
        game_type: gameType,
        difficulty: difficulty,
        card_text: newCardText.trim(),
      });

      if (error) throw error;

      await loadCards();
      setNewCardText("");
      setIsAdding(false);
      onCardsChange?.();
    } catch (error) {
      console.error("Erro ao adicionar carta:", error);
      alert("Erro ao adicionar carta personalizada");
    }
  };

  const updateCard = async (cardId: string) => {
    if (!editText.trim()) return;

    try {
      const { error } = await supabase
        .from("custom_cards")
        .update({ card_text: editText.trim() })
        .eq("id", cardId);

      if (error) throw error;

      await loadCards();
      setEditingCard(null);
      setEditText("");
      onCardsChange?.();
    } catch (error) {
      console.error("Erro ao atualizar carta:", error);
      alert("Erro ao atualizar carta");
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm("Remover esta carta personalizada?")) return;

    try {
      // Como DELETE não é permitido via supabaseQuery, informamos ao usuário
      alert("Para remover cartas, acesse o painel do Supabase ou entre em contato com o suporte.");
    } catch (error) {
      console.error("Erro ao remover carta:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <p className="text-sm text-gray-400">Carregando cartas personalizadas...</p>
      </div>
    );
  }

  const canAddMore = cards.length < MAX_CARDS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00FF00]" />
          <h3 className="font-bold">
            Cartas Personalizadas ({cards.length}/{MAX_CARDS})
          </h3>
        </div>
        {!isAdding && canAddMore && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </div>

      {!canAddMore && !isAdding && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            Você atingiu o limite de {MAX_CARDS} cartas personalizadas para este jogo/dificuldade.
          </p>
        </div>
      )}

      {isAdding && (
        <div className="p-4 bg-white/5 rounded-xl border border-[#00FF00]/30 space-y-3">
          <Textarea
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            placeholder="Digite sua pergunta/desafio personalizado..."
            className="bg-white/5 border-white/10 text-white min-h-[100px]"
            maxLength={500}
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{newCardText.length}/500 caracteres</span>
            <span>{cards.length + 1}/{MAX_CARDS} cartas</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addCard}
              className="flex-1 bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90"
              disabled={!newCardText.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewCardText("");
              }}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {cards.length === 0 && !isAdding && (
        <div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
          <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nenhuma carta personalizada ainda</p>
          <p className="text-xs text-gray-500 mt-1">
            Crie suas próprias perguntas e desafios! (Máximo {MAX_CARDS} por jogo)
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00FF00]/30 transition-all"
          >
            {editingCard === card.id ? (
              <div className="space-y-3">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  maxLength={500}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateCard(card.id)}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 text-green-400" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCard(null);
                      setEditText("");
                    }}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm flex-1">{card.card_text}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingCard(card.id);
                      setEditText(card.card_text);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
