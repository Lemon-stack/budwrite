import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { StoryProvider } from "@/context/StoryContext";
import { AuthProvider } from "@/context/auth";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import DasboardSidebar from "@/components/dashboard/side-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/dashboard/header";
import Wrapper from "@/components/wrapper";
import Loading from "@/loading";
import { Suspense } from "react";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PictoStory",
  description: "Generate stories from your images",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense fallback={<Loading />}>
              <StoryProvider>
                <SidebarProvider>
                  <Wrapper>
                    <main className="flex-1 p-4 relative md:p-6 overflow-auto">
                      {children}
                    </main>
                  </Wrapper>
                </SidebarProvider>
              </StoryProvider>
            </Suspense>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
