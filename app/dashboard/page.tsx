"use client";

import type React from "react";

import { motion } from "framer-motion";
import { ImagePlus, Loader2, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedText } from "@/components/landing-page/animated-text";
import { useAuth } from "@/context/auth";
import { useGenerateStory } from "@/hooks/use-generate-story";

export default function Home() {
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
  } = useGenerateStory();

  return (
    <div className="relative flex flex-col h-full">
    {/* Content area with scrolling */}
    <div
      className={cn(
        "flex-1 overflow-y-auto pb-32", // Increased padding to ensure content isn't hidden behind form
        generatedStory ? "block" : "flex items-center justify-center",
      )}
    >
      {!isGenerating && !generatedStory ? (
        <div className="mb-10 text-center">
          <h3 className="text-4xl font-bold">Welcome Back</h3>
          <p className="text-4xl font-bold">What would you like to create today?</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
          </div>

          <div className="relative">
            {isGenerating && (
              <div className="absolute -top-10 left-0 flex items-center gap-2 text-sm text-purple-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>writing your story...</span>
              </div>
            )}

            <div className="prose prose-purple max-w-none">
              {generatedStory.split("\n").map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(line.startsWith("#") ? "mt-6 text-2xl font-bold" : "my-4")}
                >
                  {line.startsWith("#") ? line.substring(2) : line}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

    
  </div>
  );
}
