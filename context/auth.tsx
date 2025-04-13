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
  supabase: ReturnType<typeof createClient>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  supabase: createClient(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // console.log("AuthProvider mounted");

    const checkAndCreateUser = async () => {
      try {
        // console.log("Checking session...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          // console.log("Session error:", sessionError);
          throw sessionError;
        }

        console.log("Session:", session);

        if (session?.user) {
          console.log("User found in session:", session.user);
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (fetchError) {
            if (fetchError.code === "PGRST116") {
              // console.log("User not found in database, creating new user...");
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
                    credits: 1,
                  },
                ])
                .select()
                .single();

              if (createError) {
                console.error("Error creating user:", createError);
                throw createError;
              }
              console.log("New user created:", newUser);
              setUser(newUser);
            } else {
              console.error("Error fetching user:", fetchError);
              throw fetchError;
            }
          } else if (existingUser) {
            // console.log("Existing user found:", existingUser);
            setUser(existingUser);
          }
        } else {
          console.log("No session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth context:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndCreateUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log("Auth state changed:", event, session);
      if (session?.user) {
        checkAndCreateUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      // console.log("AuthProvider unmounting");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, supabase }}>
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
