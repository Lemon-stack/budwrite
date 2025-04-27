"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function AuthError({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null;
}

export function AuthSuccess({ message }: { message?: string }) {
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  return null;
}
