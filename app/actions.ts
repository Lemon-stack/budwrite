"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !confirmPassword) {
    redirect("/sign-up?error=All fields are required");
  }

  if (password !== confirmPassword) {
    redirect("/sign-up?error=Passwords do not match");
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    // console.error(signUpError.code + " " + signUpError.message);
    redirect(`/sign-up?error=${signUpError.message}`);
  }

  if (signUpData?.user) {
    // Create user record in database
    const { error: createUserError } = await supabase.from("users").upsert(
      [
        {
          id: signUpData.user.id,
          email: signUpData.user.email,
          userName: email.split("@")[0],
          userType: "free",
          createdAt: new Date().toISOString(),
          credits: 2,
        },
      ],
      {
        onConflict: "id",
      }
    );

    if (createUserError) {
      // console.error("Error creating user record:", createUserError);
      redirect("/sign-up?error=Failed to create user profile");
    }
  }

  redirect(
    "/sign-in?success=Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
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

  redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("Url")?.toString();

  if (!email) {
    redirect("/forgot-password?error=Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    // console.error(error.message);
    redirect("/forgot-password?error=Could not reset password");
  }

  if (callbackUrl) {
    redirect(callbackUrl);
  }

  redirect(
    "/sign-in?success=Check your email for a link to reset your password"
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Password and confirm password are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: "Password update failed" };
  }

  return {
    success: "Password updated successfully",
    redirect: "/dashboard",
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
