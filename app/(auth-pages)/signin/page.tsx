"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useAuth } from "@/context/auth";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const { signInWithGoogle, firebaseUser, isLoading, error } = useAuth();

  useEffect(() => {
    if (firebaseUser) {
      router.push("/dashboard");
    }
  }, [firebaseUser, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Continue with Google"
          )}
        </Button>
      </div>
    </div>
  );
}
