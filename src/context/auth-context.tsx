"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse, AuthSession, LoginCredentials, User, UserRole } from "@/types/auth";
import {
  authenticateUser,
  clearClientSession,
  getClientSession,
} from "@/lib/auth/auth-service";

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: (redirectPath?: string) => void;
  hasRole: (allowedRoles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load session on initial mount
  useEffect(() => {
    try {
      const activeSession = getClientSession();
      if (activeSession) {
        setSession(activeSession);
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await authenticateUser(credentials);
        if (response.success && response.session) {
          setSession(response.session);
        }
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(
    (redirectPath: string = "/login") => {
      clearClientSession();
      setSession(null);
      router.push(redirectPath);
      router.refresh();
    },
    [router]
  );

  const hasRole = useCallback(
    (allowedRoles: UserRole | UserRole[]): boolean => {
      if (!session?.user) return false;
      const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      return roleArray.includes(session.user.role);
    },
    [session]
  );

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
