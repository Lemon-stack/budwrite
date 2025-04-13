import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "stories";

export function useStoryGeneration() {
  const { supabase } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to upload images");
    }

    try {
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
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
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
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User must be authenticated");
      }

      // Check credits first before any expensive operations
      const credits = await checkCredits(user.id);
      if (credits <= 0) {
        toast.error("Insufficient credits");
      }

      // Upload image
      const imageUrl = await uploadImage(imageFile);

      // Verify image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        toast.error("Failed to verify uploaded image");
      }

      // Analyze image
      const analyzeResponse = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!analyzeResponse.ok) {
        toast.error("Failed to analyze image");
      }

      const { description } = await analyzeResponse.json();

      // Generate story
      const storyResponse = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, title }),
      });

      if (!storyResponse.ok) {
        toast.error("Failed to generate story");
      }

      const storyData = await storyResponse.json();

      // Save story and deduct credits
      const { data: result, error: transactionError } = await supabase.rpc(
        "create_story_and_deduct_credit",
        {
          p_title: title,
          p_content: storyData.content,
          p_image: imageUrl,
          p_user_id: user.id,
        }
      );

      if (transactionError || !result?.story_id) {
        console.error("Error creating story:", transactionError);
        toast.error("Failed to save story and update credits");
      }

      return result.story_id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, generateStory };
}
