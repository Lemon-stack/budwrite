"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStoryGeneration } from "@/lib/hooks/useStoryGeneration";
import { useRouter } from "next/navigation";

type StoryContextType = {
  currentStory: any | null;
  isLoading: boolean;
  error: string | null;
  generateNewStory: (file: File, title: string) => Promise<string>;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentStory, setCurrentStory] = useState<any | null>(null);
  const { isLoading, error, generateStory } = useStoryGeneration();
  const router = useRouter();

  const generateNewStory = async (imageFile: File, title: string) => {
    try {
      const storyId = await generateStory(imageFile, title);

      // Explicitly check if storyId is valid before proceeding
      if (!storyId || typeof storyId !== "string" || storyId.trim() === "") {
        throw new Error("Invalid story ID received");
      }

      // Only set story if we have a valid storyId
      setCurrentStory({ id: storyId, title });
      return storyId;
    } catch (error) {
      console.error("Error generating story:", error);
      // Error is already handled in useStoryGeneration (sets error state)
      throw error;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        isLoading,
        error,
        generateNewStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
