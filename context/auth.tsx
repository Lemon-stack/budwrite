"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  email: string;
  userName: string;
  userType: UserType;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (fetchError && fetchError.code === "PGRST116") {
            // User doesn't exist, create new user
            const randomName = `user${Math.floor(Math.random() * 10000)}`;
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  userName: randomName,
                  userType: "free",
                  createdAt: new Date().toISOString(),
                },
              ])
              .select()
              .single();

            if (createError) throw createError;
            setUser(newUser);
          } else if (existingUser) {
            setUser(existingUser);
          }
        }
      } catch (error) {
        console.error("Error in auth context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndCreateUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAndCreateUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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
