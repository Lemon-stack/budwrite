import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { StoryProvider } from "@/lib/contexts/StoryContext";
import { AuthProvider } from "@/context/auth";
import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PictoStory",
  description: "Generate stories from your images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <StoryProvider>
              <main className="min-h-screen w-full flex flex-col items-center">
                {children}
              </main>
            </StoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
