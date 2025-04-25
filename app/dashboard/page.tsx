"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/lib/contexts/StoryContext";
import StoryForm from "@/components/dashboard/story-form";
import { Loader2 } from "lucide-react";
import Loading from "@/loading";
import { toast } from "sonner";

type GenerationStage =
  | "uploading"
  | "analyzing"
  | "generating"
  | "saving"
  | "created";

export default function DashboardPage() {
  const router = useRouter();
  const {
    generateNewStory,
    isLoading,
    isImageLoading,
    clearInputs,
    currentStage,
    currentStory,
  } = useStory();
  const [title, setTitle] = useState("");
  const [maxTokens, setMaxTokens] = useState(2000);
  const [images, setImages] = useState<{ id: string; preview: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentStage === "created") {
      const timer = setTimeout(() => {
        clearInputs();
        router.push(`/dashboard/story/${currentStory?.id}`);
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
    if (!images || !title) return;

    try {
      setTitle("");
      setImages(null);
      clearInputs();

      const imageFile = await fetch(images.preview)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }));

      const storyId = await generateNewStory([imageFile], title, maxTokens);
    } catch (err) {
      toast.error(`Error creating story: ${err}`);
      console.error("Error creating story:", err);
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
      <div className="mx-auto h-dvh flex flex-col pt-20 relative">
        <p className="text-center text-lg text-muted-foreground mb-6">
          {stageMessages[currentStage]}
        </p>
        {currentStage !== "created" && <Loading />}
      </div>
    );
  }

  return (
    <div className="mx-auto h-dvh flex flex-col pt-16 relative">
      <h2 className="text-4xl md:text-5xl font-bold text-center dark:text-slate-200 text-slate-700 mb-6">
        What story do you want to create today?
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
