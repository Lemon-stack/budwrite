import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "stories";

export function useStoryGeneration() {
  const { supabase } = useAuth();
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
  };

  const uploadImage = async (file: File) => {
    setIsImageLoading(true);
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
      console.log("Uploading file:", fileName);

      toast.info("Uploading image...");
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      console.log("Generated public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } finally {
      setIsImageLoading(false);
    }
  };

  const checkCredits = async (userId: string) => {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error checking credits:", userError);
      throw new Error("Failed to check credits");
    }

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.credits <= 0) {
      toast.error(
        "Insufficient credits. Please purchase more credits to continue."
      );
    }

    return userData.credits;
  };

  const generateStory = async (imageFile: File, title: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting story generation process");

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("User must be authenticated");
      }
      console.log("User authenticated:", user.id);

      // Check credits first before any expensive operations
      const credits = await checkCredits(user.id);
      console.log("User credits:", credits);
      if (credits <= 0) {
        console.error("Insufficient credits for user:", user.id);
        toast.error("Insufficient credits");
        throw new Error("Insufficient credits");
      }

      // Upload image
      console.log("Starting image upload");
      const imageUrl = await uploadImage(imageFile);
      console.log("Image uploaded successfully:", imageUrl);

      // Verify image
      console.log("Verifying uploaded image");
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        console.error("Image verification failed:", {
          status: imageResponse.status,
          statusText: imageResponse.statusText,
        });
        toast.error("Failed to verify uploaded image");
        throw new Error("Failed to verify uploaded image");
      }

      // Analyze image
      console.log("Starting image analysis");
      const analyzeResponse = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!analyzeResponse.ok) {
        console.error("Image analysis failed:", {
          status: analyzeResponse.status,
          statusText: analyzeResponse.statusText,
        });
        toast.error("Failed to analyze image");
        throw new Error("Failed to analyze image");
      }

      const { description } = await analyzeResponse.json();
      console.log("Image analysis completed");

      // Generate story
      console.log("Starting story generation");
      const storyResponse = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, title }),
      });

      if (!storyResponse.ok) {
        console.error("Story generation failed:", {
          status: storyResponse.status,
          statusText: storyResponse.statusText,
        });
        toast.error("Failed to generate story");
        throw new Error("Failed to generate story");
      }

      const storyData = await storyResponse.json();
      // console.log("Story generated successfully");

      // Save story and deduct credits
      // console.log("Saving story and deducting credits");

      // First, create the story record
      const { data: createdStory, error: storyError } = await supabase
        .from("stories")
        .insert({
          title,
          content: storyData.content,
          image: imageUrl,
          user_id: user.id,
          status: "completed",
        })
        .select("id")
        .single();

      if (storyError) {
        // console.error("Error creating story:", storyError);
        toast.error("Failed to save story");
        throw new Error("Failed to save story");
      }

      if (!createdStory?.id) {
        // console.error("No story ID returned from story creation");
        toast.error("Failed to save story");
        throw new Error("Failed to save story");
      }

      // Then deduct credits
      const { error: creditError } = await supabase
        .from("users")
        .update({ credits: credits - 1 })
        .eq("id", user.id);

      if (creditError) {
        // console.error("Error deducting credits:", creditError);
        // Try to delete the story since credit deduction failed
        await supabase.from("stories").delete().eq("id", createdStory.id);
        toast.error("Failed to update credits");
        throw new Error("Failed to update credits");
      }

      // console.log("Story saved successfully with ID:", createdStory.id);
      return createdStory.id;
    } catch (error) {
      console.error("Error in generateStory:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isImageLoading, error, generateStory };
}
