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
        <div className="hidden md:flex md:w-1/2 bg-sidebar-border/30 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
          <Logo text="text-base" icon="h-8 w-8" showCaption={true} />
        </div>
      </div>
    </div>
  );
}
