"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInAction(
  state: { error?: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { redirect: "/dashboard" };
}

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

export async function signUpAction(
  state: { error?: string; success?: string; redirect?: string },
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Server-side password validation
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { error: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      error: "Password must contain at least one special character (!@#$%^&*)",
    };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }
  console.log("the details", signUpData);
  if (signUpData?.user) {
    // Create user record in database using service role client
    const adminClient = await createClient(true);
    const { error: createUserError } = await adminClient.from("users").upsert(
      [
        {
          id: signUpData.user.id,
          email: signUpData.user.email || email,
          userName: (signUpData.user.email || email).split("@")[0],
          userType: "free",
          createdAt: new Date().toISOString(),
          credits: 2,
        },
      ],
      {
        onConflict: "id",
      }
    );

    console.log("erro creating user", createUserError);
    if (createUserError) {
      return { error: "Failed to create user profile" };
    }
  }

  return {
    success:
      "Thanks for signing up! Please check your email for a verification link.",
    redirect: "/sign-in",
  };
}
