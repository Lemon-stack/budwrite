"use client";

import type React from "react";

import { motion } from "framer-motion";
import { ImagePlus, Loader2, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import StoryForm from "@/components/dashboard/story-form";
import { UseGenerateStory } from "@/hooks/use-generate-story";
import { StoryDisplay } from "@/components/dashboard/story-display";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { user, isLoading } = useAuth();
  const {
    isGenerating,
    generatedStory,
    handleSubmit,
    handleFileSelect,
    fileInputRef,
    images,
    removeImage,
    title,
    setTitle,
    isSubmitting,
  } = UseGenerateStory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Content area with scrolling */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Generating your story...</p>
            </div>
          ) : generatedStory ? (
            <div className="w-full max-w-5xl">
              <StoryDisplay
                story={generatedStory}
                userType={user?.userType || "free"}
              />
            </div>
          ) : (
            <StoryForm
              handleSubmit={handleSubmit}
              handleFileSelect={handleFileSelect}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              images={images}
              removeImage={removeImage}
              title={title}
              setTitle={setTitle}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
