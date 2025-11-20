"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface FriendList {
  id: string;
  list_name: string;
  list_order: number;
  members: FriendMember[];
}

interface FriendMember {
  id: string;
  friend_name: string;
  member_order: number;
}

export default function FriendsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<FriendList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [addingMember, setAddingMember] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");

  useEffect(() => {
    // Aguarda o carregamento da autenticação antes de redirecionar
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    
    loadLists();
  }, [isAuthenticated, authLoading, router]);

  const loadLists = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Carregar listas
      const { data: listsData, error: listsError } = await supabase
        .from("friend_lists")
        .select("*")
        .eq("user_id", user.id)
        .order("list_order");

      if (listsError) throw listsError;

      // Carregar membros de cada lista
      const listsWithMembers = await Promise.all(
        (listsData || []).map(async (list) => {
          const { data: membersData, error: membersError } = await supabase
            .from("friend_list_members")
            .select("*")
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

  const createNewList = async () => {
    if (!user || lists.length >= 5) return;

    const newListOrder = lists.length + 1;
    const newListName = `Lista ${newListOrder}`;

    try {
      const { error } = await supabase.from("friend_lists").insert({
        user_id: user.id,
        list_name: newListName,
        list_order: newListOrder,
      });

      if (error) throw error;

      await loadLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      alert("Erro ao criar lista");
    }
  };

  const updateListName = async (listId: string, newName: string) => {
    if (!newName.trim()) return;

    try {
      const { error } = await supabase
        .from("friend_lists")
        .update({ list_name: newName })
        .eq("id", listId);

      if (error) throw error;

      await loadLists();
      setEditingList(null);
    } catch (error) {
      console.error("Erro ao atualizar nome da lista:", error);
      alert("Erro ao atualizar nome da lista");
    }
  };

  const addMember = async (listId: string) => {
    if (!newMemberName.trim()) return;

    const list = lists.find((l) => l.id === listId);
    if (!list || list.members.length >= 30) {
      alert("Lista cheia! Máximo de 30 nomes por lista.");
      return;
    }

    const newMemberOrder = list.members.length + 1;

    try {
      const { error } = await supabase.from("friend_list_members").insert({
        list_id: listId,
        friend_name: newMemberName.trim(),
        member_order: newMemberOrder,
      });

      if (error) throw error;

      await loadLists();
      setNewMemberName("");
      setAddingMember(null);
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      alert("Erro ao adicionar membro");
    }
  };

  const removeMember = async (listId: string, memberId: string) => {
    if (!confirm("Remover este amigo da lista?")) return;

    try {
      // Remover membro do banco
      const { error } = await supabase
        .from("friend_list_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      await loadLists();
    } catch (error) {
      console.error("Erro ao remover membro da lista:", error);
      alert("Erro ao remover membro da lista");
    }
  };

  // Tela de carregamento enquanto verifica autenticação
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando listas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-[#00FF00]" />
            Minhas Listas de Amigos
          </h1>
          <p className="text-gray-400">
            Crie até 5 listas com 30 nomes cada para organizar seus amigos e avaliar drinks
          </p>
        </div>

        {/* Create New List Button */}
        {lists.length < 5 && (
          <Button
            onClick={createNewList}
            className="mb-8 bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Nova Lista ({lists.length}/5)
          </Button>
        )}

        {/* Lists Grid */}
        {lists.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhuma lista criada</h3>
            <p className="text-gray-400 mb-6">
              Crie sua primeira lista para começar a organizar seus amigos
            </p>
            <Button
              onClick={createNewList}
              className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Lista
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#00FF00]/30 transition-all"
              >
                {/* List Header */}
                <div className="flex items-center justify-between mb-4">
                  {editingList === list.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingListName}
                        onChange={(e) => setEditingListName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Nome da lista"
                      />
                      <button
                        onClick={() => updateListName(list.id, editingListName)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => setEditingList(null)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{list.list_name}</h3>
                      <button
                        onClick={() => {
                          setEditingList(list.id);
                          setEditingListName(list.list_name);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </>
                  )}
                </div>

                {/* Members Count */}
                <div className="mb-4 text-sm text-gray-400">
                  {list.members.length}/30 amigos
                </div>

                {/* Members List */}
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {list.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <span className="text-sm">{member.friend_name}</span>
                      <button
                        onClick={() => removeMember(list.id, member.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Member */}
                {list.members.length < 30 && (
                  <div>
                    {addingMember === list.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="Nome do amigo"
                          className="bg-white/5 border-white/10 text-white text-sm"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addMember(list.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => addMember(list.id)}
                          className="px-3 py-2 bg-[#00FF00] text-[#0D0D0D] rounded-lg text-sm font-bold hover:bg-[#00FF00]/90 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAddingMember(null);
                            setNewMemberName("");
                          }}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingMember(list.id)}
                        className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:border-[#00FF00]/50 hover:text-[#00FF00] transition-all"
                      >
                        + Adicionar Amigo
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
