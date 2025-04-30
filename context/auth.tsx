"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  email: string;
  userName: string;
  isOnboarded: boolean;
  createdAt: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  supabase: ReturnType<typeof createClient>;
  credits: number | null;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = createClient();

  const refreshCredits = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();
    setCredits(data?.credits ?? 0);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCredits(null);
  };

  useEffect(() => {
    const checkAndCreateUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (fetchError) {
            if (fetchError.code === "PGRST116") {
              const { data: newUser, error: createError } = await supabase
                .from("users")
                .upsert(
                  [
                    {
                      id: session.user.id,
                      email: session.user.email,
                      userName: session.user.email?.split("@")[0],
                      createdAt: new Date().toISOString(),
                      credits: 2,
                      isOnboarded: false,
                    },
                  ],
                  {
                    onConflict: "id",
                  }
                )
                .select()
                .single();
              // console.log("newUser", newUser, createError);
              if (createError) {
                throw createError;
              }

              if (!newUser) {
                const { data: fetchedUser, error: fetchError } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", session.user.id)
                  .single();

                if (fetchError) {
                  throw fetchError;
                }

                setUser(fetchedUser);
                setCredits(fetchedUser.credits);
              } else {
                setUser(newUser);
                setCredits(newUser.credits);
              }
            } else {
              throw fetchError;
            }
          } else if (existingUser) {
            setUser(existingUser);
            setCredits(existingUser.credits);
          }
        } else {
          setUser(null);
          setCredits(null);
        }
      } catch (error) {
        setUser(null);
        setCredits(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndCreateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkAndCreateUser();
      } else {
        setUser(null);
        setCredits(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, supabase, credits, refreshCredits, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
