"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  isPremium: boolean;
  playerLists?: PlayerList[];
}

interface PlayerList {
  id: string;
  name: string;
  players: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simular carregamento de usuário do localStorage
    const storedUser = localStorage.getItem("brinde_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de login - em produção, conectar com backend real
    const mockUser: User = {
      id: "1",
      email,
      isPremium: false,
      playerLists: [],
    };
    setUser(mockUser);
    localStorage.setItem("brinde_user", JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string) => {
    // Simulação de signup - em produção, conectar com backend real
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      isPremium: false,
      playerLists: [],
    };
    setUser(mockUser);
    localStorage.setItem("brinde_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brinde_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
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
