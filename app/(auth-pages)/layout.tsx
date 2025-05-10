import type React from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Logo from "@/components/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-dvh fixed z-30 inset-0 bg-background">
      {/* Content columns */}
      <Toaster />
      <div className={cn("flex w-full h-full transition-all duration-700")}>
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
