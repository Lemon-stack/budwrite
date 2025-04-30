import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

type GenerationStage = "uploading" | "analyzing" | "generating" | "saving";
type SetStageFunction = (stage: GenerationStage) => void;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "stories";
const MAX_IMAGES = 2;

export function useStoryGeneration() {
  const { supabase, refreshCredits } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Image size must be less than 5MB");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    if (file.type === "image/svg+xml") {
      throw new Error("SVG files are not supported for story generation");
    }
  };

  const uploadImage = async (file: File, setCurrentStage: SetStageFunction) => {
    setIsImageLoading(true);
    setCurrentStage("uploading");
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User must be authenticated to upload images");
      }

      validateImage(file);
      const fileName = `${user.id}-${Date.now()}-${file.name}`;

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      return urlData.publicUrl;
    } finally {
      setIsImageLoading(false);
    }
  };

  const checkCredits = async (userId: string, requiredCredits: number) => {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error("Failed to check credits");
    }

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.credits < requiredCredits) {
      toast.error(
        "Insufficient credits. Please purchase more credits to continue."
      );
      throw new Error("Insufficient credits");
    }

    return userData.credits;
  };

  const generateStoryWithAI = async (
    imageUrls: string[],
    title: string,
    maxTokens: number,
    setCurrentStage: SetStageFunction
  ) => {
    try {
      setCurrentStage("analyzing");

      // First, analyze the image
      const analysisResponse = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrls[0],
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error("Failed to analyze image:", {
          status: analysisResponse.status,
          statusText: analysisResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to analyze image: ${analysisResponse.status} ${errorText}`
        );
      }

      const analysisData = await analysisResponse.json();
      if (!analysisData.description) {
        throw new Error("Failed to get image description");
      }

      setCurrentStage("generating");

      // Then generate the story
      const storyResponse = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDescriptions: [analysisData.description],
          title,
          max_tokens: maxTokens,
        }),
      });

      if (!storyResponse.ok) {
        const errorText = await storyResponse.text();
        console.error("Failed to generate story:", {
          status: storyResponse.status,
          statusText: storyResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to generate story: ${storyResponse.status} ${errorText}`
        );
      }

      const storyData = await storyResponse.json();

      if (!storyData.content || typeof storyData.content !== "string") {
        console.error("Invalid story response format:", storyData);
        throw new Error("Invalid story response format");
      }

      return storyData.content;
    } catch (error) {
      console.error("Error in generateStoryWithAI:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        imageUrls,
        title,
      });
      throw error;
    }
  };

  const generateStory = async (
    imageFiles: File[],
    title: string,
    maxTokens: number,
    setCurrentStage: SetStageFunction
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (imageFiles.length === 0) {
        throw new Error("Please select an image");
      }

      if (imageFiles.length > 1) {
        throw new Error("Please select only one image");
      }

      const imageFile = imageFiles[0];

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User must be authenticated");
      }

      // Calculate required credits based on maxTokens
      const requiredCredits =
        maxTokens === 12000
          ? 8
          : maxTokens === 8000
            ? 6
            : maxTokens === 5000
              ? 4
              : 2;
      const credits = await checkCredits(user.id, requiredCredits);

      const imageUrl = await uploadImage(imageFile, setCurrentStage);

      const verifyResponse = await fetch(imageUrl);
      if (!verifyResponse.ok) {
        throw new Error("Failed to verify uploaded image");
      }

      const story = await generateStoryWithAI(
        [imageUrl],
        title,
        maxTokens,
        setCurrentStage
      );

      setCurrentStage("saving");
      const { data: createdStory, error: storyError } = await supabase
        .from("stories")
        .insert([
          {
            user_id: user.id,
            title,
            content: story,
            image: imageUrl,
            status: "completed",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (storyError) {
        toast.error("We couldn't save your story. Please try again.");
        throw new Error("Failed to save story");
      }

      if (!createdStory?.id) {
        toast.error(
          "Something went wrong while creating your story. Please try again."
        );
        throw new Error("Failed to save story");
      }

      const { error: creditError } = await supabase
        .from("users")
        .update({ credits: credits - requiredCredits })
        .eq("id", user.id);

      if (creditError) {
        await supabase.from("stories").delete().eq("id", createdStory.id);
        toast.error("We couldn't update your credits. Please try again.");
        throw new Error("Failed to update credits");
      }

      await refreshCredits();

      // Reset loading state before returning
      setIsLoading(false);
      setCurrentStage("uploading"); // Reset to initial stage

      return createdStory.id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  };

  return { isLoading, isImageLoading, error, generateStory };
}
