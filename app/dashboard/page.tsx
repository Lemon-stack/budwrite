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
import { UseGenerateStory } from "@/hooks/use-generate-story";

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
  } = UseGenerateStory();

  return (
    <div className="container mx-auto max-w-5xl py-8">
      {!isGenerating && !generatedStory ? (
        <>
          <div className="mb-10 text-center">
            <h3 className="text-4xl font-bold">Welcome Back</h3>
            <p className="text-4xl font-bold">
              What would you like to create today?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Image upload section - horizontal layout */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {/* Upload button */}
                    <div
                      className="flex-shrink-0 h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Image previews */}
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Input field */}
                  <div>
                    <Label htmlFor="title" className="sr-only">
                      Story Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a prompt..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="gap-2"
                disabled={isSubmitting || images.length === 0 || !title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="max-w-3xl mx-auto">
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
                  className={cn(
                    line.startsWith("#") ? "mt-6 text-2xl font-bold" : "my-4"
                  )}
                >
                  {line.startsWith("#") ? line.substring(2) : line}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
