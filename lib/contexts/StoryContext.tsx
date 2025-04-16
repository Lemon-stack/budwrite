"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStoryGeneration } from "@/lib/hooks/useStoryGeneration";
import { useRouter } from "next/navigation";

type StoryContextType = {
  currentStory: any | null;
  isLoading: boolean;
  isImageLoading: boolean;
  error: string | null;
  generateNewStory: (files: File[], title: string) => Promise<string>;
  clearInputs: () => void;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentStory, setCurrentStory] = useState<any | null>(null);
  const { isLoading, isImageLoading, error, generateStory } =
    useStoryGeneration();
  const router = useRouter();

  const clearInputs = () => {
    setCurrentStory(null);
  };

  const generateNewStory = async (imageFiles: File[], title: string) => {
    try {
      // console.log("Starting story generation with title:", title);
      const storyId = await generateStory(imageFiles, title);
      // console.log("Received story ID:", storyId);

      // Validate story ID
      if (!storyId) {
        console.error("No story ID returned from generateStory");
        throw new Error("No story ID received from generation process");
      }

      if (typeof storyId !== "string") {
        console.error("Invalid story ID type:", typeof storyId);
        throw new Error(
          `Invalid story ID type: expected string, got ${typeof storyId}`
        );
      }

      if (storyId.trim() === "") {
        console.error("Empty story ID received");
        throw new Error("Empty story ID received");
      }

      // Only set story if we have a valid storyId
      setCurrentStory({ id: storyId, title });
      // console.log("Successfully set current story with ID:", storyId);
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
