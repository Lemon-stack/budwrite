import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth";

export interface Writing {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useWriting(id?: string) {
  const [writing, setWriting] = useState<Writing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (id === "new") {
      setWriting({
        id: "",
        title: "Untitled",
        content: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setIsLoading(false);
      return;
    }

    if (id) {
      const fetchWriting = async () => {
        try {
          const writingRef = doc(db, `users/${user.id}/writings/${id}`);
          const writingDoc = await getDoc(writingRef);

          if (writingDoc.exists()) {
            setWriting(writingDoc.data() as Writing);
          } else {
            setError("Writing not found");
          }
        } catch (err) {
          setError("Failed to fetch writing");
          console.error("Error fetching writing:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchWriting();
    }
  }, [id, user, router, db]);

  const saveWriting = async () => {
    if (!user || !writing) return;

    try {
      // If this is a new writing (no ID), generate one
      const writingId = writing.id || uuidv4();
      const updatedWriting = {
        ...writing,
        id: writingId,
        updated_at: new Date().toISOString(),
      };

      const writingRef = doc(db, `users/${user.id}/writings/${writingId}`);
      await setDoc(writingRef, updatedWriting, { merge: true });
      setWriting(updatedWriting);
      setHasUnsavedChanges(false);

      // If this was a new writing, redirect to the permanent URL
      if (!writing.id) {
        router.replace(`/w/${writingId}`);
      }

      return true;
    } catch (err) {
      console.error("Error saving writing:", err);
      throw new Error("Failed to save writing");
    }
  };

  const updateWriting = (updates: Partial<Writing>) => {
    if (!writing) return;

    setWriting((prev) => ({
      ...prev!,
      ...updates,
    }));
    setHasUnsavedChanges(true);
  };

  return {
    writing,
    isLoading,
    error,
    updateWriting,
    saveWriting,
    hasUnsavedChanges,
  };
}
