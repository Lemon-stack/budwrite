"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

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
  isImageLoading?: boolean;
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
}: StoryFormProps) {
  const { credits } = useAuth();

  // Calculate how many images the user can upload based on their credits
  // Each image costs 1 credit, and story generation costs 1 credit
  const maxImages = Math.max(0, (credits || 0) - 1);
  const canUploadMore = images.length < maxImages;

  const handleFileSelectWithCredits = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newImagesCount = images.length + files.length;
    if (newImagesCount > maxImages) {
      toast.error(
        `You can only upload ${maxImages} image(s) with your current credits`
      );
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
                    canUploadMore
                      ? "cursor-pointer hover:bg-muted/50"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => canUploadMore && fileInputRef.current?.click()}
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
                    multiple
                    onChange={handleFileSelectWithCredits}
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

              {/* Credits info */}
              <div className="text-sm text-muted-foreground">
                {maxImages > 0 ? (
                  <p>
                    You can upload up to {maxImages} image(s) with your current
                    credits. Each image costs 1 credit, and story generation
                    costs 1 credit.
                  </p>
                ) : (
                  <p className="text-red-500">
                    You don't have enough credits to create a story. Please
                    purchase more credits.
                  </p>
                )}
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
                    isSubmitting ||
                    images.length === 0 ||
                    !title.trim() ||
                    !canUploadMore
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
