import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
export const useCreations = () => {
  const { supabase } = useAuth();

  async function getCreations() {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    }
    if (data) {
      return data;
    }
  }

  return { getCreations };
};
