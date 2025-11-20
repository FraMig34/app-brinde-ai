"use client";

import { useState, useRef } from "react";
import { Navigation } from "@/components/custom/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Wine, 
  Trash2, 
  Star, 
  Lock,
  ChevronRight,
  Heart,
  Plus,
  X,
  Check,
  Loader2,
  Info,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DrinkAnalysis {
  name: string;
  brand: string;
  type: string;
  alcoholContent: number;
  volume: number;
  confidence: number;
  tasteProfile: {
    sweetness: number;
    bitterness: number;
    citrus: number;
    strength: number;
    smoothness: number;
  };
  flavorNotes: string[];
  category: string;
  description: string;
  pairingRecommendations: string[];
}

interface Drink {
  id: string;
  name: string;
  brand: string;
  type: string;
  alcoholContent: number;
  volume: number;
  image: string;
  addedAt: string;
  tasteProfile?: {
    sweetness: number;
    bitterness: number;
    citrus: number;
    strength: number;
    smoothness: number;
  };
  flavorNotes?: string[];
  description?: string;
  category?: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  difficulty: "Fácil" | "Médio" | "Difícil";
  rating?: number;
  isFavorite?: boolean;
  isCustom: boolean;
}

interface TastePreference {
  sweetness: number;
  citrus: number;
  bitter: number;
  strong: number;
}

export default function CreateDrinksPage() {
  const { user, isAuthenticated, isPremium } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState<Drink[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [tastePreferences, setTastePreferences] = useState<TastePreference>({
    sweetness: 50,
    citrus: 50,
    bitter: 50,
    strong: 50,
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [customRecipeName, setCustomRecipeName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [recipeToSave, setRecipeToSave] = useState<Recipe | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [showDrinkDetails, setShowDrinkDetails] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      alert("Faça login ou cadastre-se para usar a funcionalidade de reconhecimento de bebidas!");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    try {
      // Converter imagem para base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;

        try {
          // Chamar API de análise
          const response = await fetch("/api/analyze-drink", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Erro ao analisar bebida");
          }

          const analysis: DrinkAnalysis = data.analysis;

          // Criar objeto de bebida com análise completa
          const newDrink: Drink = {
            id: Date.now().toString(),
            name: analysis.name,
            brand: analysis.brand,
            type: analysis.type,
            alcoholContent: analysis.alcoholContent,
            volume: analysis.volume,
            image: base64Image,
            addedAt: new Date().toISOString(),
            tasteProfile: analysis.tasteProfile,
            flavorNotes: analysis.flavorNotes,
            description: analysis.description,
            category: analysis.category,
          };

          // Salvar no Supabase se usuário estiver autenticado
          if (user) {
            try {
              const { error } = await supabase.from("drinks").insert({
                user_id: user.id,
                name: newDrink.name,
                brand: newDrink.brand,
                type: newDrink.type,
                alcohol_percentage: newDrink.alcoholContent,
                volume: newDrink.volume,
                image_url: newDrink.image,
                taste_profile: newDrink.tasteProfile,
                flavor_notes: newDrink.flavorNotes,
                description: newDrink.description,
                category: newDrink.category,
              });

              if (error) {
                console.error("Erro ao salvar no Supabase:", error);
              }
            } catch (dbError) {
              console.error("Erro de banco de dados:", dbError);
            }
          }

          setInventory([...inventory, newDrink]);
          setSelectedDrink(newDrink);
          setShowDrinkDetails(true);
          setIsScanning(false);

        } catch (apiError) {
          console.error("Erro na API:", apiError);
          setIsScanning(false);
          alert(
            apiError instanceof Error 
              ? apiError.message 
              : "Erro ao identificar bebida. Tente tirar uma foto mais clara do rótulo."
          );
        }
      };

      reader.onerror = () => {
        setIsScanning(false);
        alert("Erro ao processar imagem");
      };

    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      setIsScanning(false);
      alert("Erro ao processar imagem");
    }
  };

  const handleGenerateRecipes = async () => {
    if (!isPremium) {
      router.push("/premium");
      return;
    }

    if (inventory.length === 0) {
      alert("Adicione bebidas ao seu inventário primeiro!");
      return;
    }

    // Gerar receitas baseadas no perfil de sabor das bebidas
    const mockRecipes: Recipe[] = [
      {
        id: "1",
        name: "Sunset Paradise",
        ingredients: [
          { name: inventory[0]?.name || "Vodka", amount: "50ml" },
          { name: "Suco de Laranja", amount: "100ml" },
          { name: "Grenadine", amount: "15ml" },
          { name: "Gelo", amount: "A gosto" },
        ],
        instructions: [
          "Adicione gelo em um copo alto",
          "Despeje a vodka",
          "Complete com suco de laranja",
          "Adicione grenadine lentamente para criar efeito degradê",
          "Decore com uma fatia de laranja",
        ],
        difficulty: "Fácil",
        isCustom: true,
      },
      {
        id: "2",
        name: "Mojito Clássico",
        ingredients: [
          { name: "Rum Branco", amount: "50ml" },
          { name: "Hortelã", amount: "10 folhas" },
          { name: "Limão", amount: "1/2 unidade" },
          { name: "Açúcar", amount: "2 colheres" },
          { name: "Água com gás", amount: "100ml" },
        ],
        instructions: [
          "Macere hortelã com açúcar e limão",
          "Adicione gelo picado",
          "Despeje o rum",
          "Complete com água com gás",
          "Mexa delicadamente",
        ],
        difficulty: "Médio",
        isCustom: false,
      },
      {
        id: "3",
        name: "Neon Dream",
        ingredients: [
          { name: inventory[0]?.name || "Gin", amount: "40ml" },
          { name: "Licor de Limão", amount: "20ml" },
          { name: "Tônica", amount: "100ml" },
          { name: "Limão", amount: "1 fatia" },
        ],
        instructions: [
          "Encha o copo com gelo",
          "Adicione o gin e o licor",
          "Complete com tônica",
          "Decore com limão",
        ],
        difficulty: "Fácil",
        isCustom: true,
      },
    ];

    setRecipes(mockRecipes);
    setShowRecipes(true);
  };

  const handleRemoveDrink = async (id: string) => {
    const drink = inventory.find(d => d.id === id);
    if (!drink) return;

    if (!confirm(`Remover ${drink.name} do inventário?`)) return;

    // Remover do Supabase se tiver user_id
    if (user) {
      try {
        await supabase
          .from("drinks")
          .delete()
          .eq("user_id", user.id)
          .eq("name", drink.name);
      } catch (error) {
        console.error("Erro ao remover do Supabase:", error);
      }
    }

    setInventory(inventory.filter((d) => d.id !== id));
  };

  const handleRateRecipe = (recipeId: string, rating: number) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, rating } : recipe
      )
    );
  };

  const handleToggleFavorite = (recipeId: string) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  const handleSaveCustomRecipe = () => {
    if (!recipeToSave) return;
    
    const updatedRecipe = {
      ...recipeToSave,
      name: customRecipeName || recipeToSave.name,
      isFavorite: true,
    };

    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeToSave.id ? updatedRecipe : recipe
      )
    );

    setShowNameModal(false);
    setCustomRecipeName("");
    setRecipeToSave(null);
    alert(`✅ Receita "${updatedRecipe.name}" salva nos favoritos!`);
  };

  const openSaveModal = (recipe: Recipe) => {
    setRecipeToSave(recipe);
    setCustomRecipeName(recipe.name);
    setShowNameModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-md">
            <Lock className="w-16 h-16 text-[#00FF00] mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
            <p className="text-gray-400 mb-8">
              Faça login ou cadastre-se para acessar a funcionalidade de criação de drinks
            </p>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300"
            >
              Fazer Login / Cadastro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#00FF00]" />
            <span className="text-sm text-[#00FF00] font-medium">
              Powered by AI - Análise Avançada de Bebidas
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Criar Drinks Personalizados
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tire fotos das suas bebidas e receba análise completa de sabor, marca e receitas exclusivas
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Camera className="w-6 h-6 text-[#00FF00]" />
              Adicionar Bebida ao Inventário
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />

              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={isScanning}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#00FF00]/20 text-[#00FF00] rounded-xl font-bold hover:bg-[#00FF00]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#00FF00]/40 hover:border-[#00FF00]/60 shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)]"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando com IA...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Tirar Foto e Analisar
                  </>
                )}
              </button>
            </div>

            {inventory.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowInventory(!showInventory)}
                  className="flex items-center gap-2 text-[#00FF00] hover:text-[#00FF00]/80 transition-colors"
                >
                  <Wine className="w-5 h-5" />
                  <span className="font-medium">
                    Ver Inventário ({inventory.length} bebidas)
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      showInventory ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Display */}
        {showInventory && inventory.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Seu Inventário</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((drink) => (
                  <div
                    key={drink.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#00FF00]/50 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedDrink(drink);
                      setShowDrinkDetails(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{drink.name}</h3>
                        <p className="text-sm text-gray-400">{drink.brand}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDrink(drink.id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#00FF00]/10 text-[#00FF00] rounded text-xs">
                        {drink.type}
                      </span>
                      {drink.category && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs capitalize">
                          {drink.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{drink.alcoholContent}%</span>
                      <span>{drink.volume}ml</span>
                    </div>
                    {drink.flavorNotes && drink.flavorNotes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {drink.flavorNotes.slice(0, 3).map((note, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-white/5 rounded"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Taste Preferences */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center justify-between w-full mb-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Star className="w-6 h-6 text-[#00FF00]" />
                Preferências de Sabor
              </h2>
              <ChevronRight
                className={`w-6 h-6 text-[#00FF00] transition-transform ${
                  showPreferences ? "rotate-90" : ""
                }`}
              />
            </button>

            {showPreferences && (
              <div className="space-y-6">
                {Object.entries(tastePreferences).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium capitalize">
                        {key === "sweetness" && "Doçura"}
                        {key === "citrus" && "Cítrico"}
                        {key === "bitter" && "Amargo"}
                        {key === "strong" && "Forte"}
                      </label>
                      <span className="text-sm text-[#00FF00]">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) =>
                        setTastePreferences({
                          ...tastePreferences,
                          [key]: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF00]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generate Recipes Button */}
        <div className="mb-12 text-center">
          <button
            onClick={handleGenerateRecipes}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
          >
            <Sparkles className="w-5 h-5" />
            Gerar Receitas Personalizadas
            {!isPremium && <Lock className="w-5 h-5" />}
          </button>
          {!isPremium && (
            <p className="text-sm text-gray-400 mt-3">
              ⭐ Funcionalidade Premium - Clique para assinar
            </p>
          )}
        </div>

        {/* Recipes Display */}
        {showRecipes && recipes.length > 0 && (
          <div>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Receitas Sugeridas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#00FF00]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              recipe.difficulty === "Fácil"
                                ? "bg-green-500/20 text-green-400"
                                : recipe.difficulty === "Médio"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {recipe.difficulty}
                          </span>
                          {recipe.isCustom && (
                            <span className="px-2 py-1 text-xs bg-[#00FF00]/20 text-[#00FF00] rounded">
                              Criado por IA
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(recipe.id)}
                        className="text-gray-400 hover:text-[#00FF00] transition-colors"
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            recipe.isFavorite ? "fill-[#00FF00] text-[#00FF00]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-gray-400">
                        Ingredientes:
                      </h4>
                      <ul className="space-y-1">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#00FF00] rounded-full" />
                            {ingredient.name} - {ingredient.amount}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-gray-400">
                        Modo de Preparo:
                      </h4>
                      <ol className="space-y-1">
                        {recipe.instructions.map((instruction, idx) => (
                          <li key={idx} className="text-sm flex gap-2">
                            <span className="text-[#00FF00] font-bold">{idx + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateRecipe(recipe.id, star)}
                            className="text-gray-400 hover:text-[#00FF00] transition-colors"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                recipe.rating && star <= recipe.rating
                                  ? "fill-[#00FF00] text-[#00FF00]"
                                  : ""
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {recipe.isCustom && (
                        <button
                          onClick={() => openSaveModal(recipe)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#00FF00]/10 text-[#00FF00] rounded-lg hover:bg-[#00FF00]/20 transition-all text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Salvar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drink Details Modal */}
      {showDrinkDetails && selectedDrink && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">{selectedDrink.name}</h3>
                <p className="text-xl text-gray-400">{selectedDrink.brand}</p>
              </div>
              <button
                onClick={() => setShowDrinkDetails(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedDrink.description && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00FF00] mt-1 flex-shrink-0" />
                  <p className="text-gray-300">{selectedDrink.description}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Tipo</p>
                <p className="text-lg font-bold capitalize">{selectedDrink.type}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Categoria</p>
                <p className="text-lg font-bold capitalize">{selectedDrink.category || "Standard"}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Teor Alcoólico</p>
                <p className="text-lg font-bold">{selectedDrink.alcoholContent}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Volume</p>
                <p className="text-lg font-bold">{selectedDrink.volume}ml</p>
              </div>
            </div>

            {selectedDrink.tasteProfile && (
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00FF00]" />
                  Perfil de Sabor
                </h4>
                <div className="space-y-4">
                  {Object.entries(selectedDrink.tasteProfile).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium capitalize">
                          {key === "sweetness" && "Doçura"}
                          {key === "bitterness" && "Amargor"}
                          {key === "citrus" && "Cítrico"}
                          {key === "strength" && "Força"}
                          {key === "smoothness" && "Suavidade"}
                        </span>
                        <span className="text-sm text-[#00FF00]">{value}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60 rounded-full transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDrink.flavorNotes && selectedDrink.flavorNotes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#00FF00]" />
                  Notas de Sabor
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDrink.flavorNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-[#00FF00]/10 text-[#00FF00] rounded-lg border border-[#00FF00]/20 text-sm font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDrinkDetails(false)}
              className="w-full px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Save Custom Recipe Modal */}
      {showNameModal && recipeToSave && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Salvar Receita</h3>
            <p className="text-gray-400 mb-6">
              Dê um nome personalizado para sua receita favorita
            </p>
            <input
              type="text"
              value={customRecipeName}
              onChange={(e) => setCustomRecipeName(e.target.value)}
              placeholder="Nome da receita"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setCustomRecipeName("");
                  setRecipeToSave(null);
                }}
                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancelar
              </button>
              <button
                onClick={handleSaveCustomRecipe}
                className="flex-1 px-6 py-3 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
