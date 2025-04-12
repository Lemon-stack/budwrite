"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStory } from "@/lib/contexts/StoryContext";
import { ImageIcon, Loader2 } from "lucide-react";

export default function CreateStoryPage() {
  const router = useRouter();
  const { generateNewStory, isLoading, error } = useStory();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      await generateNewStory(file, title);
      router.push("/dashboard/history");
    } catch (err) {
      console.error("Error creating story:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create a New Story</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your story"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Upload Image</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or GIF (MAX. 5MB)
                  </p>
                </div>
              )}
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !file || !title}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Story...
            </>
          ) : (
            "Generate Story"
          )}
        </Button>
      </form>
    </div>
  );
}
