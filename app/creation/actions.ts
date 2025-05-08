"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCreations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stories").select("*");
  if (error) {
    console.error(error);
  }
  return data;
}

