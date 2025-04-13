import type React from "react";
import { BookOpen } from "lucide-react";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current pathname to determine which page we're on
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isSignUp = pathname.includes("sign-up");
  const isForgotPassword = pathname.includes("forgot-password");

  return (
    <div className="min-h-screen w-full flex">
      {/* Content columns */}
      <div
        className={cn(
          "flex w-full transition-all duration-700",
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

          <div className="max-w-md text-center z-10 transition-all duration-500 transform">
            <div className="mx-auto mb-8 h-20 w-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Logo text="hidden" />
            </div>

            <h1 className="text-3xl font-bold mb-4 tracking-tight">
              Picto Story
            </h1>
            <p className="text-xl mb-6 leading-relaxed font-light">
              {isForgotPassword
                ? "No worries! We'll help you reset your password and get back to creating."
                : isSignUp
                  ? "Join our community and start creating beautiful picture stories today."
                  : "Welcome back! Sign in to continue your creative journey."}
            </p>

            {/* Decorative elements */}
            {/* <div className="grid grid-cols-3 gap-4 mt-12 max-w-xs mx-auto">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/30"
                  style={{
                    opacity: 0.7 + i * 0.05,
                    transform: `rotate(${(i % 3) * 3}deg)`,
                  }}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
