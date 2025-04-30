"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (authData?.url) {
    // Get the user data after OAuth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if user exists and their onboarding status
      const { data: userData } = await supabase
        .from("users")
        .select("isOnboarded")
        .eq("id", user.id)
        .single();

      if (!userData) {
        // New user - create profile
        const { error: createError } = await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            userName: user.email?.split("@")[0],
            createdAt: new Date().toISOString(),
            credits: 2,
            isOnboarded: false,
          },
        ]);
      }
    }

    redirect(authData.url);
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
