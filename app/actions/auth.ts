"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
  return;
}

export async function createUserAction(userId: string, email: string) {
  const supabase = await createClient();
  const randomName = `user${Math.floor(Math.random() * 10000)}`;

  const { data: newUser, error: createError } = await supabase
    .from("users")
    .upsert(
      [
        {
          id: userId,
          email: email,
          userName: randomName,
          userType: "free",
          createdAt: new Date().toISOString(),
          credits: 2,
        },
      ],
      {
        onConflict: "email",
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (createError) {
    console.error("Error creating user:", createError);
    throw createError;
  }

  return newUser;
}
