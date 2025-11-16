"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navigation } from "@/components/custom/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, Check, Sparkles, Crown, Star } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [region, setRegion] = useState<'brasil' | 'portugal'>('brasil');
  const [wantsPremium, setWantsPremium] = useState(false);

  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        router.push("/games");
      } else {
        // Validações para cadastro
        if (!name || !birthYear) {
          throw new Error("Preencha todos os campos");
        }

        const year = parseInt(birthYear);
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;

        if (age < 18) {
          throw new Error("Você precisa ter 18 anos ou mais");
        }

        // Criar conta com ou sem premium
        await signup(email, password, name, year, region, wantsPremium);
        router.push("/games");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const getPremiumPrice = () => {
    return region === 'brasil' ? 'R$ 19,90' : '€ 3,90';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <div className="flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-5xl">
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
              </h1>
              <p className="text-gray-400">
                {isLogin
                  ? "Entre para continuar a diversão"
                  : "Cadastre-se e comece a jogar agora mesmo!"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* COLUNA ESQUERDA: Formulário */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Cadastro */}
                  {!isLogin && (
                    <>
                      {/* Nome */}
                      <div>
                        <Label htmlFor="name" className="text-gray-300">
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Senha */}
                      <div>
                        <Label htmlFor="password" className="text-gray-300">
                          Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Ano de Nascimento */}
                      <div>
                        <Label htmlFor="birthYear" className="text-gray-300">
                          Ano de Nascimento
                        </Label>
                        <Input
                          id="birthYear"
                          type="number"
                          value={birthYear}
                          onChange={(e) => setBirthYear(e.target.value)}
                          placeholder="1990"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Região */}
                      <div>
                        <Label htmlFor="region" className="text-gray-300">
                          Região
                        </Label>
                        <select
                          id="region"
                          value={region}
                          onChange={(e) => setRegion(e.target.value as 'brasil' | 'portugal')}
                          className="mt-1 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50"
                          required
                        >
                          <option value="brasil" className="bg-[#0D0D0D]">
                            Brasil
                          </option>
                          <option value="portugal" className="bg-[#0D0D0D]">
                            Portugal
                          </option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Login Form */}
                  {isLogin && (
                    <>
                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Senha */}
                      <div>
                        <Label htmlFor="password" className="text-gray-300">
                          Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-bold py-6 text-lg transition-all duration-300 ${
                      !isLogin && wantsPremium
                        ? 'bg-gradient-to-r from-[#00FF00] via-[#00DD00] to-[#00FF00] text-[#0D0D0D] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] hover:scale-105'
                        : 'bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : isLogin ? (
                      "Entrar"
                    ) : wantsPremium ? (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        Começar Premium Agora
                      </>
                    ) : (
                      "Criar Conta Gratuita"
                    )}
                  </Button>
                </form>

                {/* Toggle Login/Signup */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                    }}
                    className="text-[#00FF00] hover:underline text-sm"
                  >
                    {isLogin
                      ? "Não tem conta? Cadastre-se"
                      : "Já tem conta? Faça login"}
                  </button>
                </div>
              </div>

              {/* COLUNA DIREITA: Opção Premium (apenas no cadastro) */}
              {!isLogin && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#FFD700]" />
                      Escolha seu Plano
                      <Sparkles className="w-6 h-6 text-[#FFD700]" />
                    </h2>
                    <p className="text-sm text-gray-400">Opcional - você decide agora ou depois!</p>
                  </div>

                  {/* Plano Premium - SUPER DESTAQUE */}
                  <div 
                    onClick={() => setWantsPremium(true)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      wantsPremium 
                        ? 'border-[#00FF00] bg-gradient-to-br from-[#00FF00]/10 via-[#00FF00]/5 to-transparent shadow-[0_0_30px_rgba(0,255,0,0.3)]' 
                        : 'border-[#00FF00]/50 bg-gradient-to-br from-[#00FF00]/5 to-transparent hover:border-[#00FF00] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]'
                    }`}
                  >
                    {/* Badge Premium */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                      <Crown className="w-4 h-4 text-[#0D0D0D]" />
                      <span className="text-[#0D0D0D] text-xs font-black uppercase tracking-wider">🔥 Mais Popular</span>
                      <Star className="w-4 h-4 text-[#0D0D0D]" />
                    </div>

                    <div className="flex items-start justify-between mb-4 mt-2">
                      <div>
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                          <Crown className="w-6 h-6 text-[#FFD700]" />
                          Premium
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black text-[#00FF00]">{getPremiumPrice()}</p>
                          <span className="text-sm text-gray-400">/mês</span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        wantsPremium ? 'border-[#00FF00] bg-[#00FF00] scale-110' : 'border-white/30'
                      }`}>
                        {wantsPremium && <Check className="w-5 h-5 text-[#0D0D0D]" />}
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">10+ Jogos Exclusivos Premium</p>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">Todos os Modos (Leve, Moderado, Corajoso, Extremo)</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">5 Listas de Jogadores (30 nomes cada)</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">Cartas Personalizadas Ilimitadas</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">Avaliações de Drinks com IA</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#00FF00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0D0D0D]" />
                        </div>
                        <p className="text-sm font-semibold text-white">Sem Anúncios (Zero Interrupções)</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <p className="text-center text-xs text-gray-400">
                        ✨ Cancele quando quiser • 💳 Sem compromisso
                      </p>
                    </div>
                  </div>

                  {/* Plano Gratuito - Simples */}
                  <div 
                    onClick={() => setWantsPremium(false)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      !wantsPremium 
                        ? 'border-white/30 bg-white/5' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Gratuito</h3>
                        <p className="text-2xl font-bold text-gray-400">R$ 0,00</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        !wantsPremium ? 'border-white/50 bg-white/10' : 'border-white/20'
                      }`}>
                        {!wantsPremium && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        3 jogos básicos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        Modo Leve apenas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        Com anúncios
                      </li>
                    </ul>
                  </div>

                  <p className="text-center text-xs text-gray-500 italic">
                    💡 Você pode mudar para Premium a qualquer momento!
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <p className="text-center text-gray-500 text-xs mt-6">
              Ao criar uma conta, você concorda com nossos Termos de Uso e confirma ter 18 anos ou mais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
