"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserSession } from "@/types/user";

interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedSession = localStorage.getItem("session");
        if (savedSession) {
          const parsedSession: UserSession = JSON.parse(savedSession);

          if (new Date(parsedSession.expiresAt) > new Date()) {
            setSession(parsedSession);
            setUser(parsedSession.user);

            if (typeof document !== "undefined") {
              document.cookie = `better-auth.session_token=${parsedSession.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
              document.cookie = `user-id=${parsedSession.user.id}; path=/; max-age=${7 * 24 * 60 * 60}`;
            }
          } else {
            localStorage.removeItem("session");
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const mockSession: UserSession = {
        user: {
          id: "user_" + Date.now(),
          email,
          createdAt: new Date().toISOString(),
        },
        token: "mock_token_" + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      localStorage.setItem("session", JSON.stringify(mockSession));

      if (typeof document !== "undefined") {
        document.cookie = `better-auth.session_token=${mockSession.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `user-id=${mockSession.user.id}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }

      setSession(mockSession);
      setUser(mockSession.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const signup = async (
    email: string,
    password: string,
    name?: string
  ) => {
    try {
      const mockSession: UserSession = {
        user: {
          id: "user_" + Date.now(),
          email,
          name, // ✅ name properly stored
          createdAt: new Date().toISOString(),
        },
        token: "mock_token_" + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      localStorage.setItem("session", JSON.stringify(mockSession));

      if (typeof document !== "undefined") {
        document.cookie = `better-auth.session_token=${mockSession.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `user-id=${mockSession.user.id}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }

      setSession(mockSession);
      setUser(mockSession.user);
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Signup failed");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("session");

      if (typeof document !== "undefined") {
        document.cookie = "better-auth.session_token=; path=/; max-age=0";
        document.cookie = "user-id=; path=/; max-age=0";
      }

      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
