import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import Logo from "@/components/logo";
import { AtSign, ArrowLeft } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full max-w-md">
      <div className="w-full p-8 space-y-6 bg-white rounded-xl border border-gray-200 transition-all duration-300">
        <div className="flex flex-col items-center text-center space-y-2 mb-4 animate-fadeIn">
          <div className="mb-2">
            <Logo text="hidden" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-5 animate-slideUp">
          <form className="space-y-5" action={forgotPasswordAction}>
            <div className="space-y-1.5 group">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <AtSign className="h-3.5 w-3.5 text-purple-500" />
                Email
              </Label>
              <div className="relative">
                <Input
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all pl-3 pr-3 py-2 rounded-md"
                />
              </div>
            </div>

            <SubmitButton
              formAction={forgotPasswordAction}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-md transition-all duration-200 transform hover:translate-y-[-1px]"
            >
              Reset Password
            </SubmitButton>
          </form>

          <FormMessage message={searchParams} />
          <SmtpMessage />

          <div className="text-center pt-2">
            <Link
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors inline-flex items-center gap-1.5"
              href="/sign-in"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
