"use server";

import { sendEmail } from "@/lib/email";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
}

const createToken = () => {
  return Math.random().toString(36).substring(2, 15);
};

export async function sendPasswordlessEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const token = createToken();
  const subject = "Passwordless Sign In";
  const text = `Click the link below to sign in: ${process.env.NEXT_PUBLIC_SITE_URL}/signin?token=${token}?email=${email}`;
  await sendEmail(email, subject, text);
}
