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
    // console.log("AuthProvider mounted");

    const checkAndCreateUser = async () => {
      try {
        console.log("Checking session...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.log("Session error:", sessionError);
          throw sessionError;
        }

        console.log("Session:", session);

        if (session?.user) {
          // console.log("User found in session:", session.user);
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", session.user.email)
            .single();
          console.log("Existing user:", existingUser);

          if (fetchError) {
            console.log("Fetch error:", fetchError);
            if (fetchError.code === "PGRST116") {
              console.log("User not found in database, creating new user...");
              // User doesn't exist, create new user
              const randomName = `user${Math.floor(Math.random() * 10000)}`;
              const { data: newUser, error: createError } = await supabase
                .from("users")
                .upsert(
                  [
                    {
                      id: session.user.id,
                      email: session.user.email,
                      userName: randomName,
                      userType: "free",
                      createdAt: new Date().toISOString(),
                      credits: 2,
                    },
                  ],
                  {
                    onConflict: "id",
                  }
                )
                .select()
                .single();

              if (createError) {
                console.error("Error creating user:", createError);
                throw createError;
              }

              // If we don't get a user back, try to fetch it
              if (!newUser) {
                const { data: fetchedUser, error: fetchError } = await supabase
                  .from("users")
                  .select("*")
                  .eq("email", session.user.email)
                  .single();

                if (fetchError) {
                  console.error(
                    "Error fetching user after creation:",
                    fetchError
                  );
                  throw fetchError;
                }

                console.log("New user fetched:", fetchedUser);
                setUser(fetchedUser);
                setCredits(fetchedUser.credits);
              } else {
                console.log("New user created:", newUser);
                setUser(newUser);
                setCredits(newUser.credits);
              }
            } else {
              console.error("Error fetching user:", fetchError);
              throw fetchError;
            }
          } else if (existingUser) {
            console.log("Existing user found:", existingUser);
            setUser(existingUser);
            setCredits(existingUser.credits);
          }
        } else {
          console.log("No session found");
          setUser(null);
          setCredits(null);
        }
      } catch (error) {
        console.error("Error in auth context:", error);
        setUser(null);
        setCredits(null);
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
        setCredits(null);
        setIsLoading(false);
      }
    });

    return () => {
      // console.log("AuthProvider unmounting");
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
