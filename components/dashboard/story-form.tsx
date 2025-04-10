"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  images: Array<{
    id: string;
    preview: string;
  }>;
  removeImage: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
}

export default function StoryForm({
  handleSubmit,
  handleFileSelect,
  fileInputRef,
  images,
  removeImage,
  title,
  setTitle,
  isSubmitting,
}: StoryFormProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
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
