"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Upload, ImagePlus, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/logo";

export default function OnboardingUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleImageUpload = useCallback((file: File) => {
    if (file.type === "image/svg+xml") {
      toast.error("SVG files are not supported for story generation");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/svg+xml") {
        toast.error("SVG files are not supported for story generation");
        return;
      }
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "image/svg+xml") {
        toast.error("SVG files are not supported for story generation");
        return;
      }
      handleImageUpload(file);
    }
  };

  const handleContinue = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to continue");
      return;
    }

    setUploading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error("Please sign in to continue");
        return;
      }

      const fileName = `${user.data.user.id}-${Date.now()}.${selectedImage.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("stories")
        .upload(fileName, selectedImage);

      if (uploadError) {
        throw uploadError;
      }

      toast.success("Image uploaded successfully!");
      router.push(`/onboarding/story?image=${fileName}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome</h1>
          <p className="mt-2 text-slate-500">
            Let's begin by uploading an image
          </p>
        </div>

        <div
          className={`relative mt-8 ${
            dragActive
              ? "border-purple-500 bg-purple-50"
              : "border-slate-200 bg-slate-50"
          } border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />

          {imagePreview ? (
            <div className="p-4 flex flex-col items-center">
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Selected image preview"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm hidden text-slate-500 mb-2">
                {selectedImage?.name}
              </p>
              <label
                htmlFor="image-upload"
                className="text-sm font-medium text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                Choose a different image
              </label>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center p-8 cursor-pointer"
            >
              <Upload className="h-10 w-10 text-slate-400 mb-4" />
              <p className="text-slate-700 font-medium mb-1">
                Drag and drop your image here
              </p>
              <p className="text-sm text-slate-500 mb-4">
                or click to browse files
              </p>
              <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                Select Image
              </span>
            </label>
          )}
        </div>

        <div className="pt-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedImage || uploading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg transition-all"
          >
            {uploading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
