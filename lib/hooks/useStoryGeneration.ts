import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
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
      // console.log("Uploading file:", fileName);

      toast.info("Uploading image...");
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      // console.log("Generated public URL:", urlData.publicUrl);
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
      // console.error("Error checking credits:", userError);
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

  const generateStoryWithAI = async (imageUrls: string[], title: string) => {
    // console.log("Starting story generation with AI");
    // console.log("Image URLs:", imageUrls);
    // console.log("Title:", title);

    try {
      // Analyze all images
      const imageDescriptions = await Promise.all(
        imageUrls.map(async (imageUrl) => {
          // console.log("Making analyze request to /api/gemini/analyze");
          const analyzeResponse = await fetch("/api/gemini/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
          });

          if (!analyzeResponse.ok) {
            const errorText = await analyzeResponse.text();
            // console.error("Analyze response error:", errorText);
            throw new Error(
              `Failed to analyze image: ${analyzeResponse.status} ${errorText}`
            );
          }

          const analyzeData = await analyzeResponse.json();
          return analyzeData.description;
        })
      );

      // console.log("Making generate request to /api/generate-story");
      const storyResponse = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descriptions: imageDescriptions,
          title,
          imageUrls,
        }),
      });

      if (!storyResponse.ok) {
        const errorText = await storyResponse.text();
        // console.error("Generate response error:", errorText);
        throw new Error(
          `Failed to generate story: ${storyResponse.status} ${errorText}`
        );
      }

      const storyData = await storyResponse.json();
      // console.log("Story generation successful");
      return storyData.content;
    } catch (error) {
      // console.error("Error in generateStoryWithAI:", {
      //   error,
      //   message: error instanceof Error ? error.message : "Unknown error",
      //   stack: error instanceof Error ? error.stack : undefined,
      // });
      throw error;
    }
  };

  const generateStory = async (imageFiles: File[], title: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (imageFiles.length === 0) {
        throw new Error("Please select an image");
      }

      if (imageFiles.length > 1) {
        throw new Error("Please select only one image");
      }

      // Only use the first image
      const imageFile = imageFiles[0];

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User must be authenticated");
      }

      // Calculate required credits: 1 for image + 1 for story generation
      const requiredCredits = 2;
      const credits = await checkCredits(user.id, requiredCredits);

      // Upload the image
      const imageUrl = await uploadImage(imageFile);

      // Verify the uploaded image
      const verifyResponse = await fetch(imageUrl);
      if (!verifyResponse.ok) {
        throw new Error("Failed to verify uploaded image");
      }

      // Generate story
      const story = await generateStoryWithAI([imageUrl], title);

      // Save story to database
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

      // Deduct credits
      const { error: creditError } = await supabase
        .from("users")
        .update({ credits: credits - requiredCredits })
        .eq("id", user.id);

      if (creditError) {
        // Attempt to delete the story
        await supabase.from("stories").delete().eq("id", createdStory.id);
        toast.error("We couldn't update your credits. Please try again.");
        throw new Error("Failed to update credits");
      }

      // Refresh credits in the auth context
      await refreshCredits();

      return createdStory.id;
    } catch (error) {
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
