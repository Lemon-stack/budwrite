import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "../logo";
import { useAuth } from "@/context/auth";

export default function Header() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo text="text-zinc-300" icon="text-zinc-100" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm text-white/70 hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm hidden text-white/70 hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm text-white/70 hover:text-white"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm hidden text-white/70 hover:text-white"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-black/20"
            >
              <Link href="/sign-in">Log in</Link>
            </Button>
          )}

          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            <Link
              href={isAuthenticated ? "/dashboard" : "/sign-in"}
              className="flex"
            >
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
