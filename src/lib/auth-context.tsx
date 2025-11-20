"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
  birthYear: number;
  region: 'brasil' | 'portugal';
  isPremium: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, birthYear: number, region: 'brasil' | 'portugal', wantsPremium?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Emails com acesso ilimitado (admin + premium vitalício)
const UNLIMITED_ACCESS_EMAILS = [
  'ruylhaoprincipal@gmail.com',
  'francisco.s.silva03@gmail.com',
  'miguelbonvini@hotmail.com'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      // Se o usuário não existe na tabela, criar automaticamente
      if (!data) {
        const hasUnlimitedAccess = UNLIMITED_ACCESS_EMAILS.includes(email.toLowerCase());
        
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .upsert({
            id: userId,
            email,
            name: email.split('@')[0], // Nome padrão baseado no email
            birth_year: new Date().getFullYear() - 18, // Idade padrão 18 anos
            region: 'brasil',
            is_premium: hasUnlimitedAccess,
          }, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (insertError && insertError.code !== '23505') throw insertError;

        // Se houve erro de duplicata, buscar o usuário existente
        if (insertError?.code === '23505') {
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (existingUser) {
            setUser({
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              birthYear: existingUser.birth_year,
              region: existingUser.region,
              isPremium: hasUnlimitedAccess || existingUser.is_premium || false,
              isAdmin: email.toLowerCase() === 'ruylhaoprincipal@gmail.com',
            });
          }
        } else if (newUser) {
          setUser({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            birthYear: newUser.birth_year,
            region: newUser.region,
            isPremium: hasUnlimitedAccess || newUser.is_premium || false,
            isAdmin: email.toLowerCase() === 'ruylhaoprincipal@gmail.com',
          });
        }
      } else {
        // Verificar se é um email com acesso ilimitado
        const hasUnlimitedAccess = UNLIMITED_ACCESS_EMAILS.includes(email.toLowerCase());
        
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          birthYear: data.birth_year,
          region: data.region,
          // Usuários com acesso ilimitado sempre têm premium
          isPremium: hasUnlimitedAccess || data.is_premium || false,
          // Apenas o primeiro email é admin
          isAdmin: email.toLowerCase() === 'ruylhaoprincipal@gmail.com',
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      } else if (mounted) {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          loadUserData(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    birthYear: number,
    region: 'brasil' | 'portugal',
    wantsPremium: boolean = false
  ) => {
    try {
      // Verificar se é um email com acesso ilimitado
      const hasUnlimitedAccess = UNLIMITED_ACCESS_EMAILS.includes(email.toLowerCase());

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Usar upsert para evitar erro de duplicata
        const { error: userError } = await supabase.from("users").upsert({
          id: authData.user.id,
          email,
          name,
          birth_year: birthYear,
          region,
          // Usuários com acesso ilimitado sempre têm premium
          is_premium: hasUnlimitedAccess || wantsPremium,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

        if (userError && userError.code !== '23505') throw userError;

        await loadUserData(authData.user.id, email);
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      throw new Error(error.message || "Erro ao criar conta");
    }
  }, [loadUserData]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id, email);
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw new Error(error.message || "Erro ao fazer login");
    }
  }, [loadUserData]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false,
    isAdmin: user?.isAdmin || false,
    loading,
    login,
    logout,
    signup,
  }), [user, loading, login, logout, signup]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
