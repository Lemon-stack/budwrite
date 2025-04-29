import { signUpAction } from "@/app/actions";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Logo from "@/components/logo";
import { AtSign } from "lucide-react";
import { toast } from "sonner";
import { AuthToast } from "@/components/auth-toast";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  if (error) {
    toast.error(error);
  }
  if (success) {
    toast.success(success);
  }

  return (
    <div className="w-full max-w-md">
      <AuthToast />
      <div className="w-full p-8 space-y-6 transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center text-center space-y-2 mb-4 animate-fadeIn">
          <div className="mb-2">
            <Logo text="hidden" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Join Picto Story and start your creative journey
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-5 animate-slideUp">
          <form className="space-y-5" action={signUpAction}>
            <div className="space-y-1.5 group">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <AtSign className="h-3.5 w-3.5 text-purple-500" />
                Email
              </Label>
              <div className="relative">
                <Input
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-all pl-3 pr-3 py-2 rounded-md"
                />
              </div>
            </div>

            <PasswordInput
              name="password"
              label="Password"
              placeholder="Create a password"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">
              Must be at least 6 characters
            </p>

            <PasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              minLength={6}
              required
            />

            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-medium py-2.5 rounded-md transition-all duration-200 transform hover:translate-y-[-1px]"
            >
              Sign up
            </SubmitButton>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              const supabase = await createClient();
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                },
              });
              if (data.url) {
                redirect(data.url);
              }
            }}
          >
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
              Already have an account?{" "}
              <Link
                className="text-purple-600 hover:text-purple-800 dark:text-purple-500 dark:hover:text-purple-400 font-medium transition-colors"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
