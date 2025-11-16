"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Wine, Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface Drink {
  id: string;
  name: string;
  brand: string;
  type: string;
  alcoholContent: number;
  imageUrl: string;
  addedAt: Date;
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Carregar bebidas do localStorage
    const savedDrinks = localStorage.getItem("user_drinks");
    if (savedDrinks) {
      setDrinks(JSON.parse(savedDrinks));
    }
  }, [user, router]);

  const handleDeleteDrink = (drinkId: string) => {
    const updatedDrinks = drinks.filter((drink) => drink.id !== drinkId);
    setDrinks(updatedDrinks);
    localStorage.setItem("user_drinks", JSON.stringify(updatedDrinks));
  };

  const filteredDrinks = drinks.filter((drink) => {
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drink.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || drink.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const drinkTypes = ["all", "vodka", "whisky", "rum", "gin", "tequila", "licor", "vinho", "cerveja"];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center">
                <Wine className="w-6 h-6 text-[#00FF00]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Meu Inventário</h1>
                <p className="text-gray-400">Gerencie suas bebidas</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Total de Bebidas</p>
                <p className="text-2xl font-bold text-[#00FF00]">{drinks.length}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Tipos Diferentes</p>
                <p className="text-2xl font-bold text-[#00FF00]">
                  {new Set(drinks.map(d => d.type)).size}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Receitas Possíveis</p>
                <p className="text-2xl font-bold text-[#00FF00]">{drinks.length * 3}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Favoritos</p>
                <p className="text-2xl font-bold text-[#00FF00]">0</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar bebidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF00]/50 transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-48 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00FF00]/50 transition-colors appearance-none cursor-pointer"
              >
                {drinkTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#0D0D0D]">
                    {type === "all" ? "Todos os tipos" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <Link
              href="/drinks/create"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </Link>
          </div>

          {/* Drinks Grid */}
          {filteredDrinks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wine className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nenhuma bebida encontrada</h3>
              <p className="text-gray-400 mb-6">
                {drinks.length === 0
                  ? "Adicione suas primeiras bebidas para começar"
                  : "Tente ajustar os filtros de busca"}
              </p>
              <Link
                href="/drinks/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all"
              >
                <Plus className="w-5 h-5" />
                Adicionar Bebida
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10 hover:border-[#00FF00]/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-white/5 rounded-xl mb-4 overflow-hidden">
                    <img
                      src={drink.imageUrl}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{drink.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{drink.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs rounded-full border border-[#00FF00]/20">
                        {drink.type}
                      </span>
                      <span className="text-xs text-gray-500">{drink.alcoholContent}% vol</span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteDrink(drink.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
