"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import DasboardSidebar from "@/components/dashboard/side-bar";
import { Header } from "@/components/dashboard/header";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DasboardSidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
