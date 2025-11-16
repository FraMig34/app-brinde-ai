"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/custom/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Wine,
  Search,
  Trash2,
  Plus,
  Filter,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Drink {
  id: string;
  name: string;
  brand: string;
  type: string;
  volume: number;
  alcohol_percentage: number;
  image_url?: string;
}

export default function InventoryPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Apenas carrega drinks se usuário estiver autenticado
    if (user && isAuthenticated) {
      loadDrinks();
    } else if (!authLoading && !isAuthenticated) {
      // Apenas seta loading como false, sem navegação
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, user]);

  const loadDrinks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("drinks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrinks(data || []);
    } catch (error) {
      console.error("Erro ao carregar bebidas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta bebida?")) return;

    try {
      // Marcar como deletado (soft delete) usando UPDATE
      const { error } = await supabase
        .from("drinks")
        .update({ volume: 0 })
        .eq("id", id);

      if (error) throw error;

      // Remover da lista local
      setDrinks(drinks.filter((drink) => drink.id !== id));
    } catch (error) {
      console.error("Erro ao remover bebida:", error);
      alert("Erro ao remover bebida");
    }
  };

  const filteredDrinks = drinks.filter((drink) => {
    const matchesSearch =
      drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drink.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || drink.type === filterType;
    return matchesSearch && matchesType && drink.volume > 0;
  });

  const stats = {
    total: filteredDrinks.length,
    types: [...new Set(filteredDrinks.map((d) => d.type))].length,
    totalVolume: filteredDrinks.reduce((sum, d) => sum + d.volume, 0),
  };

  // Mostra loading apenas durante autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00FF00] animate-spin" />
      </div>
    );
  }

  // Se não autenticado, mostra mensagem
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Wine className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Acesso Restrito</h3>
            <p className="text-gray-400 mb-6">
              Faça login para acessar seu inventário
            </p>
            <Button
              onClick={() => router.push("/auth")}
              className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90 font-bold"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#00FF00] to-white bg-clip-text text-transparent">
            Meu Inventário
          </h1>
          <p className="text-gray-400">
            Gerencie suas bebidas e mantenha tudo organizado
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                <Wine className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-400">Bebidas</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.types}</p>
                <p className="text-sm text-gray-400">Tipos</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalVolume}ml</p>
                <p className="text-sm text-gray-400">Volume Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50"
          >
            <option value="all" className="bg-[#0D0D0D]">
              Todos os tipos
            </option>
            <option value="vodka" className="bg-[#0D0D0D]">
              Vodka
            </option>
            <option value="whisky" className="bg-[#0D0D0D]">
              Whisky
            </option>
            <option value="rum" className="bg-[#0D0D0D]">
              Rum
            </option>
            <option value="gin" className="bg-[#0D0D0D]">
              Gin
            </option>
            <option value="cerveja" className="bg-[#0D0D0D]">
              Cerveja
            </option>
            <option value="vinho" className="bg-[#0D0D0D]">
              Vinho
            </option>
            <option value="outro" className="bg-[#0D0D0D]">
              Outro
            </option>
          </select>

          <Button
            onClick={() => router.push("/drinks/create")}
            className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Drinks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#00FF00] animate-spin" />
          </div>
        ) : filteredDrinks.length === 0 ? (
          <div className="text-center py-12">
            <Wine className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhuma bebida encontrada</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== "all"
                ? "Tente ajustar os filtros"
                : "Adicione suas primeiras bebidas ao inventário"}
            </p>
            <Button
              onClick={() => router.push("/drinks/create")}
              className="bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Bebida
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrinks.map((drink) => (
              <div
                key={drink.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#00FF00]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{drink.name}</h3>
                    <p className="text-sm text-gray-400">{drink.brand}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(drink.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="font-medium capitalize">{drink.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Volume:</span>
                    <span className="font-medium">{drink.volume}ml</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Teor Alcoólico:</span>
                    <span className="font-medium">{drink.alcohol_percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
