"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  Share2,
  ImageIcon,
  X,
  Eye,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cleanStoryContent } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Story = {
  id: string;
  title: string;
  content: string;
  image: string;
  status: string;
  created_at: string;
};

// Update Props to define params as a Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default function StoryPage({ params }: Props) {
  // Use state to store the resolved id
  const [id, setId] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [volume, setVolume] = useState(1);

  // Resolve the params Promise to get the id
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function loadStory() {
      if (!id) return; // Wait until id is resolved
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setStory(data);
      } catch (error) {
        toast.error("Failed to load story");
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [id]);

  useEffect(() => {
    // Initialize voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman")
      );
      setCurrentVoice(femaleVoice || voices[0]);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check out this story",
        url: window.location.href,
      });
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDownload = async () => {
    if (!story) return;

    try {
      const content = cleanStoryContent(story.content);
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${story.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Story downloaded!");
    } catch (error) {
      toast.error("Failed to download story");
    }
  };

  const handleDownloadImage = async () => {
    if (!story?.image) return;

    try {
      const response = await fetch(story.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${story.title.toLowerCase().replace(/\s+/g, "-")}-image.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handlePlay = () => {
    if (!story) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const content = cleanStoryContent(story.content);
    const utterance = new SpeechSynthesisUtterance(content);

    if (currentVoice) {
      utterance.voice = currentVoice;
    }

    utterance.volume = volume;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      handlePlay();
    }
  };

  const formatContent = (content: string) => {
    const cleanedContent = cleanStoryContent(content);
    if (cleanedContent.includes("<p>") || cleanedContent.includes("<div>")) {
      return cleanedContent;
    }
    return cleanedContent
      .split(/\n\n+/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
      .join("");
  };

  if (loading || id === null) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Story not found</h1>
        <p className="text-muted-foreground mb-6">
          The story you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{story.title}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Generated on {new Date(story.created_at).toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {story.image && (
        <div className="mb-8 max-w-md mr-auto">
          <div
            className="border rounded-lg overflow-hidden bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => setImageModalOpen(true)}
          >
            <div className="flex items-center px-3 py-2 border-b bg-muted/30">
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Story Image</span>
              <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </span>
            </div>
            <div className="p-3">
              <img
                src={story.image}
                alt="Story preview"
                className="w-full h-32 object-cover rounded opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      )}

      {story.status === "generating" ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-muted-foreground">Generating your story...</p>
        </div>
      ) : (
        <div
          className="prose prose-purple max-w-none mb-10 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(story.content) }}
        />
      )}

      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <DialogClose className="absolute right-2 top-2 z-10 rounded-full bg-black/40 p-1 text-white hover:bg-black/60">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <img
              src={story.image || "/placeholder.svg"}
              alt="Story image"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadImage}
                className="text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-muted/30 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Source Image</h2>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-1/5 rounded-md overflow-hidden mb-4 md:mb-0">
            <img
              src={story.image || "/placeholder.svg"}
              alt="Source image for the story"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              This story was generated based on the image you uploaded. Our AI
              analyzed the visual elements and created a unique narrative
              inspired by what it saw.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadImage}>
              <Download className="h-4 w-4 mr-2" />
              Download Original Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
