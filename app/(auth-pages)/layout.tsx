import type React from "react";
import { BookOpen } from "lucide-react";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  // Get the current pathname to determine which page we're on
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isSignUp = pathname.includes("sign-up");
  const isForgotPassword = pathname.includes("forgot-password");

  return (
    <div className="min-h-screen h-dvh fixed z-30 inset-0 bg-background">
      {/* Content columns */}
      <Toaster />
      <div
        className={cn(
          "flex w-full h-full transition-all duration-700",
          isSignUp ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Form column */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Illustration column */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                  animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `scale(${Math.random() * 0.8 + 0.2})`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <Logo text="text-4xl" icon="h-12 w-12" />
            <h1 className="mt-8 text-4xl font-bold">
              {isSignUp
                ? "Join PictoStory Today"
                : isForgotPassword
                  ? "Reset Your Password"
                  : "Welcome Back"}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              {isSignUp
                ? "Create an account to start generating stories from your images"
                : isForgotPassword
                  ? "Enter your email to reset your password"
                  : "Sign in to your account to continue"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
