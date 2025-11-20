"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, ChevronDown } from "lucide-react";

interface FriendList {
  id: string;
  list_name: string;
  members: { id: string; friend_name: string }[];
}

interface FriendListSelectorProps {
  userId: string;
  onSelectList: (names: string[]) => void;
  selectedListId?: string | null;
}

export function FriendListSelector({ userId, onSelectList, selectedListId }: FriendListSelectorProps) {
  const [lists, setLists] = useState<FriendList[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, [userId]);

  const loadLists = async () => {
    try {
      setLoading(true);

      // Carregar listas
      const { data: listsData, error: listsError } = await supabase
        .from("friend_lists")
        .select("*")
        .eq("user_id", userId)
        .order("list_order");

      if (listsError) throw listsError;

      // Carregar membros de cada lista
      const listsWithMembers = await Promise.all(
        (listsData || []).map(async (list) => {
          const { data: membersData, error: membersError } = await supabase
            .from("friend_list_members")
            .select("id, friend_name")
            .eq("list_id", list.id)
            .order("member_order");

          if (membersError) throw membersError;

          return {
            ...list,
            members: membersData || [],
          };
        })
      );

      setLists(listsWithMembers);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectList = (list: FriendList) => {
    const names = list.members.map((m) => m.friend_name);
    onSelectList(names);
    setIsOpen(false);
  };

  const selectedList = lists.find((l) => l.id === selectedListId);

  if (loading) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <p className="text-sm text-gray-400">Carregando listas...</p>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-400 mb-2">Nenhuma lista de amigos criada</p>
        <a href="/friends" className="text-sm text-[#00FF00] hover:underline">
          Criar lista de amigos
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#00FF00]/50 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#00FF00]" />
          <div className="text-left">
            <p className="text-sm text-gray-400">Lista de Amigos</p>
            <p className="font-bold">
              {selectedList ? `${selectedList.list_name} (${selectedList.members.length})` : "Selecione uma lista"}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] rounded-xl border border-white/20 shadow-2xl max-h-64 overflow-y-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => handleSelectList(list)}
              className={`w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                selectedListId === list.id ? "bg-[#00FF00]/10" : ""
              }`}
            >
              <p className="font-bold mb-1">{list.list_name}</p>
              <p className="text-sm text-gray-400">{list.members.length} amigos</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
