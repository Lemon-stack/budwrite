"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

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

type Props = {
  params: { id: string };
};

export default function StoryPage({ params }: Props) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", params.id)
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
  }, [params.id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check out this story",
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying the URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDownload = async () => {
    if (!story) return;

    try {
      // Create text content
      const content = `${story.title}\n\n${story.content}`;

      // Create and download file
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

  if (loading) {
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

      <div className="mb-6 rounded-lg overflow-hidden max-w-2xl mx-auto">
        <img
          src={story.image}
          alt="Story image"
          className="w-full h-auto object-cover"
        />
      </div>

      {story.status === "generating" ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-muted-foreground">Generating your story...</p>
        </div>
      ) : (
        <div
          className="prose prose-purple max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      )}

      <div className="bg-muted/30 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Source Image</h2>
        <div className="flex items-start gap-6">
          <div className="w-1/4 rounded-md overflow-hidden">
            <img
              src={story.image}
              alt="Source image for the story"
              className="w-full h-auto"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              This story was generated based on the image you uploaded. Our AI
              analyzed the visual elements and created a unique narrative
              inspired by what it saw.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Original Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
