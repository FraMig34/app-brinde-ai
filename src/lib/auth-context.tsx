"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

// Email do único administrador do sistema
const ADMIN_EMAIL = 'ruylhaoprincipal@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        // Verificar se é o email do admin
        const isAdminUser = email === ADMIN_EMAIL;
        
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          birthYear: data.birth_year,
          region: data.region,
          // Admin sempre tem premium e acesso total
          isPremium: isAdminUser || data.is_premium || false,
          isAdmin: isAdminUser,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    birthYear: number,
    region: 'brasil' | 'portugal',
    wantsPremium: boolean = false
  ) => {
    try {
      // Verificar se é o email do admin
      const isAdminUser = email === ADMIN_EMAIL;

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar registro na tabela users
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          name,
          birth_year: birthYear,
          region,
          // Admin sempre tem premium
          is_premium: isAdminUser || wantsPremium,
        });

        if (userError) throw userError;

        await loadUserData(authData.user.id, email);
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      throw new Error(error.message || "Erro ao criar conta");
    }
  };

  const login = async (email: string, password: string) => {
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
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
        isAdmin: user?.isAdmin || false,
        loading,
        login,
        logout,
        signup,
      }}
    >
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
