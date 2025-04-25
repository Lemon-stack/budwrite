"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoryFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  images: { id: string; preview: string } | null;
  removeImage: () => void;
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
  isImageLoading?: boolean;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
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
  isImageLoading = false,
  maxTokens,
  setMaxTokens,
}: StoryFormProps) {
  const { credits } = useAuth();

  // Calculate if user can upload an image based on their credits
  // Each image costs 1 credit, and story generation costs 1 credit
  const canUpload = (credits || 0) >= 2;

  const handleFileSelectWithCredits = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (!canUpload) {
      toast.error("You don't have enough credits to create a story");
      return;
    }

    handleFileSelect(e);
  };

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
                  className={`flex-shrink-0 h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                    canUpload && !images
                      ? "cursor-pointer hover:bg-muted/50"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    canUpload && !images && fileInputRef.current?.click()
                  }
                >
                  {isImageLoading ? (
                    <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelectWithCredits}
                    className="hidden"
                  />
                </div>

                {/* Image preview */}
                {images && (
                  <div className="relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden group">
                    <img
                      src={images.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Credits info */}
              <div className="text-sm text-muted-foreground">
                {credits && credits < 2 ? (
                  <p className="text-red-500">
                    You don't have enough credits to create a story. Please
                    purchase more credits.
                  </p>
                ) : null}
              </div>

              {/* Input field and story length selection */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:flex-1">
                  <Label htmlFor="title" className="sr-only">
                    Story Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your story title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    value={maxTokens.toString()}
                    onValueChange={(value) => setMaxTokens(parseInt(value))}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Story Length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">
                        Short Story (2k tokens)
                      </SelectItem>
                      <SelectItem
                        value="5000"
                        disabled={!credits || credits < 4}
                      >
                        Long Story (5k tokens)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto gap-2"
                  disabled={
                    isSubmitting || !images || !title.trim() || !canUpload
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
