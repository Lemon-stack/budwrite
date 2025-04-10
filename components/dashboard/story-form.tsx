"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerateStory } from "@/hooks/use-generate-story";

export default function StoryForm() {
  const {
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
    <div className="fixed bottom-0 left-0 mx-auto flex items-center justify-center right-0 max-w-5xl bg-background z-10 p-4 border-t">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
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
              <div className="flex items-center gap-4">
                <div className="flex-1">
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
                <Button
                  type="submit"
                  className="gap-2 flex-shrink-0"
                  disabled={
                    isSubmitting || images.length === 0 || !title.trim()
                  }
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
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
