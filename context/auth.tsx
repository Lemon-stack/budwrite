"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  userName: string;
  userType: "free" | "pro";
  subscriptionId?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  isOnboarded: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setFirebaseUser(firebaseUser);
        setError(null);

        if (firebaseUser) {
          // Create user object from Firebase user
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            userName:
              firebaseUser.displayName || firebaseUser.email?.split("@")[0]!,
            userType: "free", // Default to free tier
            isOnboarded: false,
            createdAt: new Date().toISOString(),
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast.error("Authentication Error", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const error = err as { code: string; message: string };
      setError(error.message);
      toast.error("Sign In Failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      toast.success("Signed Out", {
        description: "You have been signed out successfully.",
      });
    } catch (err) {
      const error = err as { code: string; message: string };
      setError(error.message);
      toast.error("Sign Out Failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement subscription refresh logic
      // This will need to be implemented based on your subscription service
      toast.success("Subscription Updated", {
        description: "Your subscription status has been updated.",
      });
    } catch (err) {
      const error = err as { code: string; message: string };
      setError(error.message);
      toast.error("Subscription Update Failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        error,
        signInWithGoogle,
        signOut,
        refreshSubscription,
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
