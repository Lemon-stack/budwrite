"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStoryGeneration } from "@/lib/hooks/useStoryGeneration";
import { useRouter } from "next/navigation";

type StoryContextType = {
  currentStory: any | null;
  isLoading: boolean;
  error: string | null;
  generateNewStory: (file: File, title: string) => Promise<void>;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentStory, setCurrentStory] = useState<any | null>(null);
  const { isLoading, error, generateStory } = useStoryGeneration();
  const router = useRouter();

  const generateNewStory = async (file: File, title: string) => {
    try {
      const storyId = await generateStory(file, title);
      if (storyId) {
        setCurrentStory({ id: storyId, title });
        router.push(`/dashboard/story/${storyId}`);
      }
    } catch (err) {
      console.error("Error generating story:", err);
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
