"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/context/StoryContext";
import StoryForm from "@/components/dashboard/story-form";
import { Loader2 } from "lucide-react";
import Loading from "@/loading";
import { toast } from "sonner";
import { useStories } from "@/hooks/useStories";
import { useAuth } from "@/context/auth";
import { useUrlState } from "@/hooks/use-url-state";
import { usePathname } from "next/navigation";

type GenerationStage =
  | "uploading"
  | "analyzing"
  | "generating"
  | "saving"
  | "created";

export default function StoryFormPage() {
  const router = useRouter();
  const {
    generateNewStory,
    isLoading,
    isImageLoading,
    clearInputs,
    currentStage,
    currentStory,
  } = useStory();

  const { setUrlState } = useUrlState();
  const [title, setTitle] = useState("");
  const { refresh } = useStories();
  const { user, credits } = useAuth();

  const [maxTokens, setMaxTokens] = useState(2000);
  const [images, setImages] = useState<{ id: string; preview: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentStage === "created") {
      const timer = setTimeout(() => {
        clearInputs();
        router.push(`/story/${currentStory?.id}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStage, router, currentStory?.id, clearInputs]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages({
        id: Math.random().toString(36).substr(2, 9),
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      setUrlState("signin", "chat");
      return;
    }

    // Check if user has enough credits
    if (!credits || credits < 2) {
      toast.error("You don't have enough credits to create a story");
      return;
    }

    // Validate form inputs
    if (!images || !title) {
      toast.error("Please provide both an image and a title");
      return;
    }

    try {
      setUrlState("loading", "chat");
      clearInputs();

      const imageFile = await fetch(images.preview)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }));

      await generateNewStory([imageFile], title, maxTokens);
      setTitle("");
      setImages(null);
      refresh();
    } catch (err) {
      toast.error(`We had issues with that request, please try again 😥`);
    }
  };

  if (isLoading || currentStage === "created") {
    const stageMessages = {
      uploading: "Uploading your image...",
      analyzing: "Analyzing your image...",
      generating: "Generating your story...",
      saving: "Saving your story...",
      created: "Your story has been created! 🎉",
    };

    return (
      <div className="mx-auto h-dvh flex flex-col pt-20 w-full bg-background top-0">
        <p className="text-center text-lg text-muted-foreground mb-6">
          {stageMessages[currentStage]}
        </p>
        {currentStage !== "created" && <Loading />}
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col justify-center py-28 relative">
      <h2 className="text-3xl md:text-4xl font-bold text-center dark:text-slate-200 text-slate-700 mb-8">
        What story are you creating today?
      </h2>

      <StoryForm
        handleSubmit={handleSubmit}
        handleFileSelect={handleFileSelect}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        images={images}
        removeImage={removeImage}
        title={title}
        setTitle={setTitle}
        isSubmitting={isLoading}
        isImageLoading={isImageLoading}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
      />
    </div>
  );
}
