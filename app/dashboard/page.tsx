"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/lib/contexts/StoryContext";
import StoryForm from "@/components/dashboard/story-form";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { generateNewStory, isLoading, isImageLoading, error, clearInputs } =
    useStory();
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<Array<{ id: string; preview: string }>>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { credits } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            preview: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 || !title) return;

    try {
      setTitle("");
      setImages([]);
      clearInputs();

      const imageFile = await fetch(images[0].preview)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }));

      const storyId = await generateNewStory(imageFile, title);
      router.push(`/dashboard/story/${storyId}`);
    } catch (err) {
      console.error("Error creating story:", err);
    }
  };

  return (
    <div className="mx-auto py-10">
      <div className="hidden items-center justify-end gap-4 mb-20 ml-auto">
        <div className="bg-muted px-4 py-2 rounded-lg">
          <span className="text-sm text-muted-foreground">Credits: </span>
          <span className="font-semibold">{credits}</span>
        </div>
        <Link
          href="/buy-credits"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2"
        >
          Buy Credits
        </Link>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-200 mb-6">
        What do you want to create today?
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
      />
    </div>
  );
}
