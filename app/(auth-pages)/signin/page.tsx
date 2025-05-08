"use client";

import { signInWithGoogle } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="w-full max-w-md">
      <div className="w-full p-8 space-y-6 transition-all duration-300 bg-background">
        <div className="flex flex-col items-center text-center space-y-2 mb-4 animate-fadeIn">
          <div className="mb-2">
            <Logo text="hidden" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue to Picto Story
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-5 animate-slideUp">
          <form action={signInWithGoogle}>
            <Button
              type="submit"
              variant="outline"
              className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:translate-y-[-1px]"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                className="text-purple-600 hover:text-purple-800 dark:text-purple-500 dark:hover:text-purple-400 font-medium transition-colors"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
