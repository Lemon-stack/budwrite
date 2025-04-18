"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cleanStoryContent } from "@/lib/utils";
import BookDisplayStory from "@/components/dashboard/book-display-story";
import Loading from "@/loading";
import Image from "next/image";
import { X } from "lucide-react";
import Logo from "@/components/logo";

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
  params: Promise<{ id: string }>;
};

export default function PublicStoryPage({ params }: Props) {
  // Use state to store the resolved id
  const [id, setId] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
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
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      <div className="rounded-lg p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {story.title}
        </h1>
        <div className="text-sm text-muted-foreground mb-6">
          Created on {new Date(story.created_at).toLocaleString()}
        </div>

        <Separator className="mb-6" />

        {story.status === "generating" ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-muted-foreground">Generating story...</p>
          </div>
        ) : (
          <BookDisplayStory
            content={story.content}
            title={story.title.replace(/\*/g, "")}
            image={story.image}
          />
        )}

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Want to create your own stories? Sign up now!
          </p>
          <Button
            asChild
            className="bg-purple-500 text-slate-100 hover:bg-purple-600"
          >
            <Link href="/sign-up">Create Your Own Story</Link>
          </Button>
        </div>
      </div>

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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
