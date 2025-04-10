import { useRouter } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  createContext,
  useMemo,
  useContext,
} from "react";
import { nanoid } from "nanoid";
import { useAuth } from "@/context/auth";

interface GenerateStoryContextType {
  title: string;
  setTitle: (title: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  images: UploadedImage[];
  setImages: (images: UploadedImage[]) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generatedStory: string;
  setGeneratedStory: (generatedStory: string) => void;
  generationComplete: boolean;
  setGenerationComplete: (generationComplete: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploading: boolean;
  error?: string;
}

const GenerateStoryContext = createContext<GenerateStoryContextType>({
  title: "",
  setTitle: () => {},
  prompt: "",
  setPrompt: () => {},
  images: [],
  setImages: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  isGenerating: false,
  setIsGenerating: () => {},
  generatedStory: "",
  setGeneratedStory: () => {},
  generationComplete: false,
  setGenerationComplete: () => {},
  fileInputRef: { current: null },
  handleFileSelect: () => {},
  removeImage: () => {},
  handleSubmit: async () => {},
});

const GenerateStoryProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [generationComplete, setGenerationComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    setGeneratedStory("");

    // Sample story based on title
    const story = `# ${storyTitle}
      
      Once upon a time in a world of vibrant colors and endless possibilities, a journey began that would change everything. The images captured moments frozen in time, each telling a part of the story.
      
      The first image revealed a landscape of breathtaking beauty, where mountains touched the sky and rivers carved their paths through ancient valleys. This was where our adventure began, under the watchful gaze of the eternal peaks.
      
      In the second image, we discovered the hidden village nestled between towering trees, its windows glowing with warm light against the approaching dusk. The villagers welcomed travelers with open arms and hearts full of stories.
      
      As we continued our journey, the third image showed us the unexpected encounter with magical creatures that danced in moonlit clearings. Their laughter echoed through the forest, a melody of joy and ancient wisdom.
      
      The final image captured the moment of revelation, when all paths converged and the purpose of our journey became clear. It wasn't about the destination, but about the connections we made and the growth we experienced along the way.
      
      And so, our story comes full circle, ready to inspire new adventures and create new memories. The end is just another beginning, waiting to be discovered.`;

    // Simulate streaming by revealing one character at a time
    const storyChars = story.split("");

    for (let i = 0; i < storyChars.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15)); // Adjust speed as needed
      setGeneratedStory((prev) => prev + storyChars[i]);
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
  const value = useMemo(
    () => ({
      title,
      setTitle,
      prompt,
      setPrompt,
      images,
      setImages,
      isSubmitting,
      setIsSubmitting,
      isGenerating,
      setIsGenerating,
      generatedStory,
      setGeneratedStory,
      generationComplete,
      setGenerationComplete,
      fileInputRef,
      handleFileSelect,
      removeImage,
      handleSubmit,
    }),
    [
      title,
      prompt,
      images,
      isSubmitting,
      isGenerating,
      generatedStory,
      generationComplete,
      handleFileSelect,
      removeImage,
      handleSubmit,
    ]
  );

  return (
    <GenerateStoryContext.Provider value={value}>
      {children}
    </GenerateStoryContext.Provider>
  );
};

export default GenerateStoryProvider;

export const useGenerateStory = () => useContext(GenerateStoryContext);
