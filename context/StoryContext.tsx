"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

type GenerationStage =
  | "uploading"
  | "analyzing"
  | "generating"
  | "saving"
  | "created";

type StoryContextType = {
  currentStory: any | null;
  isLoading: boolean;
  isImageLoading: boolean;
  error: string | null;
  currentStage: GenerationStage;
  generateNewStory: (
    files: File[],
    title: string,
    maxTokens: number
  ) => Promise<string>;
  clearInputs: () => void;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentStory, setCurrentStory] = useState<any | null>(null);
  const [currentStage, setCurrentStage] =
    useState<GenerationStage>("uploading");
  const { isLoading, isImageLoading, error, generateStory } =
    useStoryGeneration();
  const router = useRouter();

  const clearInputs = () => {
    setCurrentStory(null);
    setCurrentStage("uploading");
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const generateNewStory = async (
    imageFiles: File[],
    title: string,
    maxTokens: number
  ) => {
    try {
      setCurrentStage("uploading");
      const storyId = await generateStory(
        imageFiles,
        title,
        maxTokens,
        setCurrentStage
      );
      setCurrentStory({ id: storyId, title });
      setCurrentStage("created");
      triggerConfetti();
      router.push(`/story/${storyId}`);
      return storyId;
    } catch (error) {
      console.error("Error in generateNewStory:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        isLoading,
        isImageLoading,
        error,
        currentStage,
        generateNewStory,
        clearInputs,
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
