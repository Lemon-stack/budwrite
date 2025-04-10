import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploading: boolean;
  error?: string;
}

interface Story {
  title: string;
  pages: { imageUrl: string; text: string }[];
}

export const UseGenerateStory = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [generationComplete, setGenerationComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { user } = useAuth();

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newImages: UploadedImage[] = Array.from(e.target.files).map(
      (file) => ({
        id: nanoid(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
      })
    );

    setImages((prev) => [...prev, ...newImages]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove an image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke object URLs to avoid memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return filtered;
    });
  };

  // Simulate uploading images with progress
  const uploadImages = async () => {
    return Promise.all(
      images.map(async (image) => {
        // Update image to uploading state
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, uploading: true, progress: 0 } : img
          )
        );

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, progress: i } : img
            )
          );
        }

        // Simulate upload completion
        await new Promise((resolve) => setTimeout(resolve, 500));
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, uploading: false, progress: 100 }
              : img
          )
        );

        // Return a fake uploaded URL
        return {
          id: image.id,
          url: `https://api.example.com/images/${image.id}`,
          filename: image.file.name,
        };
      })
    );
  };

  // Simulate streaming response from LLM
  const simulateStreamingResponse = async (storyTitle: string) => {
    setIsGenerating(true);
    setGeneratedStory(null);

    // Sample story based on title
    const story: Story = {
      title: storyTitle,
      pages: [
        {
          imageUrl: "https://api.example.com/images/1",
          text: "Once upon a time in a world of vibrant colors and endless possibilities, a journey began that would change everything.",
        },
        {
          imageUrl: "https://api.example.com/images/2",
          text: "The first image revealed a landscape of breathtaking beauty, where mountains touched the sky and rivers carved their paths through ancient valleys.",
        },
        {
          imageUrl: "https://api.example.com/images/3",
          text: "In the second image, we discovered the hidden village nestled between towering trees, its windows glowing with warm light against the approaching dusk.",
        },
        {
          imageUrl: "https://api.example.com/images/4",
          text: "As we continued our journey, the third image showed us the unexpected encounter with magical creatures that danced in moonlit clearings.",
        },
      ],
    };

    // Simulate streaming by revealing one page at a time
    for (let i = 0; i < story.pages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setGeneratedStory({
        title: story.title,
        pages: story.pages.slice(0, i + 1),
      });
    }

    setIsGenerating(false);
    setGenerationComplete(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || images.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images
      const uploadedImages = await uploadImages();

      // 2. Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Simulate streaming response
      await simulateStreamingResponse(title);

      // 4. Store the generated story ID for redirection
      const storyId = nanoid();
      localStorage.setItem(
        `story-${storyId}`,
        JSON.stringify({
          id: storyId,
          title,
          content: generatedStory,
          images: uploadedImages,
          timestamp: new Date().toISOString(),
        })
      );

      // 5. We'll redirect after the story is fully generated
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);
  return {
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
  };
};
