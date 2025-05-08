"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Loader2, Pencil, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { useUrlState } from "@/hooks/use-url-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { TypewriterInput } from "../ui/typewriter-input";
import { useState } from "react";

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
  const { credits, user } = useAuth();
  const { setUrlState } = useUrlState();
  const router = useRouter();

  // Calculate if user can upload an image based on their credits
  // Each image costs 1 credit, and story generation costs 1 credit

  const handleFileSelectWithCredits = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    // Let the file be selected - credit check will happen on form submission
    handleFileSelect(e);
  };
  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="shadow-sm bg-primary-foreground rounded-xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Image upload section - horizontal layout */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {/* Upload button */}
                <div
                  className={`flex-shrink-0 h-14 w-14 border-2 border-dashed rounded-xl border-muted-foreground flex items-center justify-center transition-colors ${
                    !images
                      ? "cursor-pointer hover:bg-muted/50"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isImageLoading ? (
                    <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Image preview */}
                {images && (
                  <div className="relative flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden group">
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
                  <TypewriterInput
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl text-base bg-primary-foreground placeholder:text-muted-foreground placeholder:text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    typingSpeed={70}
                    erasingSpeed={70}
                    delayBetweenSentences={1500}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    value={maxTokens.toString()}
                    onValueChange={(value) => setMaxTokens(parseInt(value))}
                  >
                    <SelectTrigger className="w-full bg-primary-foreground border-border focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[180px]">
                      <SelectValue>Short Story (2 Credits)</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-primary-foreground">
                      <SelectItem value="3000">
                        Short Story (2 Credits)
                      </SelectItem>

                      <SelectItem
                        value="9000"
                        disabled={!credits || credits < 6}
                      >
                        Cool Story (6 Credits)
                      </SelectItem>
                      <SelectItem
                        value="13000"
                        disabled={!credits || credits < 8}
                      >
                        Epic Story (8 Credits)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 gap-2"
                  disabled={isSubmitting || !images || !title.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
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
