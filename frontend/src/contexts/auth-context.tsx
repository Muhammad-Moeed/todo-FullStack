"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserSession } from "@/types/user";
import { authClient } from "@/lib/auth-client";

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
  // Use useSession with minimal configuration to prevent infinite loops
  const { data: session, isPending } = authClient.useSession({
    refetchInterval: false, // Disable auto-refetch
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Only fetch once on mount
    retry: false, // Don't retry on error
  });
  const [user, setUser] = useState<User | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    // Only process once to prevent infinite loops
    if (hasCheckedSession) return;
    
    if (!isPending) {
      setHasCheckedSession(true);
      
      if (session?.user) {
        // Convert Better Auth session to our UserSession format
        const convertedSession: UserSession = {
          user: {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.name || undefined,
            createdAt: session.user.createdAt?.toISOString() || new Date().toISOString(),
          },
          token: session.sessionToken || "",
          expiresAt: session.expiresAt?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setUserSession(convertedSession);
        setUser(convertedSession.user);
      } else {
        setUserSession(null);
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [session, isPending, hasCheckedSession]);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      // Better Auth automatically sets cookies and session
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Session will be updated automatically via useSession hook
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error?.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: name || email.split("@")[0], // Use email prefix as default name if not provided
      });

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      // After signup, automatically sign in the user
      // Better Auth signUp doesn't automatically log in, so we do it manually
      const signInResult = await authClient.signIn.email({
        email,
        password,
      });

      if (signInResult.error) {
        console.warn("Auto-login after signup failed:", signInResult.error);
        // Don't throw - signup was successful, user can login manually
      }

      // Session will be updated automatically via useSession hook
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw new Error(error?.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      // Session will be cleared automatically via useSession hook
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: userSession,
        isLoading: isLoading || isPending,
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
